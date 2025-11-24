from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

try:
    from backend.db.database import get_db
    from backend.models.applicants import Application
    from backend.models.jobs import JobOffer
    from backend.models.users import User
    from backend.squemas.applicants import ApplicationCreate, ApplicationRead
except ModuleNotFoundError:
    from db.database import get_db
    from models.applicants import Application
    from models.jobs import JobOffer
    from models.users import User
    from squemas.applicants import ApplicationCreate, ApplicationRead

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("/", response_model=ApplicationRead)
async def create_application(payload: ApplicationCreate, db: AsyncSession = Depends(get_db)):
    # verify user and job exist
    u = await db.execute(select(User).where(User.id == payload.user_id))
    user = u.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    j = await db.execute(select(JobOffer).where(JobOffer.id == payload.job_id))
    job = j.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    application = Application(user_id=payload.user_id, job_id=payload.job_id, cv=payload.cv)
    # Add application and increment applicant_count; avoid nested transactions on the session
    try:
        db.add(application)
        job.applicant_count = (job.applicant_count or 0) + 1
        db.add(job)
        await db.commit()
        await db.refresh(application)
        return application
    except Exception:
        await db.rollback()
        raise


@router.get("/", response_model=List[ApplicationRead])
async def list_applications(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).offset(skip).limit(limit))
    items = result.scalars().all()
    return items


@router.get("/{application_id}", response_model=ApplicationRead)
async def get_application(application_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Application).where(Application.id == application_id))
    app = result.scalars().first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app
