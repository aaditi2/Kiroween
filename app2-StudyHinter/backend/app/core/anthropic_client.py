from __future__ import annotations

import requests
from typing import Any

from .config import settings


def _get_key() -> str:
    key = settings.anthropic_api_key
    if not key:
        raise RuntimeError(
            "Anthropic API key not configured. Set `ANTHROPIC_KEY_ENC` in .env (encrypted)"
        )
    return key


def _get_openrouter_key() -> str:
    key = settings.openrouter_key
    if not key:
        raise RuntimeError(
            "OpenRouter API key not configured. Set `OPENROUTER_KEY` in the environment."
        )
    return key


def _complete_openrouter(prompt: str, model: str, max_tokens: int) -> Any:
    key = _get_openrouter_key()
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {
        "model": model if "/" in model else f"anthropic/{model}",
        "messages": [
            {"role": "system", "content": "You are a helpful mentor."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": max_tokens,
    }
    resp = requests.post(url, json=payload, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()


def complete(prompt: str, model: str = "claude-3-haiku", max_tokens: int = 300) -> Any:
    """Call Anthropic completion endpoint using the decrypted API key.

    This uses the standard Anthropics HTTP endpoint. It sends `x-api-key`.
    If your deployment uses a different host (eg. OpenRouter), update the URL.
    """
    if settings.openrouter_key:
        return _complete_openrouter(prompt, model, max_tokens)

    key = _get_key()
    url = "https://api.anthropic.com/v1/complete"
    headers = {"x-api-key": key, "Content-Type": "application/json"}
    payload = {
        "model": model,
        "prompt": prompt,
        "max_tokens_to_sample": max_tokens,
    }
    resp = requests.post(url, json=payload, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()