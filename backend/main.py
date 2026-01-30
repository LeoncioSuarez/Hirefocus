from fastapi import FastAPI
import asyncio
try:
    from backend.db import database
    from backend.db.database import Base
    from backend.routers import users as users_router
    from backend.routers import jobs as jobs_router
    from backend.routers import applicants as applicants_router
    from backend.routers import integrations as integrations_router
except ModuleNotFoundError:
    from db import database
    from db.database import Base
    from routers import users as users_router
    from routers import jobs as jobs_router
    from routers import applicants as applicants_router
    from routers import integrations as integrations_router
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI(
    title="Hirefocus API",
    description="API for Hirefocus application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.on_event("startup")
async def on_startup():
    try:
        async with database.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as exc:
        # Log the error but allow the app to start so you can debug/repair DB separately
        logging.exception("No se pudo inicializar la base de datos en startup: %s", exc)


# register routers
app.include_router(users_router.router)
app.include_router(jobs_router.router)
app.include_router(applicants_router.router)
app.include_router(integrations_router.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)