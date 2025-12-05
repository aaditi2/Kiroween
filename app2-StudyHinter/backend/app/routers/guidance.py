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


def flowchart_prompt(problem: str, difficulty: str = "below_grade_6") -> str:
    # Set age range and complexity based on difficulty
    if difficulty == "below_grade_6":
        age_range = "6-11 years old (grades 1-5)"
        complexity_level = "simple, concrete concepts with everyday examples"
        vocabulary_level = "basic vocabulary, short sentences, and familiar concepts"
    else:  # above_grade_6
        age_range = "12-16 years old (grades 6-10)"
        complexity_level = "more advanced concepts with abstract thinking"
        vocabulary_level = "intermediate vocabulary and more complex explanations"
    
    return f"""
You are StudyHinter — an AI that creates **logical, educational quiz questions** for children.

TARGET AUDIENCE: {age_range}
COMPLEXITY LEVEL: {complexity_level}
VOCABULARY: {vocabulary_level}

CRITICAL: Every option MUST be a logical answer to the question. NO random or unrelated options!

Your job:
Generate a MULTIPLE-CHOICE QUESTION QUIZ that teaches the topic step-by-step.

MANDATORY LOGIC RULES:
1. Every QUESTION must directly ask about the topic
2. Every OPTION must be a potential answer to that specific question
3. The CORRECT OPTION must be scientifically accurate
4. WRONG OPTIONS must be common misconceptions or related but incorrect concepts
5. ALL options must make logical sense as answers to the question
6. NEVER use random scenes, activities, or objects as options

GOOD EXAMPLE:
Topic: "What makes Earth habitable?"
Question: "What does Earth's atmosphere provide?"
Options:
- "Oxygen for breathing and protection from radiation" (CORRECT)
- "Only carbon dioxide for plants" (WRONG but related)
- "Just water vapor for rain" (WRONG but related)
- "Only nitrogen for soil" (WRONG but related)

BAD EXAMPLE (NEVER DO THIS):
Question: "What does Earth's atmosphere provide?"
Options:
- "Colorful balloons at fair" (NONSENSE - not an answer to the question)
- "Playing in the park" (NONSENSE - not an answer to the question)
- "Oxygen for breathing" (This is correct, but other options are nonsense)

STRICT RULES FOR LABELS:
1. The label must be a COMPLETE, NATURAL sentence that answers the question
2. Write it as children would naturally say it
3. Use proper grammar and punctuation
4. Examples:
   - For oxygen concept: "helps you breathe fresh air"
   - For protection concept: "protects Earth from harmful rays"
   - For digestion concept: "helps break down food in your stomach"
5. The label should be educational and easy to understand
6. Avoid single words or fragments - use complete phrases

FLOWCHART RULES:
- 4 to 7 steps total
- Each step must have:
    • "id": unique identifier (step-1, step-2, etc.)
    • "title": clear question about the topic
    • "description": what the question is asking
    • "options": 4 choices (A, B, C, D) - ALL must logically answer the question
- EXACTLY one option is "correct": true

JSON-ONLY FORMAT:
{{
  "steps": [
    {{
      "id": "step-1",
      "title": "Clear question about the topic",
      "description": "What are we asking?",
      "options": [
        {{ "id": "A", "label": "complete natural sentence answer", "reason": "why correct/incorrect", "correct": true }},
        {{ "id": "B", "label": "complete natural sentence answer", "reason": "why incorrect", "correct": false }},
        {{ "id": "C", "label": "complete natural sentence answer", "reason": "why incorrect", "correct": false }},
        {{ "id": "D", "label": "complete natural sentence answer", "reason": "why incorrect", "correct": false }}
      ]
    }}
  ]
}}

TOPIC: {problem}

REMEMBER: Every option must be a LOGICAL answer to the question. No random scenes or activities!
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
    difficulty: str = "below_grade_6"  # Default to below grade 6


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
        resp = gemini_complete(flowchart_prompt(request.problem, request.difficulty))
        raw = clean_json(resp["candidates"][0]["content"]["parts"][0]["text"])
        steps = []

        for s in raw["steps"]:
            step = FlowStep(**s)
            enriched_options = []

            for opt in step.options:
                # Generate better image search terms from the label
                image_search_term = generate_image_search_term(opt.label, step.title)
                img = fetch_unsplash_image(image_search_term)

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

        # Keep original A, B, C, D order - don't shuffle
        # steps = [shuffle_options(s) for s in steps]
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

def generate_image_search_term(label: str, question_title: str) -> str:
    """
    Use Gemini AI to extract the most important 2-3 visual concepts from answer labels.
    This ensures we get the most relevant and photographable concepts.
    """
    if not settings.gemini_api_key:
        # Fallback to simple word extraction if no Gemini key
        words = label.lower().split()
        important_words = [w for w in words if w not in ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'your', 'you', 'helps', 'makes', 'gives', 'it', 'is', 'as']]
        return ' '.join(important_words[:3]) if important_words else label
    
    try:
        prompt = f"""
