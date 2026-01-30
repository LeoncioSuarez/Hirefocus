import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from backend.db.database import engine, Base
    from backend.models import User, JobOffer, Application, Candidate
except ImportError:
    from db.database import engine, Base
    from models import User, JobOffer, Application, Candidate

async def reset_db():
    async with engine.begin() as conn:
        print("Dropping all tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Database reset complete.")

if __name__ == "__main__":
    asyncio.run(reset_db())
