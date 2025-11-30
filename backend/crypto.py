"""
Crypto utilities module for data sanitization and security operations.

This module provides functions for:
- Input sanitization to prevent injection attacks
- Session token generation for future authentication
"""

import secrets
import string
import re
from typing import Optional


def sanitize_input(text: str, max_length: Optional[int] = 10000) -> str:
    """
    Sanitize user input text to prevent injection attacks and clean malicious content.
    
    Args:
        text: The input text to sanitize
        max_length: Maximum allowed length for the input (default: 10000)
    
    Returns:
        Sanitized text string
    
    Raises:
        ValueError: If text is empty or exceeds max_length
    """
    if not text or not text.strip():
        raise ValueError("Input text cannot be empty")
    
    # Strip leading/trailing whitespace
    sanitized = text.strip()
    
    # Check length limit
    if max_length and len(sanitized) > max_length:
        raise ValueError(f"Input text exceeds maximum length of {max_length} characters")
    
    # Remove null bytes
    sanitized = sanitized.replace('\x00', '')
    
    # Remove control characters except newlines, tabs, and carriage returns
    sanitized = ''.join(char for char in sanitized 
                       if char in '\n\r\t' or not (ord(char) < 32 or ord(char) == 127))
    
    # Normalize excessive whitespace (multiple spaces/newlines to single)
    sanitized = re.sub(r' +', ' ', sanitized)
    sanitized = re.sub(r'\n{3,}', '\n\n', sanitized)
    
    # Remove potential script tags (basic XSS prevention)
    sanitized = re.sub(r'<script[^>]*>.*?</script>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove HTML/XML tags
    sanitized = re.sub(r'<[^>]+>', '', sanitized)
    
    return sanitized.strip()


def generate_session_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure random session token.
    
    This function is intended for future session management and authentication.
    
    Args:
        length: Length of the token in characters (default: 32)
    
    Returns:
        A secure random token string containing alphanumeric characters
    
    Raises:
        ValueError: If length is less than 16
    """
    if length < 16:
        raise ValueError("Token length must be at least 16 characters for security")
    
    # Use secrets module for cryptographically strong random generation
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for _ in range(length))
    
    return token


def generate_hex_token(byte_length: int = 32) -> str:
    """
    Generate a cryptographically secure random token in hexadecimal format.
    
    Alternative token generation method that produces hex strings.
    
    Args:
        byte_length: Number of random bytes to generate (default: 32)
    
    Returns:
        A secure random token string in hexadecimal format
    
    Raises:
        ValueError: If byte_length is less than 16
    """
    if byte_length < 16:
        raise ValueError("Byte length must be at least 16 for security")
    
    return secrets.token_hex(byte_length)
