"""
Common Pydantic models used across all skeleton apps.
These provide the base structure for flowcharts and API responses.
"""
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Any


class FlowOption(BaseModel):
    """A single option within a flowchart step"""
    id: str = Field(..., description="Unique identifier for this option")
    label: str = Field(..., description="Display text for the option")
    reason: str = Field(..., description="Explanation of why this option is correct/incorrect")
    correct: bool = Field(..., description="Whether this is the correct option")


class FlowStep(BaseModel):
    """A single step in a flowchart with multiple choice options"""
    id: str = Field(..., description="Unique identifier for this step")
    title: str = Field(..., description="The main question or title for this step")
    description: str = Field(..., description="Additional context or explanation")
    options: List[FlowOption] = Field(..., description="Available choices for this step")


class FlowchartRequest(BaseModel):
    """Request to generate a flowchart"""
    problem: str = Field(..., description="The problem or topic to create a flowchart for")


class FlowchartResponse(BaseModel):
    """Response containing a generated flowchart"""
    steps: List[FlowStep] = Field(..., description="The flowchart steps")
    warning: Optional[str] = Field(None, description="Any warnings about the generation process")


class StepLink(BaseModel):
    """A learning resource link for a specific step"""
    title: str = Field(..., description="Human-readable title for the resource")
    url: HttpUrl = Field(..., description="URL to the learning resource")
    summary: str = Field(..., description="Brief description of what this resource provides")


class StepLinkRequest(BaseModel):
    """Request to get learning resources for a step"""
    problem: str = Field(..., description="The original problem context")
    step_title: str = Field(..., description="The title of the step")
    step_description: str = Field(..., description="The description of the step")


class StepLinkResponse(BaseModel):
    """Response containing learning resources"""
    links: List[StepLink] = Field(..., description="Available learning resources")
    warning: Optional[str] = Field(None, description="Any warnings about the link generation")


class BaseApiResponse(BaseModel):
    """Base response model that all API responses can extend"""
    warning: Optional[str] = Field(None, description="Any warnings or notices")
    metadata: Optional[dict] = Field(None, description="Additional metadata")