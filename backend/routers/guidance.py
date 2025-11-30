from __future__ import annotations
import json
import random
import re
from typing import Any, Dict, List, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field, HttpUrl, ValidationError

from ..core.config import settings
from ..core.gemini_client import complete as gemini_complete

router = APIRouter(prefix="/api", tags=["guidance"])


# =========================
# ======  MODELS  ========
# =========================

class GuidanceRequest(BaseModel):
    problem: str
    platform: Optional[str] = None
    visuals: List[str] = []
    voice_enabled: bool = False
    approach: str = "both"   # naive | optimized | both


class GuidanceResponse(BaseModel):
    hints: list[str]
    visual_payload: Optional[Dict[str, Any]] = None
    warning: str | None = None


class FlowOption(BaseModel):
    id: str
    label: str = Field(..., description="Short choice text that avoids code snippets")
    reason: str = Field(..., description="Why this choice matters for the step")
    correct: bool


class FlowStep(BaseModel):
    id: str
    title: str
    description: str
    options: list[FlowOption]


class FlowchartRequest(BaseModel):
    problem: str
    approach: str | None = "both"


class FlowchartResponse(BaseModel):
    steps: list[FlowStep]
    warning: str | None = None


class FlowchartPayload(BaseModel):
    steps: list[FlowStep]


class StepLink(BaseModel):
    title: str = Field(..., description="Readable title for the learning resource")
    url: HttpUrl = Field(..., description="Direct link that explains the step")
    summary: str = Field(..., description="Why this link helps with the step")


class StepLinkRequest(BaseModel):
    problem: str
    step_title: str
    step_description: str


class StepLinkResponse(BaseModel):
    links: list[StepLink]
    warning: str | None = None


# =========================
# === NO-CODE ENFORCER ===
# =========================

def enforce_no_code(text: str) -> str:
    guard_phrases = ["```", "public static", "def ", "class ", "#include", ";"]
    sanitized = text
    for guard in guard_phrases:
        if guard.lower() in sanitized.lower():
            sanitized = sanitized.replace(guard, "[code removed]")
    return sanitized


# =========================
# ==== VISUAL MATCHER ====
# =========================

def suggest_visuals(problem: str) -> list[str]:
    lowered = problem.lower()

    if "stack" in lowered:
        return ["stack"]

    if "queue" in lowered or "bfs" in lowered:
        return ["queue", "graph_bfs"]

    if "binary" in lowered or "search" in lowered:
        return ["binary_search"]

    if "dp" in lowered or "dynamic" in lowered or "grid" in lowered:
        return ["dynamic_programming"]

    if "graph" in lowered or "node" in lowered or "edge" in lowered:
        return ["graph_bfs"]

    return ["stack", "queue", "binary_search"]


# =========================
# === FALLBACK BUILDER ===
# =========================

def fallback_hints(problem: str, visuals: list[str], approach: str) -> list[str]:
    hints = []

    if approach in ("naive", "both"):
        hints.extend([
            "Naive Hints:",
            f"1. Data Structure(s): Start simple, consider {', '.join(visuals)}",
            "2. Problem Type: General reasoning / exploration",
            "3. Visualization: Sketch the input & output first",
            "4. Brute-force Idea: Try all possible choices",
            "5. Why it fails: Too many repeated paths",
            "6. What to notice for improvement: Repetition & overlapping work",
        ])

    if approach in ("optimized", "both"):
        hints.extend([
            "Optimized Hints:",
            "1. Better Structure / Technique: Use organized traversal",
            "2. Conceptual Improvement: Stop repeated work",
            "3. Pattern Being Used: Pruning / Dynamic approach",
            "4. What work is skipped: Duplicate states",
            "5. Complexity Improvement: Lower than brute force",
            "6. How to explain in interview: Show how structure avoids recomputation",
        ])

    return [enforce_no_code(h) for h in hints]


def shuffle_options(step: FlowStep) -> FlowStep:
    shuffled = step.options.copy()
    random.shuffle(shuffled)
    return FlowStep(**{**step.dict(), "options": shuffled})


