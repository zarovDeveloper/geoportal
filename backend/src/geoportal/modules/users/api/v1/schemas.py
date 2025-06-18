from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from src.geoportal.modules.roles.api.v1.schemas import RoleResponse


class UserBase(BaseModel):
    """Base schema for User with common fields."""

    email: EmailStr = Field(..., description="User's email address")
    username: str = Field(..., min_length=3, max_length=100, description='Username')
    is_active: bool = True


class UserCreate(UserBase):
    """Schema for creating a new user."""

    password: str = Field(..., min_length=8, description="User's password")


class UserUpdate(BaseModel):
    """Schema for updating an existing user."""

    email: EmailStr | None = Field(None, description="User's email address")
    username: str | None = Field(
        None, min_length=3, max_length=100, description='Username'
    )
    is_active: bool | None = None
    password: str | None = Field(None, min_length=8, description='New password')


class UserResponse(UserBase):
    """Schema for user response, excluding password."""

    id: UUID
    roles: list[RoleResponse] = []

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Schema for a list of users response."""

    users: list[UserResponse]
    total: int
