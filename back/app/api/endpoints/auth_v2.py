from fastapi import Depends, HTTPException, APIRouter
from fastapi.responses import ORJSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from api.shemas.user_v2 import UserLogin
from services.jwt import jwt_auth
from services.db_service import DBManager, get_db_manager


router = APIRouter()


@router.post(
    '/login',
)
async def login(
    body: UserLogin,
    db_manager: DBManager = Depends(get_db_manager),
) -> ORJSONResponse:
    user = await db_manager.get_user(body)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return ORJSONResponse(
        {
            'access_token': jwt_auth.create_token(user.id),
        }
    )


@router.post(
    '/create_user',
)
async def create_user(
    body: UserLogin,
    db_manager: DBManager = Depends(get_db_manager),
) -> ORJSONResponse:
    return await db_manager.create_user(body)