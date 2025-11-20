from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class JobBase(BaseModel):
    title: str
    description: Optional[str] = None
    required_skills: Optional[str] = None


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[str] = None


class JobRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    required_skills: Optional[str]
    applicant_count: int
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
