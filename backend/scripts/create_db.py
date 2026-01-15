import os
from urllib.parse import urlparse
from dotenv import load_dotenv
import psycopg2

# Load .env at repo root
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise SystemExit('DATABASE_URL not found in .env')

# Parse URL
# Example: postgresql+asyncpg://user:pass@host:port/dbname
parsed = urlparse(DATABASE_URL)
dbname = parsed.path.lstrip('/')
user = parsed.username
password = parsed.password
host = parsed.hostname or '127.0.0.1'
port = parsed.port or 5432

print(f"Creating database '{dbname}' if it does not exist on {host}:{port} as {user}...")

conn = psycopg2.connect(dbname='postgres', user=user, password=password, host=host, port=port)
conn.autocommit = True
cur = conn.cursor()
cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
if cur.fetchone():
    print('Database already exists')
else:
    cur.execute(f'CREATE DATABASE "{dbname}"')
    print('Database created')
cur.close()
conn.close()
