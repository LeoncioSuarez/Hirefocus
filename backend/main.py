from fastapi import FastAPI
import asyncio
try:
    from backend.db import database
    from backend.db.database import Base
    from backend.routers import users as users_router
    from backend.routers import jobs as jobs_router
    from backend.routers import applicants as applicants_router
except ModuleNotFoundError:
    from db import database
    from db.database import Base
    from routers import users as users_router
    from routers import jobs as jobs_router
    from routers import applicants as applicants_router
from fastapi.middleware.cors import CORSMiddleware

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
    async with database.engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# register routers
app.include_router(users_router.router)
app.include_router(jobs_router.router)
app.include_router(applicants_router.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)