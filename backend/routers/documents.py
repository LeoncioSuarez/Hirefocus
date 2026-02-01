from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

try:
    from backend.db.database import get_db
    from backend.models.documents import Document
    from backend.squemas.documents import DocumentCreate, DocumentRead
except ModuleNotFoundError:
    from db.database import get_db
    from models.documents import Document
    from squemas.documents import DocumentCreate, DocumentRead

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/", response_model=DocumentRead)
async def create_doc(payload: DocumentCreate, db: AsyncSession = Depends(get_db)):
    d = Document(candidate_id=payload.candidate_id, file_url=payload.file_url, file_type=payload.file_type)
    db.add(d)
    await db.commit()
    await db.refresh(d)
    return d


@router.get("/", response_model=List[DocumentRead])
async def list_docs(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).offset(skip).limit(limit))
    items = result.scalars().all()
    return items
