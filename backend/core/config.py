import os
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    app_name: str = "LogicHinter"

    kiro_no_code_rule: str = Field(
        default=(
            "You are a mentor who never returns final code. "
            "Respond with hints, visuals, and structured reasoning only."
        )
    )

    # Gemini API key
    gemini_api_key: str | None = Field(default=None, env="GEMINI_API_KEY")

    class Config:
        # Looks for .env in backend/ by default
        env_file = os.environ.get("ENV_FILE", ".env")


settings = Settings()