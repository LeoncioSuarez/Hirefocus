"""Utility to create tables for SQLModel models without using Alembic.
Run: python backend/scripts/init_models.py
"""
import asyncio
from sqlmodel import SQLModel

try:
    from backend.db.database import engine
except ModuleNotFoundError:
    from db.database import engine


async def init_models():
    async with engine.begin() as conn:
        print("Creating SQLModel tables...")
        await conn.run_sync(SQLModel.metadata.create_all)


if __name__ == "__main__":
    asyncio.run(init_models())
