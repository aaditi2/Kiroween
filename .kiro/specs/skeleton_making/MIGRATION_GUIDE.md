# 🔄 Migration Guide: Converting Existing Apps to Use Skeleton

This guide shows how to refactor your existing LogicHinter and StudyHinter apps to use the new skeleton framework.

## 🎯 Benefits of Migration

- **Reduce code duplication**: 60-70% of backend code becomes shared
- **Easier maintenance**: Bug fixes and improvements benefit all apps
- **Faster development**: New apps can be built in hours, not days
- **Consistent patterns**: All apps follow the same architecture
- **Better testing**: Skeleton can be unit tested independently

## 🧠 LogicHinter Migration

### Step 1: Update Backend Structure

#### Before (Current)
```
app1-LogicHinter/backend/app/
├── core/
│   ├── config.py          # Custom implementation
│   └── gemini_client.py   # Custom implementation
├── routers/
│   └── guidance.py        # 400+ lines of custom logic
└── main.py                # Custom FastAPI setup
```

#### After (Using Skeleton)
```
app1-LogicHinter/backend/app/
├── core/
│   └── config.py          # 10 lines - extends BaseAppSettings
├── routers/
│   └── guidance.py        # 50 lines - implements 3 methods
└── main.py                # 5 lines - uses skeleton factory
```

### Step 2: Refactor Configuration

**Replace** `app1-LogicHinter/backend/app/core/config.py`:
```python
# OLD: Custom implementation (20+ lines)
import os
from pydantic_settings import BaseSettings
# ... lots of boilerplate

# NEW: Extend skeleton (10 lines)
from skeleton.core.config import BaseAppSettings
from pydantic import Field

class LogicHinterSettings(BaseAppSettings):
    app_name: str = "LogicHinter"
    kiro_no_code_rule: str = Field(
        default="You are a mentor who never returns final code..."
    )

settings = LogicHinterSettings()
```

### Step 3: Refactor Router

**Replace** `app1-LogicHinter/backend/app/routers/guidance.py`:
```python
# OLD: 400+ lines of custom implementation

# NEW: 50 lines extending skeleton
from skeleton.routers.base_guidance import BaseGuidanceRouter
from skeleton.core.models import FlowchartRequest, FlowStep
from skeleton.core.utils import clean_json_response, sanitize_text

class LogicHinterRouter(BaseGuidanceRouter):
    def generate_flowchart_prompt(self, request: FlowchartRequest) -> str:
        approach = getattr(request, 'approach', 'both')
        return f'''
        You are LogicHinter — teach algorithms without showing code.
        
        Problem: {request.problem}
        Approach: {approach}
        
        Build a flowchart with 5-8 steps...
        [Your existing prompt logic here]
        '''
    
    def parse_flowchart_response(self, ai_response: str) -> List[FlowStep]:
        data = clean_json_response(ai_response)
        steps = []
        
        for step_data in data["steps"]:
            # Apply your existing sanitization logic
            sanitized_options = []
            for opt in step_data["options"]:
                sanitized_options.append({
                    **opt,
                    "label": sanitize_text(opt["label"]),
                    "reason": sanitize_text(opt["reason"])
                })
            
            steps.append(FlowStep(**{**step_data, "options": sanitized_options}))
        
        return steps
    
    def generate_links_prompt(self, request) -> str:
        return f'''
        You are LogicHinter — provide learning resources, not code.
        [Your existing links prompt logic here]
        '''

router = LogicHinterRouter().router
```

### Step 4: Simplify Main App

**Replace** `app1-LogicHinter/backend/app/main.py`:
```python
# OLD: Custom FastAPI setup (20+ lines)

# NEW: Use skeleton factory (5 lines)
from skeleton.main import create_app
from .routers.guidance import router
from .core.config import settings

app = create_app(title=settings.app_name)
app.include_router(router)
```

### Step 5: Update Frontend

**Replace** `app1-LogicHinter/frontend/src/lib/flowchart.ts`:
```typescript
// OLD: Custom API client (100+ lines)

// NEW: Extend skeleton (20 lines)
import { BaseApiService } from 'skeleton/services/BaseApiService.js';
import type { FlowchartResponse, StepLinkResponse } from 'skeleton/lib/types';

class LogicHinterApiService extends BaseApiService {
  async generateFlowchart(
    problem: string, 
    approach: 'naive' | 'optimized'
  ): Promise<FlowchartResponse> {
    return super.generateFlowchart(problem, { approach });
  }
  
  async getStepLinks(
    problem: string,
    stepTitle: string, 
    stepDescription: string
  ): Promise<StepLinkResponse> {
    return super.getStepLinks(problem, stepTitle, stepDescription);
  }
}

export default new LogicHinterApiService();
```

## 📚 StudyHinter Migration

### Step 1: Update Configuration

