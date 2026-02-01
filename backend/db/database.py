from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv, find_dotenv
# Load .env from project root or parent directories
load_dotenv(find_dotenv())
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise SystemExit(
        "DATABASE_URL not found. Create a .env file at repository root with\n"
        "DATABASE_URL=postgresql+asyncpg://user:pass@host:port/dbname"
    )

engine = create_async_engine(DATABASE_URL, future=True, echo=False)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

Base = declarative_base()

# Dependency to use in FastAPI endpoints
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session