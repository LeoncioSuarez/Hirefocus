from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import os, time

try:
    from backend.db.database import get_db
    from backend.models.candidates import Candidate
    from backend.squemas.candidates import CandidateCreate, CandidateRead
except ModuleNotFoundError:
    from db.database import get_db
    from models.candidates import Candidate
    from squemas.candidates import CandidateCreate, CandidateRead

router = APIRouter(prefix="/candidates", tags=["candidates"])


@router.post("/", response_model=CandidateRead)
async def create_candidate(payload: CandidateCreate, db: AsyncSession = Depends(get_db)):
    c = Candidate(full_name=payload.full_name, email=payload.email, phone=payload.phone, resume_url=payload.resume_url, skills=payload.skills)
    db.add(c)
    await db.commit()
    await db.refresh(c)
    return c


@router.get("/", response_model=List[CandidateRead])
async def list_candidates(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Candidate).offset(skip).limit(limit))
    items = result.scalars().all()
    return items


@router.get("/{candidate_id}", response_model=CandidateRead)
async def get_candidate(candidate_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Candidate).where(Candidate.id == candidate_id))
    c = result.scalars().first()
    if not c:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return c


@router.post("/{candidate_id}/upload")
async def upload_document(candidate_id: int, file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Candidate).where(Candidate.id == candidate_id))
    c = result.scalars().first()
    if not c:
        raise HTTPException(status_code=404, detail="Candidate not found")
    contents = await file.read()
    os.makedirs("uploads/documents", exist_ok=True)
    filename = f"uploads/documents/{int(time.time())}_{file.filename}"
    with open(filename, "wb") as f:
        f.write(contents)
    # create Document record if model exists
    try:
        from backend.models.documents import Document
        doc = Document(candidate_id=candidate_id, file_url=filename, file_type=file.content_type)
        db.add(doc)
        await db.commit()
        await db.refresh(doc)
        return {"document": doc}
    except Exception:
        # If documents model not available, still return file url
        return {"file_url": filename}
