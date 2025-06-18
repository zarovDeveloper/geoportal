from sqlalchemy.ext.asyncio import AsyncSession

from src.geoportal.core.security import verify_password
from src.geoportal.db.models import User
from src.geoportal.modules.users.crud import user_crud


class AuthCRUD:
    """Authentication-related operations."""

    async def authenticate_user(
        self, db: AsyncSession, username: str, password: str
    ) -> User | None:
        """
        Authenticates a user by checking username and password.

        Returns the user object if authentication is successful, otherwise None.
        """
        user = await user_crud.get_by_username(db, username)
        if not user:
            return None
        if not verify_password(password, str(user.hashed_password)):
            return None
        return user


auth_crud = AuthCRUD()
