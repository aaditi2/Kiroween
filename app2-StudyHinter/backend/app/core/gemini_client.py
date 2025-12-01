import requests
from typing import Any
from .config import settings


def complete(prompt: str) -> Any:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY not found in environment")

    url = (
        "https://generativelanguage.googleapis.com"
        f"/v1beta/models/gemini-2.0-flash:generateContent?key={settings.gemini_api_key}"
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

    response = requests.post(url, json=payload, headers=headers, timeout=30)
    response.raise_for_status()
    return response.json()