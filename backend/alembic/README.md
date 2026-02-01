Alembic migrations for Hirefocus backend

Usage (from project root):

1. Ensure `DATABASE_URL` is set in `.env` or environment.
2. Install dependencies (have `alembic` in your environment).
3. Run:

   cd backend
   alembic -c alembic.ini revision --autogenerate -m "initial"
   alembic -c alembic.ini upgrade head

Notes:

- `alembic.ini` in this folder references the `sqlalchemy.url` config from environment if available.
- Autogeneration uses `sqlmodel` metadata added in `backend/models/sqlmodels.py`.
