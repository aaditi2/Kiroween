"""
Configuration management for LogicHinter backend.
Loads environment variables and validates required settings.
"""
import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Configuration class that loads and validates environment variables."""
    
    # Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv('GEMINI_API_KEY', '')
    
    # Server Configuration
    API_HOST: str = os.getenv('API_HOST', '0.0.0.0')
    API_PORT: int = int(os.getenv('API_PORT', '5000'))
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Debug Mode
    DEBUG: bool = os.getenv('DEBUG', 'False').lower() in ('true', '1', 'yes')
    
    @staticmethod
    def validate() -> bool:
        """
        Validate that all required configuration settings are present.
        
        Returns:
            bool: True if all required settings are valid, False otherwise.
        
        Raises:
            ValueError: If required configuration is missing or invalid.
        """
        errors = []
        
        # Validate Gemini API Key
        if not Config.GEMINI_API_KEY:
            errors.append("GEMINI_API_KEY is required but not set")
        
        # Validate API Port
        if not (1 <= Config.API_PORT <= 65535):
            errors.append(f"API_PORT must be between 1 and 65535, got {Config.API_PORT}")
        
        # Validate CORS Origins
        if not Config.CORS_ORIGINS or Config.CORS_ORIGINS == ['']:
            errors.append("CORS_ORIGINS must be set")
        
        if errors:
            error_message = "Configuration validation failed:\n" + "\n".join(f"  - {err}" for err in errors)
            raise ValueError(error_message)
        
        return True
    
    @classmethod
    def get_config_summary(cls) -> str:
        """
        Get a summary of current configuration (without sensitive data).
        
        Returns:
            str: Configuration summary.
        """
        return f"""
Configuration Summary:
  API Host: {cls.API_HOST}
  API Port: {cls.API_PORT}
  CORS Origins: {', '.join(cls.CORS_ORIGINS)}
  Debug Mode: {cls.DEBUG}
  Gemini API Key: {'*' * 8 if cls.GEMINI_API_KEY else 'NOT SET'}
"""
