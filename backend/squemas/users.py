from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
