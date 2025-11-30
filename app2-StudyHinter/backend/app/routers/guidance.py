"""
SECTION 1: Just edit your prompts for customization
These are the parts each new project will customize:
    • mentor_prompt()        → define "how the AI should talk"
    • flowchart_prompt()     → define "how flowcharts should look"
    • links_prompt()         → define "how links should be fetched"

SECTION 2: The rest is boilerplate
You won't need to change anything here. 
"""

from __future__ import annotations
import json
import random
import re
from typing import Any, Dict, List, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field, HttpUrl

from ..core.config import settings
from ..core.gemini_client import complete as gemini_complete

router = APIRouter(prefix="/api", tags=["skeleton"])

# ================================================================
#                 SECTION 1 — CHANGE THESE
# ================================================================

def mentor_prompt(query: str) -> str:
    """
    Change THIS prompt depending on the app.

    Examples:
      • LogicHinter → “Give reasoning hints”
      • StudyHinter → “Explain like a teacher”
      • RecipeHinter → “Describe cooking steps”
      • MoodHinter → “Give emotional support”
    """
    return f"""
You are a helpful assistant.

User asked:
{query}

Respond in short bullet points.
"""


def flowchart_prompt(problem: str) -> str:
    return f"""
You are StudyHinter — an AI that creates children’s quiz flowcharts using real-world images.

Your task:
Generate a MULTIPLE-CHOICE QUESTION FLOWCHART where every option is a realistic visual scene that Unsplashs can search.

STRICT RULES FOR OPTIONS:
Each label must be something a Grade 4 student could name by looking.
1. Every option.label must be a short, concrete, real-world visual phrase (3–6 words).
2. The label MUST be used for image search — so it must work as a Unsplash query.
3. The label must NOT repeat any words from:
   - the step title
   - the step description
   - the topic name
4. The label must NOT be a scientific term or process name.
5. The label must describe a REAL photographable scene.
6. The label must be unique across all options.
7. EXACTLY one option must be correct.



STRUCTURE OF THE FLOWCHART:
- 4 to 7 steps
- Each step must contain:
    • "id": string
    • "title": a simple question
    • "description": child-friendly phrasing of the question
    • "options": exactly 3 choices (A, B, C)
- EXACTLY one option must have `"correct": true`
- Two options must be plausible but wrong.

JSON-ONLY RESPONSE FORMAT:

{{
  "steps": [
    {{
      "id": "step-1",
      "title": "Question title",
      "description": "Child-friendly question?",
      "options": [
        {{ "id": "A", "label": "scene description", "reason": "why correct/incorrect", "correct": true }},
        {{ "id": "B", "label": "scene description", "reason": "why incorrect", "correct": false }},
        {{ "id": "C", "label": "scene description", "reason": "why incorrect", "correct": false }}
      ]
    }}
  ]
}}

TOPIC: {problem}
"""



def links_prompt(problem: str, step_title: str, step_desc: str) -> str:
    """
    Change THIS prompt for link generation.
    """

    return f"""
Provide 2–3 helpful links for:

Problem: {problem}
Step: {step_title}
Meaning: {step_desc}

Return JSON ONLY:
{{
  "links": [
    {{ "title": "...", "url": "https://...", "summary": "..." }}
  ]
}}
"""
# ================================================================
#                SECTION 2 — CORE ENGINE (DON'T NEED TO TOUCH)
# ================================================================

class MentorRequest(BaseModel):
    query: str


class MentorResponse(BaseModel):
    output: list[str]
    warning: Optional[str] = None


class FlowOption(BaseModel):
    id: str
    label: str
    reason: str
    correct: bool
    image_url: Optional[str] = None


class FlowStep(BaseModel):
    id: str
    title: str
    description: str
    options: list[FlowOption]


class FlowchartRequest(BaseModel):
    problem: str


class FlowchartResponse(BaseModel):
    steps: list[FlowStep]
    warning: Optional[str] = None


class StepLink(BaseModel):
    title: str
    url: HttpUrl
    summary: str


