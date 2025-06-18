from uuid import UUID

from pydantic import BaseModel, Field


class RoleBase(BaseModel):
    """Base schema for Role with common fields."""

    name: str = Field(..., min_length=1, max_length=100, description='Role name')
    description: str | None = Field(
        None, max_length=255, description='Role description'
    )


class RoleCreate(RoleBase):
    """Schema for creating a new role."""


class RoleUpdate(BaseModel):
    """Schema for updating an existing role."""

    name: str | None = Field(
        None, min_length=1, max_length=100, description='Role name'
    )
    description: str | None = Field(
        None, max_length=255, description='Role description'
    )


class RoleResponse(RoleBase):
    """Schema for role response."""

    id: UUID

    class Config:
        from_attributes = True


class RoleListResponse(BaseModel):
    """Schema for list of roles response."""

    roles: list[RoleResponse]
    total: int
