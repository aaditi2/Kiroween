import os
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    app_name: str = "StudyHinter"

    # Gemini API key
    gemini_api_key: str | None = Field(default=None, alias="GEMINI_API_KEY")
    
    # Unsplash API key for fetching images
    unsplash_access_key: str | None = Field(default=None, alias="UNSPLASH_ACCESS_KEY")

    class Config:
        # Looks for .env in backend/ by default
        env_file = os.environ.get("ENV_FILE", ".env")
        extra = "ignore"  # Ignore extra fields from .env file


settings = Settings()