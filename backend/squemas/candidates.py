from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CandidateCreate(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    resume_url: Optional[str] = None
    skills: Optional[List[str]] = None


class CandidateRead(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str]
    resume_url: Optional[str]
    skills: Optional[List[str]]
    affinda_resume_id: Optional[str]
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
