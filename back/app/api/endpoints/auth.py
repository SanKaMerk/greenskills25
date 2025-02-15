import httpx
from fastapi import APIRouter, Query, Depends, HTTPException, Cookie
from fastapi.security import OAuth2AuthorizationCodeBearer
from starlette.responses import JSONResponse

from api.shemas.user import UserModel
from core.config import settings

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=settings.KEYCLOAK_AUTHORIZATION_URL,
    tokenUrl=settings.KEYCLOAK_TOKEN_URL,
)

auth_router = APIRouter()


@auth_router.get('/token')
async def auth(code: str = Query(None)):
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.REDIRECT_URI,
        "client_id": settings.KEYCLOAK_CLIENT_ID,
        "client_secret": settings.KEYCLOAK_CLIENT_SECRET,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            settings.KEYCLOAK_TOKEN_URL,
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        response.raise_for_status()
        token_response = response.json()
    response = JSONResponse({"access_token": token_response["access_token"]})
    response.set_cookie(key="refresh_token", value=token_response["refresh_token"], httponly=True, secure=False)
    return response


async def get_current_user(token: str = Depends(oauth2_scheme)):
    async with httpx.AsyncClient() as client:
        payload = {
            "token": token,
            "client_id": settings.KEYCLOAK_CLIENT_ID,
            "client_secret": settings.KEYCLOAK_CLIENT_SECRET,
        }
        response = await client.post(
            f"{settings.KEYCLOAK_SERVER_URL}/realms/{settings.KEYCLOAK_REALM}/protocol/openid-connect/token/introspect",
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()
        user = response.json()
        if not user.get("active"):
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return UserModel(
        id=user['sub'],
        name=user['name'],
        username=user['username'],
        role=user['realm_access']['roles'][0]
    )


@auth_router.get("/me")
def get_user_info(user: UserModel = Depends(get_current_user)):
    return user


@auth_router.get("/refresh")
async def refresh_token_endpoint(refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token отсутствует")

    payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": settings.KEYCLOAK_CLIENT_ID,
        "client_secret": settings.KEYCLOAK_CLIENT_SECRET,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            settings.KEYCLOAK_TOKEN_URL,
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        response.raise_for_status()
        token_response = response.json()

    response = JSONResponse({"access_token": token_response["access_token"]})
    response.set_cookie(key="refresh_token", value=token_response["refresh_token"], httponly=True, secure=False)
    return response
