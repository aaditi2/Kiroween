# 🏗️ Skeleton Framework

A reusable foundation for building AI-powered learning applications with FastAPI + React.

## 🎯 What This Skeleton Provides

### Backend (Python + FastAPI)
- **Base configuration system** with environment variable management
- **Gemini AI client** with error handling and response parsing
- **Abstract router template** for implementing custom AI guidance logic
- **Common utilities** for JSON parsing, validation, and data processing
- **Deployment configuration** for Railway/Render

### Frontend (React + Vite)
- **Base API service** with timeout handling and error management
- **Common TypeScript interfaces** matching backend models
- **React hooks** for API interactions and state management
- **TailwindCSS configuration** with extensible theme
- **Deployment configuration** for Netlify/Vercel

## 🚀 Quick Start

### 1. Create a New App from Skeleton

```bash
# Copy the skeleton
cp -r Skeleton my-new-app
cd my-new-app

# Backend setup
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
# Edit .env and set VITE_API_URL if needed
```

### 2. Implement Your App Logic

#### Backend: Create Your Guidance Router

```python
# backend/app/routers/guidance.py
from app.routers.base_guidance import BaseGuidanceRouter
from app.core.models import FlowchartRequest, FlowStep
from app.core.utils import clean_json_response
from typing import List

class MyAppRouter(BaseGuidanceRouter):
    def generate_flowchart_prompt(self, request: FlowchartRequest) -> str:
        return f'''
        You are MyApp - an AI that helps with {request.problem}.
        
        Create a flowchart with 4-6 steps...
        Return JSON: {{"steps": [...]}}
        '''
    
    def parse_flowchart_response(self, ai_response: str) -> List[FlowStep]:
        data = clean_json_response(ai_response)
        return [FlowStep(**step) for step in data["steps"]]
    
    def generate_links_prompt(self, request) -> str:
        return f'''
        Find learning resources for: {request.step_title}
        Return JSON: {{"links": [...]}}
        '''

# Create router instance
router = MyAppRouter().router
```

#### Backend: Update Main App

```python
# backend/app/main.py
from app.main import create_app
from app.routers.guidance import router
from app.core.config import BaseAppSettings

class MyAppSettings(BaseAppSettings):
    app_name: str = "MyApp"

settings = MyAppSettings()
app = create_app(title="MyApp API")
app.include_router(router)
```

#### Frontend: Create Your API Service

```javascript
// frontend/src/services/api.js
import { BaseApiService } from './BaseApiService.js';

class MyAppApiService extends BaseApiService {
  async generateFlowchart(problem, difficulty = 'normal') {
    return super.generateFlowchart(problem, { difficulty });
  }
  
  // Add app-specific methods here
}

export default new MyAppApiService();
```

### 3. Run Your App

```bash
# Backend (from backend/ directory)
uvicorn app.main:app --reload

# Frontend (from frontend/ directory)  
npm run dev
```

## 🏛️ Architecture

### Backend Structure
```
backend/
├── app/
│   ├── core/
│   │   ├── config.py          # Settings management
│   │   ├── gemini_client.py   # AI service client
│   │   ├── models.py          # Pydantic models
│   │   └── utils.py           # Common utilities
│   ├── routers/
│   │   └── base_guidance.py   # Abstract router template
│   └── main.py                # FastAPI app factory
├── requirements.txt
├── nixpacks.toml             # Deployment config
└── .env.example
```

### Frontend Structure
```
frontend/
├── src/
│   ├── services/
│   │   └── BaseApiService.js  # API client base class
│   ├── hooks/
│   │   └── useApi.js          # React hooks for API
│   └── lib/
│       └── types.ts           # TypeScript interfaces
├── package.json
├── vite.config.js
├── tailwind.config.js
└── netlify.toml              # Deployment config
```

## 🎨 Customization Points

### Backend Customization

1. **Extend Base Settings**
```python
class MyAppSettings(BaseAppSettings):
    app_name: str = "MyApp"
    my_custom_key: str = Field(env="MY_CUSTOM_KEY")
```

2. **Implement Router Methods**
```python
class MyRouter(BaseGuidanceRouter):
    def generate_flowchart_prompt(self, request):
        # Your custom prompt logic
        
    def parse_flowchart_response(self, ai_response):
        # Your custom parsing logic
        
    def post_process_flowchart(self, steps):
        # Your custom post-processing
```

3. **Add Custom Endpoints**
```python
# Add to your router class
def _setup_routes(self):
    super()._setup_routes()  # Include base routes
    self.router.get("/my-endpoint")(self.my_custom_endpoint)
```

### Frontend Customization

1. **Extend API Service**
```javascript
class MyApiService extends BaseApiService {
  async myCustomMethod(data) {
    // Your custom API calls
  }
}
```

2. **Create Custom Hooks**
```javascript
export function useMyFeature(apiService) {
  const { execute } = useAsyncCall();
  // Your custom hook logic
}
```

3. **Extend Theme**
```javascript
// tailwind.config.js
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { /* your colors */ },
        secondary: { /* your colors */ },
      }
    }
  }
}
```

## 🚀 Deployment

