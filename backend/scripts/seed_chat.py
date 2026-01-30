import asyncio
import os
import sys

# Add parent directory to path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from backend.db.database import AsyncSessionLocal, engine, Base
    from backend.models.users import User
    from backend.services.stream_service import upsert_user
except ImportError:
    # If running from root
    from db.database import AsyncSessionLocal, engine, Base
    from models.users import User
    from services.stream_service import upsert_user

from sqlalchemy.future import select

async def seed_users():
    async with AsyncSessionLocal() as session:
        # Define users
        users_data = [
            {"username": "admin", "email": "admin@hirefocus.com", "id": 1},
            {"username": "admin1", "email": "admin1@hirefocus.com", "id": 2},
            {"username": "admin2", "email": "admin2@hirefocus.com", "id": 3},
        ]

        print("Seeding Users...")
        for data in users_data:
            stmt = select(User).where(User.username == data["username"])
            result = await session.execute(stmt)
            existing_user = result.scalar_one_or_none()
            
            user_id_str = str(data["id"])

            if not existing_user:
                new_user = User(
                    id=data["id"],
                    username=data["username"],
                    email=data["email"],
                    hashed_password="hashed_password_placeholder", # Mock password
                    avatar_url=f"https://i.pravatar.cc/150?u={data['id']}",
                    stream_token="" # Will be generated on login or here if needed, but upsert handles creation
                )
                session.add(new_user)
                print(f"Created DB User: {data['username']}")
            else:
                print(f"User {data['username']} already exists in DB.")
        
        await session.commit()

        # Sync with Stream Chat
        print("\nSyncing with Stream Chat...")
        for data in users_data:
            user_id = str(data["id"])
            try:
                upsert_user(
                    user_id=user_id,
                    name=data["username"],
                    image_url=f"https://i.pravatar.cc/150?u={user_id}",
                    role="admin"
                )
                print(f"Upserted Stream User: {data['username']} (ID: {user_id})")
            except Exception as e:
                print(f"Failed to upsert Stream User {data['username']}: {e}")

if __name__ == "__main__":
    asyncio.run(seed_users())
