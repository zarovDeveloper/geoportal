from fastapi import FastAPI

from src.geoportal.config.get_settings import get_settings
from src.geoportal.config.settings import Settings
from src.geoportal.modules.health.api.v1.router import router as health_router


def create_application() -> FastAPI:
    """
    Creates and configures the FastAPI application instance.
    """
    settings = get_settings()

    app = FastAPI(
        title=settings.app.NAME,
        description='API for the Sverdlovsk Oblast Tourist Objects Geoportal',
        version=settings.app.VERSION,
    )

    register_routers(app, settings)

    @app.get('/')
    async def root():
        return {'message': f'Welcome to {settings.app.NAME} v{settings.app.VERSION}'}

    return app


def register_routers(app: FastAPI, settings: Settings):
    """
    Includes all application routers.
    """

    app.include_router(health_router, prefix=settings.app.API_PREFIX, tags=['Health'])


app = create_application()
