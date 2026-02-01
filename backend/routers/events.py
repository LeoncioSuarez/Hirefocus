from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

try:
    from backend.db.database import get_db
    from backend.models.events import Event
    from backend.squemas.applicants import ApplicationRead
except ModuleNotFoundError:
    from db.database import get_db
    from models.events import Event

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/", response_model=dict)
async def create_event(payload: dict, db: AsyncSession = Depends(get_db)):
    e = Event(nylas_event_id=payload.get("nylas_event_id"), application_id=payload.get("application_id"), title=payload.get("title"), start_time=payload.get("start_time"), end_time=payload.get("end_time"), participants=payload.get("participants"))
    db.add(e)
    await db.commit()
    await db.refresh(e)
    return {"event": e}


@router.get("/", response_model=List[dict])
async def list_events(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).offset(skip).limit(limit))
    items = result.scalars().all()
    return items


@router.get("/{event_id}")
async def get_event(event_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    e = result.scalars().first()
    if not e:
        raise HTTPException(status_code=404, detail="Event not found")
    return e
