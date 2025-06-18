from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.geoportal.config.get_settings import get_settings

settings = get_settings()

engine = create_async_engine(
    str(settings.db.ASYNC_DATABASE_URI),
    echo=settings.app.ENV.value == 'dev',
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get database session.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
