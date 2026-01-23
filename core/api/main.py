import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import uvicorn
from core.configs import base
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from api.router import api_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, base.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager."""
    logger.info("Starting Vibebase Core API")
    # Startup logic here
    yield

    # Shutdown logic here
    logger.info("Shutting down Vibebase Core API")


# Create FastAPI application
app = FastAPI(
    title=base.app_name,
    version=base.version,
    description="Vibebase Core Backend API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[base.cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Vibebase Core API",
        "version": base.version,
        "environment": base.environment,
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level=base.log_level.lower(),
    )
