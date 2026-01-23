from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class DBSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Database
    db_host: str = Field(default="localhost", description="Database host")
    db_port: int = Field(default=5432, description="Database port")
    db_user: str = Field(default="vibebase_app_user", description="Database user")
    db_name: str = Field(default="vibebase", description="Database name")
    db_password: str = Field(default="password", description="Database password")
    db_echo: bool = Field(default=False, description="Echo SQL queries")


@lru_cache
def get_db_settings() -> DBSettings:
    """Get cached settings instance."""
    return DBSettings()


# Global settings instance
db_settings = get_db_settings()
