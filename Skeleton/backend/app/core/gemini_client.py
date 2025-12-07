"""
Shared Gemini AI client for all skeleton apps.
Handles authentication, request formatting, and error handling.
"""
import requests
from typing import Any, Dict, Optional
from .config import settings


class GeminiError(Exception):
    """Custom exception for Gemini API errors"""
    def __init__(self, message: str, status_code: Optional[int] = None):
        super().__init__(message)
        self.status_code = status_code


def complete(prompt: str, model: str = "gemini-2.0-flash") -> Dict[str, Any]:
    """
    Send a completion request to Gemini API.
    
    Args:
        prompt: The text prompt to send to Gemini
        model: The Gemini model to use (default: gemini-2.0-flash)
        
    Returns:
        The full JSON response from Gemini API
        
    Raises:
        GeminiError: If API key is missing or request fails
    """
    if not settings.gemini_api_key:
        raise GeminiError("GEMINI_API_KEY not found in environment")

    url = (
        "https://generativelanguage.googleapis.com"
        f"/v1beta/models/{model}:generateContent?key={settings.gemini_api_key}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        raise GeminiError("Request to Gemini API timed out")
    except requests.exceptions.RequestException as e:
        raise GeminiError(f"Request to Gemini API failed: {str(e)}", getattr(e.response, 'status_code', None))
    except Exception as e:
        raise GeminiError(f"Unexpected error calling Gemini API: {str(e)}")


def extract_text_response(response: Dict[str, Any]) -> str:
    """
    Extract the text content from a Gemini API response.
    
    Args:
        response: The JSON response from Gemini API
        
    Returns:
        The text content from the first candidate
        
    Raises:
        GeminiError: If response format is invalid
    """
    try:
        return response["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError) as e:
        raise GeminiError(f"Invalid response format from Gemini API: {str(e)}")