**Replace** `app2-StudyHinter/backend/app/core/config.py`:
```python
# NEW: Extend skeleton with app-specific fields
from skeleton.core.config import BaseAppSettings
from pydantic import Field

class StudyHinterSettings(BaseAppSettings):
    app_name: str = "StudyHinter"
    unsplash_access_key: str = Field(default=None, env="UNSPLASH_ACCESS_KEY")

settings = StudyHinterSettings()
```

### Step 2: Refactor Router with Image Integration

**Replace** `app2-StudyHinter/backend/app/routers/guidance.py`:
```python
from skeleton.routers.base_guidance import BaseGuidanceRouter
from skeleton.core.models import FlowchartRequest, FlowStep
from skeleton.core.utils import clean_json_response
import requests

class StudyHinterRouter(BaseGuidanceRouter):
    def generate_flowchart_prompt(self, request: FlowchartRequest) -> str:
        difficulty = getattr(request, 'difficulty', 'below_grade_6')
        
        # Your existing prompt logic
        if difficulty == "below_grade_6":
            age_range = "6-11 years old"
        else:
            age_range = "12-16 years old"
            
        return f'''
        You are StudyHinter for {age_range}.
        [Your existing prompt logic here]
        '''
    
    def parse_flowchart_response(self, ai_response: str) -> List[FlowStep]:
        data = clean_json_response(ai_response)
        steps = []
        
        for step_data in data["steps"]:
            # Add your existing image enrichment logic
            enriched_options = []
            for opt in step_data["options"]:
                image_url = self._fetch_image_for_option(opt["label"])
                enriched_options.append({**opt, "image_url": image_url})
            
            steps.append(FlowStep(**{**step_data, "options": enriched_options}))
        
        return steps
    
    def _fetch_image_for_option(self, label: str) -> str:
        # Move your existing Unsplash logic here
        from .core.config import settings
        
        if not settings.unsplash_access_key:
            return None
            
        # Your existing image fetching logic
        search_term = self._extract_visual_concepts(label)
        # ... rest of Unsplash API call
    
    def generate_links_prompt(self, request) -> str:
        return f'''[Your existing links prompt logic]'''

router = StudyHinterRouter().router
```

### Step 3: Add Custom Endpoints

```python
class StudyHinterRouter(BaseGuidanceRouter):
    def _setup_routes(self):
        super()._setup_routes()  # Include base flowchart + links routes
        
        # Add your custom endpoints
        self.router.get("/example-questions")(self.example_questions)
        self.router.get("/diagram")(self.diagram)
    
    async def example_questions(self):
        # Your existing example questions logic
        pass
    
    async def diagram(self, keyword: str):
        # Your existing diagram logic
        pass
```

## 🔧 Migration Steps

### Phase 1: Preparation (30 minutes)
1. **Install skeleton as dependency**:
   ```bash
   # In each app's backend directory
   pip install -e ../../../Skeleton/backend
   ```

2. **Update requirements.txt**:
   ```txt
   # Add to existing requirements
   -e ../../../Skeleton/backend
   ```

### Phase 2: Backend Migration (2 hours)
1. **Backup existing files**:
   ```bash
   cp -r app1-LogicHinter/backend/app app1-LogicHinter/backend/app.backup
   ```

2. **Replace config.py** with skeleton extension
3. **Replace main.py** with skeleton factory
4. **Refactor guidance.py** to extend BaseGuidanceRouter
5. **Test endpoints** work the same

### Phase 3: Frontend Migration (1 hour)
1. **Install skeleton frontend**:
   ```bash
   npm install ../../../Skeleton/frontend
   ```

2. **Replace API clients** with skeleton extensions
3. **Update imports** to use skeleton types
4. **Test frontend** connects properly

### Phase 4: Cleanup (30 minutes)
1. **Remove duplicate code**
2. **Update documentation**
3. **Run full test suite**

## ✅ Validation Checklist

After migration, verify:

- [ ] **Backend starts successfully**: `uvicorn app.main:app --reload`
- [ ] **Frontend builds**: `npm run build`
- [ ] **API endpoints work**: Test `/api/flowchart` and `/api/step-links`
- [ ] **Custom features preserved**: App-specific functionality still works
- [ ] **Environment variables**: All required vars still recognized
- [ ] **Deployment works**: Apps deploy successfully to Railway/Netlify

## 🎯 Expected Results

### Code Reduction
- **LogicHinter backend**: 400+ lines → 80 lines (80% reduction)
- **StudyHinter backend**: 500+ lines → 120 lines (76% reduction)
- **Frontend API clients**: 100+ lines → 30 lines (70% reduction)

### Maintenance Benefits
- **Bug fixes**: Apply to skeleton, benefit all apps
- **New features**: Add to skeleton base classes
- **Consistency**: All apps follow same patterns
- **Testing**: Test skeleton once, trust in all apps

### Development Speed
- **New apps**: Build in 2-3 hours instead of 2-3 days
- **Feature additions**: Focus on business logic, not boilerplate
- **Deployment**: Consistent configs across all apps

The migration transforms your codebase from "two similar apps" to "two apps built on a shared foundation" - exactly what the Skeleton Crew challenge is looking for!