import asyncio
import sys

async def main():
    try:
        # ensure parent folder (backend) is on sys.path so local packages `db`, `models`, `squemas` import
        import os, sys
        parent = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        if parent not in sys.path:
            sys.path.insert(0, parent)
        print('PYTHONPATH sample:', sys.path[:5])
        # import inside to show clearer traceback if import fails
        # ensure package-level models import so SQLAlchemy mappers are registered
        import models
        from db.database import AsyncSessionLocal
        from models.users import User

        async with AsyncSessionLocal() as session:
            new = User(username='script_user', email='script@example.com', hashed_password='testpass')
            session.add(new)
            await session.commit()
            await session.refresh(new)
            print('Created user id:', new.id)
    except Exception as e:
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(main())
