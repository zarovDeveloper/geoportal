from enum import Enum

from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = '.env'


class AppSubSettings(BaseSettings):
    """Application specific settings."""

    class AppEnv(str, Enum):
        DEV = 'dev'
        TEST = 'test'
        PROD = 'prod'

    ENV: AppEnv = AppEnv.DEV
    NAME: str = 'Geoportal API'
    VERSION: str = '0.1.0'
    API_PREFIX: str = '/api/v1'

    model_config = SettingsConfigDict(
        env_file=ENV_FILE, env_prefix='APP_', extra='ignore'
    )


class MapServerSubSettings(BaseSettings):
    """MapServer specific settings."""

    URL: str = 'http://localhost:8080'

    model_config = SettingsConfigDict(
        env_file=ENV_FILE, env_prefix='MAPSERVER_', extra='ignore'
    )


class Settings(BaseSettings):
    """Main settings class that aggregates all sub-settings."""

    app: AppSubSettings = AppSubSettings()
    mapserver: MapServerSubSettings = MapServerSubSettings()

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding='utf-8',
        env_nested_delimiter='__',
        extra='ignore',
    )
