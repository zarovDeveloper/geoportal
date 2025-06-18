from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.geoportal.core.security import get_password_hash
from src.geoportal.db.models import Role, User
from src.geoportal.modules.roles.crud import role_crud
from src.geoportal.modules.users.api.v1.schemas import UserCreate, UserUpdate


class UserCRUD:
    """CRUD operations for User model."""

    async def create(self, db: AsyncSession, user_data: UserCreate) -> User:
        """Create a new user."""
        hashed_password = get_password_hash(user_data.password)
        user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password,
            is_active=user_data.is_active,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user, attribute_names=['roles'])
        return user

    async def get_by_id(self, db: AsyncSession, user_id: UUID) -> User | None:
        """Get user by ID with roles preloaded."""
        result = await db.execute(
            select(User).where(User.id == user_id).options(selectinload(User.roles))
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, db: AsyncSession, email: str) -> User | None:
        """Get user by email."""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_username(self, db: AsyncSession, username: str) -> User | None:
        """Get user by username."""
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def get_all(
        self, db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> list[User]:
        """Get all users with pagination and preloaded roles."""
        result = await db.execute(
            select(User).offset(skip).limit(limit).options(selectinload(User.roles))
        )
        return list(result.scalars().all())

    async def count(self, db: AsyncSession) -> int:
        """Count total number of users."""
        result = await db.execute(select(User))
        return len(list(result.scalars().all()))

    async def update(
        self, db: AsyncSession, user_id: UUID, user_data: UserUpdate
    ) -> User | None:
        """Update user by ID."""
        user = await self.get_by_id(db, user_id)
        if not user:
            return None

        update_data = user_data.model_dump(exclude_unset=True)

        if 'password' in update_data and update_data['password']:
            hashed_password = get_password_hash(update_data['password'])
            update_data['hashed_password'] = hashed_password
            del update_data['password']
        else:
            if 'password' in update_data:
                del update_data['password']

        for field, value in update_data.items():
            setattr(user, field, value)

        await db.commit()
        await db.refresh(user, attribute_names=['roles'])
        return user

    async def delete(self, db: AsyncSession, user_id: UUID) -> bool:
        """Delete user by ID."""
        user = await self.get_by_id(db, user_id)
        if not user:
            return False

        await db.delete(user)
        await db.commit()
        return True

    async def assign_role_to_user(
        self, db: AsyncSession, user_id: UUID, role_id: UUID
    ) -> User | None:
        """Assign a role to a user."""
        user = await self.get_by_id(db, user_id)
        if not user:
            return None

        role = await role_crud.get_by_id(db, role_id)
        if not role:
            return None

        if role not in user.roles:
            user.roles.append(role)
            await db.commit()
            await db.refresh(user, attribute_names=['roles'])

        return user


user_crud = UserCRUD()
