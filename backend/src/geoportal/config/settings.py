from enum import Enum

from pydantic import PostgresDsn, computed_field
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


class DbSubSettings(BaseSettings):
    """Database specific settings."""

    USER: str = 'user'
    PASSWORD: str = 'password'
    HOST: str = 'localhost'
    PORT: int = 5432
    NAME: str = 'geoportaldb'

    @computed_field
    @property
    def ASYNC_DATABASE_URI(self) -> PostgresDsn:
        """Constructs the asynchronous database URI for the application."""
        return PostgresDsn(
            f'postgresql+asyncpg://{self.USER}:{self.PASSWORD}@{self.HOST}:{self.PORT}/{self.NAME}'
        )

    @computed_field
    @property
    def SYNC_DATABASE_URI(self) -> PostgresDsn:
        """Constructs the synchronous database URI for Alembic."""
        return PostgresDsn(
            f'postgresql://{self.USER}:{self.PASSWORD}@{self.HOST}:{self.PORT}/{self.NAME}'
        )

    model_config = SettingsConfigDict(
        env_file=ENV_FILE, env_prefix='DB_', extra='ignore'
    )


class Settings(BaseSettings):
    """Main settings class that aggregates all sub-settings."""

    app: AppSubSettings = AppSubSettings()
    mapserver: MapServerSubSettings = MapServerSubSettings()
    db: DbSubSettings = DbSubSettings()

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding='utf-8',
        env_nested_delimiter='__',
        extra='ignore',
    )
