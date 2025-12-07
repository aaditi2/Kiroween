"""
Common utility functions used across skeleton apps.
Includes JSON parsing, validation, and other shared helpers.
"""
import json
import re
import random
from typing import Dict, Any, List
from .models import FlowStep, FlowOption


def clean_json_response(text: str) -> Dict[str, Any]:
    """
    Clean and parse JSON from AI responses that may contain markdown formatting.
    
    Args:
        text: Raw text response that should contain JSON
        
    Returns:
        Parsed JSON as dictionary
        
    Raises:
        json.JSONDecodeError: If no valid JSON found
    """
    # Remove markdown code blocks
    cleaned = text.replace("```json", "").replace("```", "").strip()
    
    # Try to extract JSON object using regex
    match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
    if match:
        cleaned = match.group(0)
    
    # Remove trailing commas (common AI mistake)
    cleaned = re.sub(r",(\s*[}\]])", r"\1", cleaned)
    
    return json.loads(cleaned)


def shuffle_flow_options(step: FlowStep) -> FlowStep:
    """
    Shuffle the options in a flow step to randomize correct answer position.
    
    Args:
        step: The flow step to shuffle
        
    Returns:
        New FlowStep with shuffled options
    """
    options = step.options.copy()
    random.shuffle(options)
    
    return FlowStep(
        id=step.id,
        title=step.title,
        description=step.description,
        options=options
    )


def validate_flowchart_structure(steps: List[FlowStep]) -> bool:
    """
    Validate that a flowchart has proper structure.
    
    Args:
        steps: List of flow steps to validate
        
    Returns:
        True if valid
        
    Raises:
        ValueError: If structure is invalid
    """
    if not steps:
        raise ValueError("Flowchart must have at least one step")
    
    for i, step in enumerate(steps):
        if not step.options:
            raise ValueError(f"Step {i} must have at least one option")
        
        correct_count = sum(1 for opt in step.options if opt.correct)
        if correct_count != 1:
            raise ValueError(f"Step {i} must have exactly one correct option, found {correct_count}")
    
    return True


def sanitize_text(text: str, forbidden_patterns: List[str] = None) -> str:
    """
    Remove forbidden patterns from text (e.g., code snippets).
    
    Args:
        text: Text to sanitize
        forbidden_patterns: List of patterns to remove (default: common code patterns)
        
    Returns:
        Sanitized text
    """
    if forbidden_patterns is None:
        forbidden_patterns = ["```", "def ", "class ", "function ", "public static", "#include"]
    
    sanitized = text
    for pattern in forbidden_patterns:
        sanitized = sanitized.replace(pattern, "[removed]")
    
    return sanitized