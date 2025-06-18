from uuid import UUID

from pydantic import BaseModel, Field


class Token(BaseModel):
    """Schema for the access token response."""

    access_token: str = Field(..., description='The JWT access token')
    token_type: str = Field('bearer', description='The type of token')


class TokenPayload(BaseModel):
    """Schema for the data encoded in the JWT."""

    sub: UUID = Field(..., description='Subject of the token (user ID)')
    exp: int | None = Field(None, description='Expiration time claim')
