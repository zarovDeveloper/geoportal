from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.geoportal.db.session import get_db
from src.geoportal.modules.auth.dependencies import require_role
from src.geoportal.modules.roles.api.v1.schemas import (
    RoleCreate,
    RoleListResponse,
    RoleResponse,
    RoleUpdate,
)
from src.geoportal.modules.roles.crud import role_crud

router = APIRouter(
    prefix='/roles',
    tags=['Roles'],
    dependencies=[Depends(require_role(['admin']))],
)


@router.post('/', response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
async def create_role(
    role_data: RoleCreate,
    db: AsyncSession = Depends(get_db),
) -> RoleResponse:
    """Create a new role."""
    existing_role = await role_crud.get_by_name(db, role_data.name)
    if existing_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role with name '{role_data.name}' already exists",
        )

    role = await role_crud.create(db, role_data)
    return RoleResponse.model_validate(role)


@router.get('/', response_model=RoleListResponse)
async def get_roles(
    skip: int = Query(0, ge=0, description='Number of roles to skip'),
    limit: int = Query(100, ge=1, le=1000, description='Number of roles to return'),
    db: AsyncSession = Depends(get_db),
) -> RoleListResponse:
    """Get all roles with pagination."""
    roles = await role_crud.get_all(db, skip=skip, limit=limit)
    total = await role_crud.count(db)

    return RoleListResponse(
        roles=[RoleResponse.model_validate(role) for role in roles],
        total=total,
    )


@router.get('/{role_id}', response_model=RoleResponse)
async def get_role(
    role_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> RoleResponse:
    """Get role by ID."""
    role = await role_crud.get_by_id(db, role_id)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with id '{role_id}' not found",
        )

    return RoleResponse.model_validate(role)


@router.put('/{role_id}', response_model=RoleResponse)
async def update_role(
    role_id: UUID,
    role_data: RoleUpdate,
    db: AsyncSession = Depends(get_db),
) -> RoleResponse:
    """Update role by ID."""
    existing_role = await role_crud.get_by_id(db, role_id)
    if not existing_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with id '{role_id}' not found",
        )

    if role_data.name and role_data.name != existing_role.name:
        name_conflict = await role_crud.get_by_name(db, role_data.name)
        if name_conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Role with name '{role_data.name}' already exists",
            )

    updated_role = await role_crud.update(db, role_id, role_data)
    return RoleResponse.model_validate(updated_role)


@router.delete('/{role_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_role(
    role_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete role by ID."""
    success = await role_crud.delete(db, role_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Role with id '{role_id}' not found",
        )
