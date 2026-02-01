from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NoteCreate(BaseModel):
    candidate_id: int
    user_id: int
    content: str


class NoteRead(BaseModel):
    id: int
    candidate_id: int
    user_id: int
    content: str
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
