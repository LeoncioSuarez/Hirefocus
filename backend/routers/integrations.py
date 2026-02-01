from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import os
import time

try:
    from backend.db.database import get_db
    from backend.models.users import User
    from backend.models.candidates import Candidate
    from backend.models.applicants import Application
    from backend.models.jobs import JobOffer
    from backend.services import stream_service
    from backend.services import affinda_service, nylas_service
except ModuleNotFoundError:
    from db.database import get_db
    from models.users import User
    from models.candidates import Candidate
    from models.applicants import Application
    from models.jobs import JobOffer
    from services import stream_service
    from services import affinda_service, nylas_service

# Authentication dependencies would normally go here
# For now, we will assume a simple user_id is passed or simulate current user

router = APIRouter(
    prefix="/integrations",
    tags=["integrations"]
)

@router.post("/stream/token")
async def get_stream_token(user_id: str, name: str, db: AsyncSession = Depends(get_db)):
    """
    Generate a Stream Chat token for the user.
    Ideally this endpoint is protected and user_id comes from the auth token.
    For this demo, we accept user_id and name to upsert and generate token.
    """
    try:
        # Upsert user to Stream (ensure they exist)
        stream_service.upsert_user(user_id, name)
        
        # Generate token
        token = stream_service.create_token(user_id)
        
        return {
            "api_key": stream_service.STREAM_API_KEY,
            "token": token,
            "user_id": user_id,
            "user_name": name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/resumes/upload")
async def upload_resume(file: UploadFile = File(...), job_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    """Upload a resume file, parse via Affinda, create a Candidate and optionally an Application."""
    try:
        contents = await file.read()
        os.makedirs("uploads/resumes", exist_ok=True)
        filename = f"uploads/resumes/{int(time.time())}_{file.filename}"
        with open(filename, "wb") as f:
            f.write(contents)

        # Send to Affinda and parse
        parsed = affinda_service.parse_resume(filename)

        # Create Candidate record
        candidate = Candidate(
            full_name = parsed.get("full_name") or parsed.get("name") or "Unknown",
            email = parsed.get("email") or "",
            phone = parsed.get("phone") or None,
            resume_url = filename,
            skills = parsed.get("skills") or None,
            affinda_resume_id = parsed.get("id") or None,
            experience_summary = parsed.get("summary") or None,
        )
        db.add(candidate)
        await db.commit()
        await db.refresh(candidate)

        application = None
        if job_id:
            j = await db.execute(select(JobOffer).where(JobOffer.id == job_id))
            job = j.scalars().first()
            if not job:
                raise HTTPException(status_code=404, detail="Job not found")
            application = Application(candidate_id=candidate.id, job_id=job_id, cv=filename)
            db.add(application)
            job.applicant_count = (job.applicant_count or 0) + 1
            db.add(job)
            await db.commit()
            await db.refresh(application)

        return {"candidate": candidate, "application": application}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/calendars/availability")
async def calendars_availability(email: str, start: Optional[str] = None, end: Optional[str] = None):
    """Check availability slots for a user via Nylas (requires NYLAS_ACCESS_TOKEN)."""
    try:
        slots = nylas_service.get_availability(email, start, end)
        return {"availability": slots}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/calendars/create")
async def calendars_create(payload: dict):
    """Create a calendar event via Nylas."""
    try:
        ev = nylas_service.create_event(payload)
        return {"event": ev}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
