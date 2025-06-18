from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.geoportal.db.session import get_db
from src.geoportal.modules.users.api.v1.schemas import (
    UserCreate,
    UserListResponse,
    UserResponse,
    UserUpdate,
)
from src.geoportal.modules.users.crud import user_crud

router = APIRouter(prefix='/users', tags=['Users'])


@router.post('/', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Create a new user."""
    if await user_crud.get_by_email(db, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{user_data.email}' already exists",
        )
    if await user_crud.get_by_username(db, user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with username '{user_data.username}' already exists",
        )

    user = await user_crud.create(db, user_data)
    return UserResponse.model_validate(user)


@router.get('/', response_model=UserListResponse)
async def get_users(
    skip: int = Query(0, ge=0, description='Number of users to skip'),
    limit: int = Query(100, ge=1, le=1000, description='Number of users to return'),
    db: AsyncSession = Depends(get_db),
) -> UserListResponse:
    """Get all users with pagination."""
    users = await user_crud.get_all(db, skip=skip, limit=limit)
    total = await user_crud.count(db)
    return UserListResponse(
        users=[UserResponse.model_validate(user) for user in users],
        total=total,
    )


@router.get('/{user_id}', response_model=UserResponse)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Get user by ID."""
    user = await user_crud.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id '{user_id}' not found",
        )
    return UserResponse.model_validate(user)


@router.put('/{user_id}', response_model=UserResponse)
async def update_user(
    user_id: UUID,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Update user by ID."""
    existing_user = await user_crud.get_by_id(db, user_id)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id '{user_id}' not found",
        )

    if user_data.email and user_data.email != existing_user.email:
        if await user_crud.get_by_email(db, user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User with email '{user_data.email}' already exists",
            )
    if user_data.username and user_data.username != existing_user.username:
        if await user_crud.get_by_username(db, user_data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User with username '{user_data.username}' already exists",
            )

    updated_user = await user_crud.update(db, user_id, user_data)
    return UserResponse.model_validate(updated_user)


@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete user by ID."""
    success = await user_crud.delete(db, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id '{user_id}' not found",
        )