You are an expert at extracting visual concepts for image search.

Given this quiz answer option: "{label}"
Question context: "{question_title}"

Your job: Extract the 2-3 MOST IMPORTANT words that represent visual, photographable concepts from this answer.

Rules:
1. Focus on NOUNS and concrete objects that can be photographed
2. Ignore filler words like "it", "is", "the", "a", "helps", "makes", "gives"
3. Choose words that would find relevant, educational images
4. Return ONLY the 2-3 most important words, separated by spaces
5. No explanations, just the search terms

Examples:
- "It helps digest food in your intestines" → "digestive system intestines"
- "It makes your bones stronger with calcium" → "bones calcium skeleton"
- "It starts as sugar from sugar cane plants" → "sugar cane plants"
- "It's filled with air that floats" → "air balloon floating"

Answer option: "{label}"
Extract 2-3 key visual search terms:
"""
        
        resp = gemini_complete(prompt)
        result = resp["candidates"][0]["content"]["parts"][0]["text"].strip()
        
        # Clean up the result - remove quotes, extra punctuation
        result = result.replace('"', '').replace("'", '').replace('.', '').replace(',', '').strip()
        
        # Validate result has reasonable length and content
        if len(result) > 0 and len(result) < 100 and not result.lower().startswith(('sorry', 'i cannot', 'unable')):
            return result
        else:
            raise Exception("Invalid Gemini response")
            
    except Exception as e:
        # Fallback to simple extraction if Gemini fails
        import re
        words = re.findall(r'\b[a-zA-Z]+\b', label.lower())
        important_words = [w for w in words if w not in ['it', 'is', 'as', 'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'your', 'you', 'helps', 'makes', 'gives', 'starts', 'becomes', 'turns', 'gets'] and len(w) > 2]
        return ' '.join(important_words[:3]) if important_words else label


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


# ===========================================================================================================
#                Dynamic Example Questions Feature
# ===========================================================================================================

# Color gradients for question cards
COLOR_GRADIENTS = [
    "from-red-600 to-orange-600",
    "from-green-600 to-teal-600",
    "from-blue-600 to-purple-600",
    "from-cyan-600 to-blue-600",
    "from-pink-600 to-purple-600",
    "from-yellow-600 to-orange-600",
    "from-indigo-600 to-purple-600",
    "from-teal-600 to-green-600"
]

# Fallback questions if Gemini API fails
FALLBACK_QUESTIONS = [
    {"emoji": "🌋", "text": "How do volcanoes erupt?", "color": "from-red-600 to-orange-600"},
    {"emoji": "🦕", "text": "What happened to dinosaurs?", "color": "from-green-600 to-teal-600"},
    {"emoji": "🌙", "text": "Why does the moon glow?", "color": "from-blue-600 to-purple-600"},
    {"emoji": "🌊", "text": "How do ocean waves work?", "color": "from-cyan-600 to-blue-600"},
    {"emoji": "🌈", "text": "How are rainbows formed?", "color": "from-pink-600 to-purple-600"},
    {"emoji": "⚡", "text": "What causes lightning?", "color": "from-yellow-600 to-orange-600"},
    {"emoji": "🐋", "text": "How do whales breathe underwater?", "color": "from-indigo-600 to-purple-600"},
    {"emoji": "🌍", "text": "Why does Earth have seasons?", "color": "from-teal-600 to-green-600"}
]


class ExampleQuestion(BaseModel):
    emoji: str = Field(..., description="Single emoji representing the topic")
    text: str = Field(..., description="Child-friendly question text")
    color: str = Field(..., description="Tailwind gradient class")


class ExampleQuestionsResponse(BaseModel):
    questions: list[ExampleQuestion]
    warning: Optional[str] = None


def example_questions_prompt() -> str:
    """
    Generate a prompt for Gemini AI to create 4 diverse, child-appropriate GK questions.
    """
    # Add randomization to ensure different questions each time
    random_seed = random.randint(1000, 9999)
    
    return f"""
