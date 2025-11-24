from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ApplicationCreate(BaseModel):
    user_id: int
    job_id: int
    cv: Optional[str] = None


class ApplicationRead(BaseModel):
    id: int
    user_id: int
    job_id: int
    cv: Optional[str]
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
