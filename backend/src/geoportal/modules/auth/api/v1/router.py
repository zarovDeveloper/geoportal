import uuid

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.geoportal.core.security import create_access_token
from src.geoportal.db.session import get_db
from src.geoportal.modules.auth.api.v1.schemas import Token
from src.geoportal.modules.auth.crud import auth_crud

router = APIRouter(prefix='/auth', tags=['Authentication'])


@router.post('/token', response_model=Token)
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """
    OAuth2 compatible token login, get an access token for future requests.

    This endpoint returns the token in the response body and also sets
    an HTTP-only cookie with the token.
    """
    user = await auth_crud.authenticate_user(
        db, username=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    access_token = create_access_token(subject=uuid.UUID(str(user.id)))
    response.set_cookie(
        key='access_token',
        value=access_token,
        httponly=True,
        samesite='lax',
        secure=False,
    )
    return {'access_token': access_token, 'token_type': 'bearer'}
