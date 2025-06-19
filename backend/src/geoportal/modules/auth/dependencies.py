from typing import Any, Callable, Coroutine, Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from src.geoportal.config.get_settings import get_settings
from src.geoportal.db.models import User
from src.geoportal.db.session import get_db
from src.geoportal.modules.auth.api.v1.schemas import TokenPayload
from src.geoportal.modules.users.crud import user_crud

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f'{settings.app.API_PREFIX}/auth/token', auto_error=False
)


async def get_token(
    request: Request, token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[str]:
    """
    Get token from header or cookie.
    """
    if token:
        return token
    return request.cookies.get('access_token')


async def get_current_user(
    token: Optional[str] = Depends(get_token), db: AsyncSession = Depends(get_db)
) -> User:
    """
    Dependency to get the current authenticated user.

    Decodes the JWT token, validates it, and fetches the user from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'},
    )
    if token is None:
        raise credentials_exception
    try:
        payload = jwt.decode(
            token, settings.auth.SECRET_KEY, algorithms=[settings.auth.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise credentials_exception

    user = await user_crud.get_by_id(db, user_id=token_data.sub)
    if user is None:
        raise credentials_exception
    return user


def require_role(required_roles: list[str]) -> Callable[[User], Coroutine[Any, Any, None]]:
    """
    Dependency factory to require a specific set of roles.
    """

    async def role_checker(current_user: User = Depends(get_current_user)) -> None:
        """
        Checks if the current user has any of the required roles.
        """
        user_roles = {role.name for role in current_user.roles}
        if not any(role in user_roles for role in required_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='The user does not have the required permissions',
            )

    return role_checker
