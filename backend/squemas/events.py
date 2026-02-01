from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class EventCreate(BaseModel):
    application_id: Optional[int] = None
    title: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    participants: Optional[List[dict]] = None


class EventRead(BaseModel):
    id: int
    nylas_event_id: Optional[str]
    application_id: Optional[int]
    title: Optional[str]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    participants: Optional[List[dict]]
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
