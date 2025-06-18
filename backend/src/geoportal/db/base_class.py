from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase


class Base(AsyncAttrs, DeclarativeBase):
    """
    Base class for SQLAlchemy models.
    It includes support for async attributes with AsyncAttrs.
    """
