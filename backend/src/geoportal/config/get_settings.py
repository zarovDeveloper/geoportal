from functools import lru_cache

from src.geoportal.config.settings import Settings


@lru_cache
def get_settings() -> Settings:
    """
    Returns the application settings.
    """
    return Settings()
