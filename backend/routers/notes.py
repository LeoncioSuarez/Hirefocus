from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

try:
    from backend.db.database import get_db
    from backend.models.notes import Note
    from backend.squemas.notes import NoteCreate, NoteRead
except ModuleNotFoundError:
    from db.database import get_db
    from models.notes import Note
    from squemas.notes import NoteCreate, NoteRead

router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("/", response_model=NoteRead)
async def create_note(payload: NoteCreate, db: AsyncSession = Depends(get_db)):
    n = Note(candidate_id=payload.candidate_id, user_id=payload.user_id, content=payload.content)
    db.add(n)
    await db.commit()
    await db.refresh(n)
    return n


@router.get("/", response_model=List[NoteRead])
async def list_notes(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).offset(skip).limit(limit))
    items = result.scalars().all()
    return items
