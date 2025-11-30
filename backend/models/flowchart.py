"""
Data models for flowchart structure.

This module defines the data models for representing flowcharts with steps and choices.
Uses Pydantic for data validation and serialization.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class Choice(BaseModel):
    """
    Represents a choice option at a flowchart step.
    
    Attributes:
        id: Unique identifier for the choice
        text: The choice text displayed to the user
        correct: Whether this is the correct choice
        explanation: Explanation for why this choice is wrong (None if correct)
    """
    id: str = Field(..., min_length=1, description="Unique choice identifier")
    text: str = Field(..., min_length=1, description="Choice text")
    correct: bool = Field(..., description="Whether this is the correct choice")
    explanation: Optional[str] = Field(None, description="Explanation for incorrect choices")
    
    @field_validator('explanation')
    @classmethod
    def validate_explanation(cls, v: Optional[str], info) -> Optional[str]:
        """
        Validate that incorrect choices have explanations and correct choices don't.
        
        Args:
            v: The explanation value
            info: Validation context containing other field values
            
        Returns:
            The validated explanation value
            
        Raises:
            ValueError: If validation fails
        """
        correct = info.data.get('correct')
        
        if correct and v is not None:
            raise ValueError("Correct choices should not have explanations")
        
        if not correct and (v is None or len(v.strip()) == 0):
            raise ValueError("Incorrect choices must have explanations")
        
        return v


class Step(BaseModel):
    """
    Represents a single step in the flowchart.
    
    Attributes:
        id: Unique identifier for the step
        description: Description or question for this step
        choices: List of exactly 3 choice options
    """
    id: str = Field(..., min_length=1, description="Unique step identifier")
    description: str = Field(..., min_length=1, description="Step description")
    choices: List[Choice] = Field(..., min_length=3, max_length=3, description="List of 3 choices")
    
    @field_validator('choices')
    @classmethod
    def validate_choices(cls, v: List[Choice]) -> List[Choice]:
        """
        Validate that there are exactly 3 choices with exactly 1 correct choice.
        
        Args:
            v: List of choices
            
        Returns:
            The validated list of choices
            
        Raises:
            ValueError: If validation fails
        """
        if len(v) != 3:
            raise ValueError("Each step must have exactly 3 choices")
        
        correct_count = sum(1 for choice in v if choice.correct)
        
        if correct_count != 1:
            raise ValueError(f"Each step must have exactly 1 correct choice, found {correct_count}")
        
        # Validate unique choice IDs
        choice_ids = [choice.id for choice in v]
        if len(choice_ids) != len(set(choice_ids)):
            raise ValueError("Choice IDs must be unique within a step")
        
        return v


class Flowchart(BaseModel):
    """
    Represents a complete flowchart with multiple steps.
    
    Attributes:
        steps: List of steps in the flowchart
    """
    steps: List[Step] = Field(..., min_length=1, description="List of flowchart steps")
    
    @field_validator('steps')
    @classmethod
    def validate_steps(cls, v: List[Step]) -> List[Step]:
        """
        Validate that step IDs are unique.
        
        Args:
            v: List of steps
            
        Returns:
            The validated list of steps
            
        Raises:
            ValueError: If validation fails
        """
        if len(v) == 0:
            raise ValueError("Flowchart must have at least one step")
        
        step_ids = [step.id for step in v]
        if len(step_ids) != len(set(step_ids)):
            raise ValueError("Step IDs must be unique within a flowchart")
        
        return v
    
    def get_step_by_id(self, step_id: str) -> Optional[Step]:
        """
        Get a step by its ID.
        
        Args:
            step_id: The step ID to search for
            
        Returns:
            The step if found, None otherwise
        """
        for step in self.steps:
            if step.id == step_id:
                return step
        return None
    
    def get_step_by_index(self, index: int) -> Optional[Step]:
        """
        Get a step by its index.
        
        Args:
            index: The step index (0-based)
            
        Returns:
            The step if found, None otherwise
        """
        if 0 <= index < len(self.steps):
            return self.steps[index]
        return None
