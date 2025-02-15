from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.router_v1 import router
from core.config import settings
from db.postgres import migrate


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await migrate()
    yield


def _init_middlewares(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
        allow_headers=["*"],
    )


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.SERVICE_NAME,
        description=settings.SERVICE_DESCRIPTION,
        lifespan=lifespan,
    )
    _init_middlewares(app)
    app.include_router(router=router)

    return app
