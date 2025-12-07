"""
Base FastAPI application for skeleton apps.
Apps can import this and customize as needed.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings


def create_app(title: str = None, version: str = "0.1.0") -> FastAPI:
    """
    Create a FastAPI application with common middleware and configuration.
    
    Args:
        title: Application title (defaults to settings.app_name)
        version: API version
        
    Returns:
        Configured FastAPI application
    """
    app_title = title or settings.app_name
    
    app = FastAPI(title=app_title, version=version)
    
    # Add CORS middleware for frontend communication
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify actual origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Health check endpoint
    @app.get("/")
    async def root():
        return {
            "message": f"{app_title} is live",
            "app_name": settings.app_name,
            "status": "healthy"
        }
    
    return app


# Default app instance for simple use cases
app = create_app()