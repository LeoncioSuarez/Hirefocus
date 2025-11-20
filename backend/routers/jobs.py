from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

try:
    from backend.db.database import get_db
    from backend.models.jobs import JobOffer
    from backend.squemas.jobs import JobCreate, JobRead, JobUpdate
except ModuleNotFoundError:
    from db.database import get_db
    from models.jobs import JobOffer
    from squemas.jobs import JobCreate, JobRead, JobUpdate

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("/", response_model=JobRead)
async def create_job(payload: JobCreate, db: AsyncSession = Depends(get_db)):
    job = JobOffer(title=payload.title, description=payload.description, required_skills=payload.required_skills)
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


@router.get("/", response_model=List[JobRead])
async def list_jobs(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(JobOffer).offset(skip).limit(limit))
    jobs = result.scalars().all()
    return jobs


@router.get("/{job_id}", response_model=JobRead)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(JobOffer).where(JobOffer.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.put("/{job_id}", response_model=JobRead)
async def update_job(job_id: int, payload: JobUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(JobOffer).where(JobOffer.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if payload.title is not None:
        job.title = payload.title
    if payload.description is not None:
        job.description = payload.description
    if payload.required_skills is not None:
        job.required_skills = payload.required_skills
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


@router.delete("/{job_id}")
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(JobOffer).where(JobOffer.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    await db.delete(job)
    await db.commit()
    return {"detail": "deleted"}