### Backend (Railway/Render)
1. Connect your repository
2. Set environment variables: `GEMINI_API_KEY`
3. Deploy automatically uses `nixpacks.toml`

### Frontend (Netlify/Vercel)
1. Connect your repository  
2. Set build directory: `frontend`
3. Set environment variables: `VITE_API_URL`
4. Deploy automatically uses `netlify.toml`

## 📚 Usage Examples

The skeleton can power diverse AI-powered learning applications. Here are some examples:

### 🎮 QuestCraft (Interactive Adventure Game)
A choose-your-own-adventure game where players make decisions that affect the story outcome. Perfect for teaching decision-making, consequences, and narrative skills.

**Key Features:**
- Immersive narrative with consequences
- Character development and plot progression  
- Adventure points and progress tracking
- Multiple themes (fantasy, sci-fi, mystery)

**Backend Implementation:**
```python
class QuestCraftRouter(BaseGuidanceRouter):
    def generate_flowchart_prompt(self, request: FlowchartRequest) -> str:
        theme = getattr(request, 'theme', 'fantasy')
        player_level = getattr(request, 'player_level', 'beginner')
        
        return f'''
        You are QuestCraft — an AI that creates interactive adventure stories.

        Create an engaging adventure for: {request.problem}
        Theme: {theme}
        Player Level: {player_level}
        
        Rules:
        - 5 to 7 story decision points that build an engaging narrative
        - Each step has 3-4 meaningful choices that affect the story
        - Choices should have clear consequences (positive/negative/neutral)
        - Make it immersive with vivid descriptions
        - Include character development and plot progression
        '''

    def parse_flowchart_response(self, ai_response: str) -> List[FlowStep]:
        data = clean_json_response(ai_response)
        steps = []
        
        for step_data in data["steps"]:
            # Add adventure-specific enhancements
            enhanced_options = []
            for opt in step_data["options"]:
                consequence_type = "positive" if opt["correct"] else "challenging"
                enhanced_options.append({
                    **opt,
                    "consequence_type": consequence_type,
                    "adventure_points": 10 if opt["correct"] else 5
                })
            
            steps.append(FlowStep(**{**step_data, "options": enhanced_options}))
        
        return steps
```

### 🏥 DiagnosisTrainer (Medical Learning Platform)
An AI-powered platform for medical students and residents to practice diagnostic reasoning through realistic patient cases.

**Key Features:**
- Clinical reasoning flowcharts
- Evidence-based medical resources
- Performance analytics and case library
- Specialty-specific cases (cardiology, emergency, etc.)

**Backend Implementation:**
```python
class DiagnosisTrainerRouter(BaseGuidanceRouter):
    def generate_flowchart_prompt(self, request: FlowchartRequest) -> str:
        specialty = getattr(request, 'specialty', 'general_medicine')
        difficulty = getattr(request, 'difficulty', 'resident_level')
        
        return f'''
        You are DiagnosisTrainer — an AI that creates realistic medical case studies.

        Create a diagnostic case study for: {request.problem}
        Medical Specialty: {specialty}
        Difficulty Level: {difficulty}
        
        Rules:
        - 5 to 8 diagnostic decision points following clinical reasoning
        - Each step represents a stage in patient evaluation
        - Options should reflect real clinical choices doctors face
        - Include differential diagnoses and clinical reasoning
        - Focus on teaching diagnostic thinking, not memorization
        '''

    def _setup_routes(self):
        super()._setup_routes()
        # Add medical-specific endpoints
        self.router.get("/case-library")(self.get_case_library)
        self.router.post("/submit-diagnosis")(self.submit_diagnosis)
        self.router.get("/performance-analytics")(self.get_performance_analytics)
```

### 🌍 Other Possible Applications
- **LanguageMaster**: Interactive language learning through conversation scenarios
- **SkillCraft**: Professional development through workplace challenges
- **MathMentor**: Step-by-step math problem solving
- **DebateCoach**: Argument structure and persuasive writing
- **CodeReviewer**: Code quality and best practices (without showing solutions)
- **BusinessSim**: Entrepreneurship and business decision making

### 🎨 Customization Patterns

**Adding Custom Endpoints:**
```python
class MyRouter(BaseGuidanceRouter):
    def _setup_routes(self):
        super()._setup_routes()  # Include base routes
        self.router.get("/custom-endpoint")(self.custom_endpoint)
    
    async def custom_endpoint(self):
        return {"message": "Custom functionality"}
```

**Custom Error Handling:**
```python
class MyRouter(BaseGuidanceRouter):
    def handle_ai_error(self, error: Exception, context: str) -> str:
        if "rate limit" in str(error).lower():
            return "Too many requests. Please wait a moment and try again."
        return super().handle_ai_error(error, context)
```

**Custom Post-Processing:**
```python
class MyRouter(BaseGuidanceRouter):
    def post_process_flowchart(self, steps: List[FlowStep]) -> List[FlowStep]:
        steps = super().post_process_flowchart(steps)  # Base validation
        
        # Add your custom logic
        for step in steps:
            step.title = step.title.upper()  # Example customization
            
        return steps
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new functionality
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.