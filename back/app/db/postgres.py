from typing import Optional, AsyncGenerator

from pydantic import PostgresDsn
from sqlalchemy import AsyncAdaptedQueuePool
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from core.config import settings
from models import meta


def create_engine(db_url: PostgresDsn = settings.DATABASE_URL) -> AsyncEngine:
    return create_async_engine(
        str(db_url),
        poolclass=AsyncAdaptedQueuePool,
        connect_args={
            "statement_cache_size": 0,
        },
    )


def create_session(
    engine: Optional[AsyncEngine] = None,
) -> async_sessionmaker[AsyncSession]:
    return async_sessionmaker(
        bind=engine or create_engine(),
        class_=AsyncSession,
        autoflush=False,
        expire_on_commit=False,
    )


engine = create_engine(settings.DATABASE_URL)
async_session = create_session(engine)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session


async def migrate() -> None:
    try:
        async with engine.begin() as conn:
            await conn.run_sync(meta.metadata.create_all)
    except IntegrityError:

        async with engine.begin() as conn:
            await conn.run_sync(meta.metadata.drop_all())
            await conn.run_sync(meta.metadata.create_all)
