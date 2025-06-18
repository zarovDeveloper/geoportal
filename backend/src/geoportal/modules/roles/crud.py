from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.geoportal.db.models import Role
from src.geoportal.modules.roles.api.v1.schemas import RoleCreate, RoleUpdate


class RoleCRUD:
    """CRUD operations for Role model."""

    async def create(self, db: AsyncSession, role_data: RoleCreate) -> Role:
        """Create a new role."""
        role = Role(**role_data.model_dump())
        db.add(role)
        await db.commit()
        await db.refresh(role)
        return role

    async def get_by_id(self, db: AsyncSession, role_id: UUID) -> Role | None:
        """Get role by ID."""
        result = await db.execute(select(Role).where(Role.id == role_id))
        return result.scalar_one_or_none()

    async def get_by_name(self, db: AsyncSession, name: str) -> Role | None:
        """Get role by name."""
        result = await db.execute(select(Role).where(Role.name == name))
        return result.scalar_one_or_none()

    async def get_all(
        self, db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> list[Role]:
        """Get all roles with pagination."""
        result = await db.execute(select(Role).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def count(self, db: AsyncSession) -> int:
        """Count total number of roles."""
        result = await db.execute(select(Role))
        return len(list(result.scalars().all()))

    async def update(
        self, db: AsyncSession, role_id: UUID, role_data: RoleUpdate
    ) -> Role | None:
        """Update role by ID."""
        role = await self.get_by_id(db, role_id)
        if not role:
            return None

        update_data = role_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(role, field, value)

        await db.commit()
        await db.refresh(role)
        return role

    async def delete(self, db: AsyncSession, role_id: UUID) -> bool:
        """Delete role by ID."""
        role = await self.get_by_id(db, role_id)
        if not role:
            return False

        await db.delete(role)
        await db.commit()
        return True


role_crud = RoleCRUD()
