from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DocumentCreate(BaseModel):
    candidate_id: int
    file_url: str
    file_type: Optional[str] = None


class DocumentRead(BaseModel):
    id: int
    candidate_id: int
    file_url: str
    file_type: Optional[str]
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