You are StudyHinter — an AI that creates engaging General Knowledge questions for children aged 6-12.

Your job:
Generate EXACTLY 4 COMPLETELY NEW and UNIQUE General Knowledge questions that spark curiosity in children.

CRITICAL: DO NOT repeat the example questions below. Create ENTIRELY DIFFERENT questions each time!

REQUIREMENTS:
1. Cover diverse topics: science, nature, space, animals, geography, technology, history, weather, oceans, plants, human body, inventions, cultures
2. Use simple, child-friendly phrasing (ages 6-12)
3. Each question should start with "How", "Why", "What", or "Where"
4. Questions should be curiosity-sparking and educational
5. Include an appropriate emoji for each question (single emoji only)
6. Make questions RANDOM and VARIED - avoid common topics
7. Think creatively about interesting facts children would love to learn

EXAMPLE FORMAT (DO NOT USE THESE EXACT QUESTIONS):
{{
  "questions": [
    {{ "emoji": "🌟", "text": "Why do stars twinkle at night?" }},
    {{ "emoji": "🦋", "text": "How do butterflies get their colors?" }},
    {{ "emoji": "🌍", "text": "What makes Earth different from other planets?" }},
    {{ "emoji": "🔬", "text": "How do magnets work?" }}
  ]
}}

IMPORTANT:
- Return ONLY valid JSON
- EXACTLY 4 questions
- Each emoji must be a single character
- Questions must be diverse and cover different topics
- Keep text under 50 characters
- BE CREATIVE AND GENERATE NEW QUESTIONS EVERY TIME
- Random seed for this generation: {random_seed}
"""


@router.get("/example-questions", response_model=ExampleQuestionsResponse)
def example_questions() -> ExampleQuestionsResponse:
    """
    Generate 4 dynamic example questions for the welcome screen.
    Returns fallback questions if Gemini API fails or API key is missing.
    """
    # Check if API key is available
    if not settings.gemini_api_key:
        # Return random 4 from fallback questions
        selected = random.sample(FALLBACK_QUESTIONS, 4)
        return ExampleQuestionsResponse(
            questions=[ExampleQuestion(**q) for q in selected],
            warning="Using fallback questions (Gemini API key missing)"
        )
    
    try:
        # Call Gemini AI
        prompt = example_questions_prompt()
        resp = gemini_complete(prompt)
        raw_text = resp["candidates"][0]["content"]["parts"][0]["text"]
        
        # Parse JSON response
        parsed = clean_json(raw_text)
        questions_data = parsed.get("questions", [])
        
        # Validate we got exactly 4 questions
        if len(questions_data) != 4:
            raise ValueError(f"Expected 4 questions, got {len(questions_data)}")
        
        # Assign random colors from the gradient palette
        available_colors = COLOR_GRADIENTS.copy()
        random.shuffle(available_colors)
        
        questions = []
        for i, q in enumerate(questions_data):
            question = ExampleQuestion(
                emoji=q["emoji"],
                text=q["text"],
                color=available_colors[i]
            )
            questions.append(question)
        
        return ExampleQuestionsResponse(questions=questions)
        
    except Exception as e:
        # Return random 4 from fallback questions on any error
        selected = random.sample(FALLBACK_QUESTIONS, 4)
        return ExampleQuestionsResponse(
            questions=[ExampleQuestion(**q) for q in selected],
            warning=f"Using fallback questions (Error: {str(e)})"
        )