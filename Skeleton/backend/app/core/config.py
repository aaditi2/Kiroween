"""
Base configuration for all Skeleton-based apps.
Apps should inherit from BaseAppSettings and add their own fields.
"""
import os
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class BaseAppSettings(BaseSettings):
    """
    Base settings that all skeleton apps should inherit from.
    Contains common configuration fields used across all apps.
    """
    # App identification
    app_name: str = "SkeletonApp"
    
    # AI Integration
    gemini_api_key: Optional[str] = Field(default=None, env="GEMINI_API_KEY")
    
    class Config:
        # Looks for .env in backend/ by default
        env_file = os.environ.get("ENV_FILE", ".env")
        extra = "ignore"  # Ignore extra fields from .env file


# Default instance for apps that don't need customization
settings = BaseAppSettings()