"""
Gemini AI client for generating interactive problem-solving flowcharts.
Handles prompt construction, API communication, response parsing, and validation.
"""
import json
import time
from typing import Dict, Optional, List
import google.generativeai as genai


class GeminiClient:
    """Client for interacting with Google's Gemini AI API to generate flowcharts."""
    
    def __init__(self, api_key: str):
        """
        Initialize the Gemini AI client with API key.
        
        Args:
            api_key: Google Gemini API key for authentication.
            
        Raises:
            ValueError: If api_key is empty or invalid.
        """
        if not api_key or not isinstance(api_key, str):
            raise ValueError("Valid API key is required")
        
        self.api_key = api_key
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.max_retries = 3
        self.timeout = 30
    
    def _build_prompt(self, problem: str) -> str:
        """
        Construct a detailed prompt for flowchart generation with specific JSON format instructions.
        
        Args:
            problem: The coding problem text to generate a flowchart for.
            
        Returns:
            str: Formatted prompt for Gemini AI.
        """
        prompt = f"""You are an expert programming tutor helping students learn problem-solving approaches for coding challenges.

Given the following coding problem, create an interactive step-by-step flowchart that guides the student through the solution approach.

PROBLEM:
{problem}

INSTRUCTIONS:
1. Break down the solution approach into 3-5 logical steps
2. For each step, provide exactly 3 choice options:
   - One CORRECT choice that represents the best approach
   - Two INCORRECT choices that are common mistakes or suboptimal approaches
3. For each incorrect choice, provide a clear explanation of why it's wrong
4. Focus on teaching problem-solving methodology, not just the final solution

OUTPUT FORMAT:
Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):

{{
  "steps": [
    {{
      "id": "step-1",
      "description": "Clear description of what needs to be decided at this step",
      "choices": [
        {{
          "id": "choice-1",
          "text": "Description of this approach",
          "correct": false,
          "explanation": "Why this approach is incorrect or suboptimal"
        }},
        {{
          "id": "choice-2",
          "text": "Description of the correct approach",
          "correct": true,
          "explanation": null
        }},
        {{
          "id": "choice-3",
          "text": "Description of another incorrect approach",
          "correct": false,
          "explanation": "Why this approach is incorrect or suboptimal"
        }}
      ]
    }}
  ]
}}

IMPORTANT:
- Return ONLY the JSON object, no additional text
- Each step must have exactly 3 choices
- Exactly one choice per step must have "correct": true
- Incorrect choices must have explanations
- Correct choices must have "explanation": null
- Use sequential IDs (step-1, step-2, etc. and choice-1, choice-2, etc.)
"""
        return prompt
    
    def _parse_response(self, response: str) -> Dict:
        """
        Extract and parse JSON flowchart data from AI response.
        
        Args:
            response: Raw response text from Gemini AI.
            
        Returns:
            dict: Parsed flowchart data structure.
            
        Raises:
            ValueError: If response cannot be parsed as valid JSON.
        """
        # Clean the response - remove markdown code blocks if present
        cleaned = response.strip()
        
        # Remove markdown code block markers
        if cleaned.startswith('```'):
            lines = cleaned.split('\n')
            # Remove first line (```json or ```)
            lines = lines[1:]
            # Remove last line if it's ```
            if lines and lines[-1].strip() == '```':
                lines = lines[:-1]
            cleaned = '\n'.join(lines).strip()
        
        # Try to find JSON object in the response
        start_idx = cleaned.find('{')
        end_idx = cleaned.rfind('}')
        
        if start_idx == -1 or end_idx == -1:
            raise ValueError("No JSON object found in response")
        
        json_str = cleaned[start_idx:end_idx + 1]
        
        try:
            flowchart_data = json.loads(json_str)
            return flowchart_data
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse JSON response: {str(e)}")

    def _validate_flowchart(self, flowchart: Dict) -> bool:
        """
        Ensure response has correct structure (steps array, choices with correct/explanation fields).
        
        Args:
            flowchart: Parsed flowchart data to validate.
            
        Returns:
            bool: True if flowchart structure is valid.
            
        Raises:
            ValueError: If flowchart structure is invalid with specific error message.
        """
        # Check top-level structure
        if not isinstance(flowchart, dict):
            raise ValueError("Flowchart must be a dictionary")
        
        if 'steps' not in flowchart:
            raise ValueError("Flowchart must contain 'steps' array")
        
        steps = flowchart['steps']
        if not isinstance(steps, list):
            raise ValueError("'steps' must be an array")
        
        if len(steps) == 0:
            raise ValueError("Flowchart must contain at least one step")
        
        # Validate each step
        for i, step in enumerate(steps):
            step_num = i + 1
            
            if not isinstance(step, dict):
                raise ValueError(f"Step {step_num} must be a dictionary")
            
            # Check required step fields
            if 'id' not in step:
                raise ValueError(f"Step {step_num} missing 'id' field")
            if 'description' not in step:
                raise ValueError(f"Step {step_num} missing 'description' field")
            if 'choices' not in step:
                raise ValueError(f"Step {step_num} missing 'choices' array")
            
            # Validate choices
            choices = step['choices']
            if not isinstance(choices, list):
                raise ValueError(f"Step {step_num} 'choices' must be an array")
            
            if len(choices) != 3:
                raise ValueError(f"Step {step_num} must have exactly 3 choices, got {len(choices)}")
            
            correct_count = 0
            for j, choice in enumerate(choices):
                choice_num = j + 1
                
                if not isinstance(choice, dict):
                    raise ValueError(f"Step {step_num}, choice {choice_num} must be a dictionary")
                
                # Check required choice fields
                if 'id' not in choice:
                    raise ValueError(f"Step {step_num}, choice {choice_num} missing 'id' field")
                if 'text' not in choice:
                    raise ValueError(f"Step {step_num}, choice {choice_num} missing 'text' field")
                if 'correct' not in choice:
                    raise ValueError(f"Step {step_num}, choice {choice_num} missing 'correct' field")
                if 'explanation' not in choice:
                    raise ValueError(f"Step {step_num}, choice {choice_num} missing 'explanation' field")
                
                # Validate field types
                if not isinstance(choice['correct'], bool):
                    raise ValueError(f"Step {step_num}, choice {choice_num} 'correct' must be boolean")
                
                # Count correct choices
                if choice['correct']:
                    correct_count += 1
                    # Correct choice should have null explanation
                    if choice['explanation'] is not None:
                        raise ValueError(f"Step {step_num}, choice {choice_num} is correct but has explanation (should be null)")
                else:
                    # Incorrect choice must have explanation
                    if not choice['explanation'] or not isinstance(choice['explanation'], str):
                        raise ValueError(f"Step {step_num}, choice {choice_num} is incorrect but missing explanation")
            
            # Exactly one correct choice per step
            if correct_count != 1:
                raise ValueError(f"Step {step_num} must have exactly 1 correct choice, got {correct_count}")
        
        return True
    
    def generate_flowchart(self, problem: str) -> Dict:
        """
        Orchestrate prompt building, API call, parsing, and validation to generate a flowchart.
        
        Args:
            problem: The coding problem text to generate a flowchart for.
            
        Returns:
            dict: Valid flowchart data structure.
            
        Raises:
            ValueError: If problem is empty or invalid.
            RuntimeError: If API call fails after max retries or validation fails.
        """
        if not problem or not isinstance(problem, str) or not problem.strip():
            raise ValueError("Problem text cannot be empty")
        
        # Build the prompt
        prompt = self._build_prompt(problem)
        
        # Retry logic for API calls
        last_error = None
        for attempt in range(1, self.max_retries + 1):
            try:
                # Call Gemini API
                response = self.model.generate_content(prompt)
                
                # Check if response was blocked or empty
                if not response.text:
                    raise RuntimeError("Gemini API returned empty response")
                
                # Parse the response
                flowchart_data = self._parse_response(response.text)
                
                # Validate the flowchart structure
                self._validate_flowchart(flowchart_data)
                
                # Success!
                return flowchart_data
                
            except ValueError as e:
                # Validation or parsing error - retry
                last_error = e
                if attempt < self.max_retries:
                    time.sleep(1)  # Brief delay before retry
                    continue
                else:
                    raise RuntimeError(f"Failed to generate valid flowchart after {self.max_retries} attempts: {str(e)}")
            
            except Exception as e:
                # API or other error - retry
                last_error = e
                if attempt < self.max_retries:
                    time.sleep(2)  # Longer delay for API errors
                    continue
                else:
                    raise RuntimeError(f"Gemini API call failed after {self.max_retries} attempts: {str(e)}")
        
        # Should not reach here, but just in case
        raise RuntimeError(f"Failed to generate flowchart: {str(last_error)}")
