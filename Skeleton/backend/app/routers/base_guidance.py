"""
Base guidance router template for skeleton apps.
Apps should inherit from BaseGuidanceRouter and implement the abstract methods.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException

from ..core.models import (
    FlowchartRequest, FlowchartResponse, FlowStep,
    StepLinkRequest, StepLinkResponse
)
from ..core.gemini_client import complete, extract_text_response, GeminiError
from ..core.utils import clean_json_response, shuffle_flow_options, validate_flowchart_structure


class BaseGuidanceRouter(ABC):
    """
    Base class for guidance routers. Apps inherit from this and implement
    the abstract methods to customize behavior.
    """
    
    def __init__(self, prefix: str = "/api", tags: List[str] = None):
        """
        Initialize the router with common setup.
        
        Args:
            prefix: URL prefix for all routes
            tags: OpenAPI tags for documentation
        """
        if tags is None:
            tags = ["guidance"]
            
        self.router = APIRouter(prefix=prefix, tags=tags)
        self._setup_routes()
    
    def _setup_routes(self):
        """Set up the common routes that all apps will have"""
        self.router.post("/flowchart", response_model=FlowchartResponse)(self._flowchart_endpoint)
        self.router.post("/step-links", response_model=StepLinkResponse)(self._step_links_endpoint)
    
    # Abstract methods that apps must implement
    
    @abstractmethod
    def generate_flowchart_prompt(self, request: FlowchartRequest) -> str:
        """
        Generate the AI prompt for creating a flowchart.
        Each app implements its own prompt strategy.
        
        Args:
            request: The flowchart request
            
        Returns:
            The prompt string to send to AI
        """
        pass
    
    @abstractmethod
    def parse_flowchart_response(self, ai_response: str) -> List[FlowStep]:
        """
        Parse the AI response into FlowStep objects.
        Each app can customize parsing logic.
        
        Args:
            ai_response: Raw text response from AI
            
        Returns:
            List of parsed FlowStep objects
        """
        pass
    
    @abstractmethod
    def generate_links_prompt(self, request: StepLinkRequest) -> str:
        """
        Generate the AI prompt for finding learning resources.
        Each app implements its own link strategy.
        
        Args:
            request: The step link request
            
        Returns:
            The prompt string to send to AI
        """
        pass
    
    # Optional methods that apps can override
    
    def post_process_flowchart(self, steps: List[FlowStep]) -> List[FlowStep]:
        """
        Post-process flowchart steps after parsing.
        Default implementation shuffles options and validates structure.
        
        Args:
            steps: Parsed flowchart steps
            
        Returns:
            Processed flowchart steps
        """
        # Validate structure
        validate_flowchart_structure(steps)
        
        # Shuffle options to randomize correct answer position
        return [shuffle_flow_options(step) for step in steps]
    
    def handle_ai_error(self, error: Exception, context: str) -> str:
        """
        Handle AI-related errors and return user-friendly messages.
        Apps can override to customize error handling.
        
        Args:
            error: The exception that occurred
            context: Context about what was being done
            
        Returns:
            User-friendly error message
        """
        if isinstance(error, GeminiError):
            return f"AI service error: {str(error)}"
        else:
            return f"Unexpected error during {context}: {str(error)}"
    
    # Internal endpoint implementations
    
    async def _flowchart_endpoint(self, request: FlowchartRequest) -> FlowchartResponse:
        """Internal implementation of the flowchart endpoint"""
        warning = None
        
        try:
            # Generate prompt using app-specific logic
            prompt = self.generate_flowchart_prompt(request)
            
            # Call AI service
            response = complete(prompt)
            ai_text = extract_text_response(response)
            
            # Parse response using app-specific logic
            steps = self.parse_flowchart_response(ai_text)
            
            # Post-process (validation, shuffling, etc.)
            steps = self.post_process_flowchart(steps)
            
        except Exception as e:
            warning = self.handle_ai_error(e, "flowchart generation")
            steps = []
        
        return FlowchartResponse(steps=steps, warning=warning)
    
    async def _step_links_endpoint(self, request: StepLinkRequest) -> StepLinkResponse:
        """Internal implementation of the step links endpoint"""
        warning = None
        links = []
        
        try:
            # Generate prompt using app-specific logic
            prompt = self.generate_links_prompt(request)
            
            # Call AI service
            response = complete(prompt)
            ai_text = extract_text_response(response)
            
            # Parse links (common logic)
            data = clean_json_response(ai_text)
            links_data = data.get("links", [])
            
            # Convert to StepLink objects
            from ..core.models import StepLink
            links = [StepLink(**link_data) for link_data in links_data]
            
        except Exception as e:
            warning = self.handle_ai_error(e, "link generation")
        
        return StepLinkResponse(links=links, warning=warning)