def _attempt_json_load(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        text_without_trailing_commas = re.sub(r",(\s*[}\]])", r"\1", text)

        if text_without_trailing_commas != text:
            return json.loads(text_without_trailing_commas)

        raise exc


def parse_flowchart_text(ai_text: str) -> list[FlowStep]:
    cleaned = re.sub(r"^```json", "", ai_text.strip(), flags=re.IGNORECASE).strip()
    cleaned = re.sub(r"^```", "", cleaned).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()

    load_errors: list[Exception] = []
    bracket_match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)

    for candidate in (cleaned, bracket_match.group(0) if bracket_match else None):
        if not candidate:
            continue

        try:
            raw = _attempt_json_load(candidate)
            break
        except json.JSONDecodeError as err:
            load_errors.append(err)
    else:
        raise load_errors[-1] if load_errors else ValueError("No JSON object found in Gemini output")

    try:
        payload = FlowchartPayload.parse_obj(raw)
    except ValidationError:
        payload = FlowchartResponse.parse_obj(raw)

    return payload.steps


def sanitize_flow_steps(steps: list[FlowStep]) -> list[FlowStep]:
    cleaned_steps: list[FlowStep] = []

    for step in steps:
        safe_options = [
            FlowOption(
                **{
                    **option.dict(),
                    "label": enforce_no_code(option.label),
                    "reason": enforce_no_code(option.reason),
                }
            )
            for option in step.options
        ]

        cleaned_steps.append(
            FlowStep(
                **{
                    **step.dict(),
                    "options": safe_options,
                }
            )
        )

    return cleaned_steps


def parse_step_links(ai_text: str) -> list[StepLink]:
    cleaned = re.sub(r"^```json", "", ai_text.strip(), flags=re.IGNORECASE).strip()
    cleaned = re.sub(r"^```", "", cleaned).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()

    raw = _attempt_json_load(cleaned)
    links = raw.get("links") if isinstance(raw, dict) else None

    if not isinstance(links, list):
        raise ValueError("Gemini did not return link list")

    parsed_links: list[StepLink] = []
    for link in links:
        try:
            parsed_links.append(
                StepLink(
                    title=enforce_no_code(str(link.get("title", "")).strip()),
                    url=link.get("url", ""),
                    summary=enforce_no_code(str(link.get("summary", "")).strip()),
                )
            )
        except ValidationError:
            continue

    if not parsed_links:
        raise ValueError("No valid links produced by Gemini")

    return parsed_links


# =========================
# ======  ROUTES  ========
# =========================

@router.post("/mentor", response_model=GuidanceResponse)
def mentor(request: GuidanceRequest) -> GuidanceResponse:
    visuals = request.visuals if request.visuals else suggest_visuals(request.problem)
    hints = fallback_hints(request.problem, visuals, request.approach)

    warning = None
    if any(token in request.problem for token in ("```", "#include", "public static", "def")):
        warning = "Code-like fragments removed."

    return GuidanceResponse(
        hints=hints,
        warning=warning,
    )


@router.post("/step-links", response_model=StepLinkResponse)
def step_links(request: StepLinkRequest) -> StepLinkResponse:
    warning = None

    if not settings.gemini_api_key:
        return StepLinkResponse(
            links=[],
            warning="Gemini key not configured. Unable to fetch links for this step.",
        )

    prompt = f"""
You are LogicHinter — an AI that shares learning resources, not code.

Provide 2-3 trustworthy links that teach a programmer how to perform the following problem-solving step without giving them the solution code.

Step title: {request.step_title}
Step description: {request.step_description}
Problem context: {request.problem}

Rules:
- Only return links to articles or docs that explain the technique, not full solutions.
- Prefer docs, reputable blogs, or guides on the specific step.
- Do not include any code snippets or pseudocode in the summaries.
- Keep URLs HTTPS when possible.
- Respond ONLY with JSON like:
{{"links":[{{"title":"...","url":"https://...","summary":"..."}}]}}
"""

    try:
        resp = gemini_complete(prompt)
        ai_text = resp["candidates"][0]["content"]["parts"][0]["text"]
        links = parse_step_links(ai_text)
    except Exception as exc:
        warning = f"Gemini failed to fetch links: {exc}"
        links = []

    return StepLinkResponse(
        links=links,
        warning=warning,
    )


