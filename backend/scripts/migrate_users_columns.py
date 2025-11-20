import asyncio
from sqlalchemy import text

async def main():
    import os, sys
    parent = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    if parent not in sys.path:
        sys.path.insert(0, parent)
    try:
        from db.database import engine
    except Exception as e:
        print('Failed import engine:', e)
        raise

    async with engine.begin() as conn:
        print('Adding hashed_password column if not exists...')
        await conn.run_sync(lambda sync_conn: sync_conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS hashed_password VARCHAR(255);")))
        print('Adding is_active column if not exists...')
        await conn.run_sync(lambda sync_conn: sync_conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;")))
        print('Attempting to copy password -> hashed_password (if password column exists)')
        try:
            await conn.run_sync(lambda sync_conn: sync_conn.execute(text("UPDATE users SET hashed_password = password WHERE password IS NOT NULL;")))
        except Exception as e:
            print('Update from password failed (maybe column missing):', e)
        print('Dropping old password column if exists...')
        await conn.run_sync(lambda sync_conn: sync_conn.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS password;")))
    print('Migration finished')

if __name__ == '__main__':
    asyncio.run(main())
