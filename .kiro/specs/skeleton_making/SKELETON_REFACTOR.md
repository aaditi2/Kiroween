# 🏗️ Skeleton Refactor Proposal

## Current Problem
The existing skeleton is mostly empty directories. The real reusable code is scattered across both apps with slight variations.

## Proposed True Skeleton

### Backend Structure
```
Skeleton/backend/
├── app/
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Base config with extension points
│   │   ├── gemini_client.py       # Shared AI client
│   │   └── base_models.py         # Common Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   └── guidance_template.py   # Template with customization hooks
│   ├── __init__.py
│   └── main.py                    # Standard FastAPI app
├── requirements.txt               # Core dependencies
├── nixpacks.toml                 # Deployment config
└── .env.example                  # Environment template
```

### Frontend Structure
```
Skeleton/frontend/
├── src/
│   ├── services/
│   │   └── api.js                # Base API client class
│   ├── lib/
│   │   ├── types.ts              # Common interfaces
│   │   └── utils.js              # Shared utilities
│   └── hooks/
│       └── useApi.js             # Common API hooks
├── package.json                  # Base dependencies
├── vite.config.js               # Build configuration
├── tailwind.config.js           # Base styling
├── netlify.toml                 # Deployment config
└── .env.example                 # Environment template
```

## Key Files That Should Be Skeleton

### 1. `backend/app/core/config.py`
```python
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional

class BaseAppSettings(BaseSettings):
    """Base settings that all apps should inherit from"""
    app_name: str = "SkeletonApp"
    gemini_api_key: Optional[str] = Field(default=None, env="GEMINI_API_KEY")
    
    class Config:
        env_file = ".env"
        extra = "ignore"

# Apps extend this:
# class LogicHinterSettings(BaseAppSettings):
#     app_name: str = "LogicHinter"
#     kiro_no_code_rule: str = "..."
```

### 2. `backend/app/core/gemini_client.py`
```python
# Identical across apps - perfect skeleton candidate
import requests
from typing import Any
from .config import settings

def complete(prompt: str) -> Any:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY not found")
    # ... rest of implementation
```

### 3. `backend/app/routers/guidance_template.py`
```python
from fastapi import APIRouter
from abc import ABC, abstractmethod

class BaseGuidanceRouter(ABC):
    """Template for guidance routers - apps implement the abstract methods"""
    
    def __init__(self):
        self.router = APIRouter(prefix="/api", tags=["guidance"])
        self._setup_routes()
    
    def _setup_routes(self):
        self.router.post("/flowchart")(self.flowchart_endpoint)
        # Add other common routes
    
    @abstractmethod
    def flowchart_prompt(self, problem: str, **kwargs) -> str:
        """Each app defines its own prompt strategy"""
        pass
    
    @abstractmethod
    def parse_response(self, ai_response: str) -> dict:
        """Each app defines its own parsing logic"""
        pass
    
    async def flowchart_endpoint(self, request):
        prompt = self.flowchart_prompt(request.problem)
        # Common AI calling logic
        # App-specific parsing
```

### 4. `frontend/src/services/api.js`
```javascript
class BaseApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  // Common methods like _fetchWithTimeout, error handling
  async _fetchWithTimeout(url, options = {}) { /* ... */ }
  
  // Template method - apps override
  async generateFlowchart(problem, options = {}) {
    // Common validation and error handling
    // App-specific endpoint calling
  }
}

export default BaseApiService;
```

## What Apps Would Look Like

### LogicHinter Implementation
```python
# app1-LogicHinter/backend/app/core/config.py
from skeleton.core.config import BaseAppSettings

class Settings(BaseAppSettings):
    app_name: str = "LogicHinter"
    kiro_no_code_rule: str = "Never show code..."

# app1-LogicHinter/backend/app/routers/guidance.py  
from skeleton.routers.guidance_template import BaseGuidanceRouter

class LogicHinterRouter(BaseGuidanceRouter):
    def flowchart_prompt(self, problem: str, approach: str) -> str:
        return f"You are LogicHinter... {problem}... {approach}"
    
    def parse_response(self, ai_response: str) -> dict:
        # LogicHinter-specific parsing with no-code enforcement
        return sanitize_flow_steps(parse_flowchart_text(ai_response))

router = LogicHinterRouter().router
```

### StudyHinter Implementation
```python
# app2-StudyHinter/backend/app/core/config.py
from skeleton.core.config import BaseAppSettings

class Settings(BaseAppSettings):
    app_name: str = "StudyHinter"
    unsplash_access_key: str = Field(default=None, env="UNSPLASH_ACCESS_KEY")

# app2-StudyHinter/backend/app/routers/guidance.py
from skeleton.routers.guidance_template import BaseGuidanceRouter

class StudyHinterRouter(BaseGuidanceRouter):
    def flowchart_prompt(self, problem: str, difficulty: str) -> str:
        age_range = "6-11" if difficulty == "below_grade_6" else "12-16"
        return f"You are StudyHinter for {age_range}... {problem}"
    
    def parse_response(self, ai_response: str) -> dict:
        # StudyHinter-specific parsing with image enrichment
        steps = parse_flowchart_text(ai_response)
        return enrich_with_images(steps)

router = StudyHinterRouter().router
```

## Benefits of This Approach

1. **True Reusability**: 70% of backend code becomes shared
2. **Clear Customization Points**: Apps only implement what's different
3. **Consistent Patterns**: All apps follow same structure
4. **Easy Testing**: Skeleton can be unit tested independently
5. **Faster Development**: New apps start with working foundation

## Migration Strategy

1. Extract common code into skeleton
2. Make apps inherit from skeleton base classes
3. Move app-specific logic to override methods
4. Update documentation with clear customization points
5. Create example "HelloWorldHinter" app using skeleton

This would make the skeleton truly reusable and demonstrate the "one foundation, many apps" concept much more convincingly.