@router.post("/mentor/ai", response_model=GuidanceResponse)
def mentor_ai(request: GuidanceRequest) -> GuidanceResponse:

    print("✅ Gemini key loaded:", bool(settings.gemini_api_key))

    visuals = request.visuals if request.visuals else suggest_visuals(request.problem)
    warning = None

    # Default: fallback
    hints = fallback_hints(request.problem, visuals, request.approach)

    if not settings.gemini_api_key:
        visual_payload = {
            "visual_type": "grid",
            "visual_data": {
                "matrix": [
                    ["A1", "A2", "A3", "A4"],
                    ["B1", "B2", "B3", "B4"],
                    ["C1", "C2", "C3", "C4"],
                ]
            },
            "steps": [
                {"action": "highlight", "target": "A1"},
                {"action": "highlight", "target": "B2"},
                {"action": "highlight", "target": "C3"},
            ],
        }

        return GuidanceResponse(
            hints=hints,
            visual_payload=visual_payload,
            warning="Gemini key not configured. Using fallback hints."
        )

    try:
        prompt = f"""
You are LogicHinter — an AI that teaches algorithms without showing code.

Rules:
- NEVER provide code
- ONLY give logical hints
- Be concise
- Follow the structure exactly

User selected approach: {request.approach}

Use this exact format:

If naive or both:
Naive Hints:
1. Data Structure(s): ...
2. Problem Type: ...
3. Visualization: ...
4. Brute-force Idea: ...
5. Why it Fails: ...
6. What to Notice for Improvement: ...

If optimized or both:
Optimized Hints:
1. Better Structure / Technique: ...
2. Conceptual Improvement: ...
3. Pattern Being Used: ...
4. What Work is Skipped: ...
5. Complexity Improvement: ...
6. How to Explain in an Interview: ...

Problem:
{request.problem}

Detected visuals:
{', '.join(visuals)}

Do NOT add explanations or greetings.
Only output the structured hints.
"""

        resp = gemini_complete(prompt)

        ai_text = resp["candidates"][0]["content"]["parts"][0]["text"]

        ai_hints = [
            enforce_no_code(line.strip("•- "))
            for line in ai_text.split("\n")
            if line.strip()
        ]

        hints = ai_hints

    except Exception as e:
        warning = f"Gemini failed: {e}. Using fallback hints."

    if any(token in request.problem for token in ("```", "#include", "public static", "def")):
        warning = (warning + " Code fragments removed.") if warning else "Code fragments removed."

    visual_payload = {
        "visual_type": "grid",
        "visual_data": {
            "matrix": [
                ["A1", "A2", "A3", "A4"],
                ["B1", "B2", "B3", "B4"],
                ["C1", "C2", "C3", "C4"],
            ]
        },
        "steps": [
            {"action": "highlight", "target": "A1"},
            {"action": "highlight", "target": "B2"},
            {"action": "highlight", "target": "C3"},
        ],
    }

    return GuidanceResponse(
        hints=hints,
        visual_payload=visual_payload,
        warning=warning,
    )


@router.post("/flowchart", response_model=FlowchartResponse)
def flowchart_builder(request: FlowchartRequest) -> FlowchartResponse:
    warning = None
    selected_approach = request.approach or "both"

    if not settings.gemini_api_key:
        return FlowchartResponse(
            steps=[],
            warning="Gemini key not configured. Unable to generate flowchart.",
        )

    try:
        prompt = f"""
You are LogicHinter, a thinking companion that guides users through algorithms without providing code.

Build an in-depth, multi-level decision flowchart the user will click through step by step.

Constraints:
- 5 to 8 steps that move from understanding to validation.
- Each step must have 3 or 4 options with EXACTLY one correct.
- Vary the order of the correct option so it is NOT always first.
- No code or pseudocode. Keep options and reasons short and actionable.
- Focus on reasoning: why each option helps or harms progress.
- Encourage exploration, baselines, pattern choice, optimization direction, and edge-case validation.
- User selected the "{selected_approach}" branch. If naive, emphasize baselines, brute-force anchors, and exploration. If optimized, emphasize pruning, structure choices, and efficiency trade-offs. If both, balance the path.

Return ONLY valid JSON in this structure:
{{
  "steps": [
    {{
      "id": "slug-step-name",
      "title": "Short title",
      "description": "What the user should consider now",
      "options": [
        {{ "id": "option-id", "label": "Choice text", "reason": "Why this helps or hurts", "correct": true }}
      ]
    }}
  ]
}}

Problem:
{request.problem}
"""

        resp = gemini_complete(prompt)
        ai_text = resp["candidates"][0]["content"]["parts"][0]["text"]
        ai_steps = parse_flowchart_text(ai_text)

        sanitized = sanitize_flow_steps(ai_steps)
        steps = [shuffle_options(step) for step in sanitized]
    except Exception as e:
        warning = f"Gemini failed: {e}."
        steps = []

    return FlowchartResponse(
        steps=steps,
        warning=warning,
    )