class StepLinkRequest(BaseModel):
    problem: str
    step_title: str
    step_description: str


class StepLinkResponse(BaseModel):
    links: list[StepLink]
    warning: Optional[str] = None

#json cleaner + shuffler
def clean_json(text: str) -> dict:
    cleaned = (
        text.replace("```json", "")
        .replace("```", "")
        .strip()
    )
    match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
    if match:
        cleaned = match.group(0)
    return json.loads(cleaned)


def shuffle_options(step: FlowStep) -> FlowStep:
    options = step.options.copy()
    random.shuffle(options)
    return FlowStep(**{**step.dict(), "options": options})

#routes
@router.post("/mentor", response_model=MentorResponse)
def mentor(request: MentorRequest) -> MentorResponse:
    if not settings.gemini_api_key:
        return MentorResponse(output=[], images=[], warning="Missing Gemini key")

    try:
        prompt = mentor_prompt(request.query)
        resp = gemini_complete(prompt)
        text = resp["candidates"][0]["content"]["parts"][0]["text"]
        lines = [line.strip() for line in text.split("\n") if line.strip()]

        # image fetching
        image = fetch_unsplash_image(request.query)  # one per explanation
        images = [image] if image else []

        return MentorResponse(output=lines, images=images)
    except Exception as e:
        return MentorResponse(output=[], images=[], warning=str(e))



@router.post("/flowchart", response_model=FlowchartResponse)
def flowchart(request: FlowchartRequest) -> FlowchartResponse:
    if not settings.gemini_api_key:
        return FlowchartResponse(steps=[], warning="Missing Gemini key")

    try:
        resp = gemini_complete(flowchart_prompt(request.problem))
        raw = clean_json(resp["candidates"][0]["content"]["parts"][0]["text"])
        steps = []

        for s in raw["steps"]:
            step = FlowStep(**s)
            enriched_options = []

            for opt in step.options:
                img = fetch_unsplash_image(opt.label)

                opt_data = opt.dict()
                opt_data["image_url"] = img
                enriched_options.append(FlowOption(**opt_data))



            steps.append(
                FlowStep(
                    id=step.id,
                    title=step.title,
                    description=step.description,
                    options=enriched_options
                )
            )

        steps = [shuffle_options(s) for s in steps]
        return FlowchartResponse(steps=steps)

    except Exception as e:
        return FlowchartResponse(steps=[], warning=str(e))


@router.post("/step-links", response_model=StepLinkResponse)
def step_links(request: StepLinkRequest) -> StepLinkResponse:
    if not settings.gemini_api_key:
        return StepLinkResponse(links=[], warning="Missing Gemini key")

    try:
        p = links_prompt(request.problem, request.step_title, request.step_description)
        resp = gemini_complete(p)
        raw = clean_json(resp["candidates"][0]["content"]["parts"][0]["text"])
        links = [StepLink(**l) for l in raw.get("links", [])]
        return StepLinkResponse(links=links)
    except Exception as e:
        return StepLinkResponse(links=[], warning=str(e))

# ===========================================================================================================
#                Extra function added for StudyHinter specifically: Unsplash image fetcher function
# ===========================================================================================================


import requests

def fetch_unsplash_image(query: str) -> str | None:
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "page": 1,
        "per_page": 1,
        "client_id": settings.unsplash_access_key,
    }

    try:
        r = requests.get(url, params=params, timeout=5).json()
        results = r.get("results", [])

        if not results:
            return None

        return results[0]["urls"]["small"]
    except Exception:
        return None



class DiagramResponse(BaseModel):
    keyword: str
    image_url: Optional[str]
    warning: Optional[str] = None

@router.get("/diagram", response_model=DiagramResponse)
def diagram(keyword: str):
    img = fetch_unsplash_image(keyword)
    if not img:
        return DiagramResponse(keyword=keyword, image_url=None, warning="No diagram found")

    return DiagramResponse(keyword=keyword, image_url=img)