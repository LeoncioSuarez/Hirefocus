from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    hashed_password: str
    is_active: bool = True
    avatar_url: Optional[str] = None
    stream_token: Optional[str] = None
    nylas_grant_id: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    notes: List["Note"] = Relationship(back_populates="author")


class JobOffer(SQLModel, table=True):
    __tablename__ = "job_offers"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    required_skills: Optional[list] = Field(default=None, sa_column_kwargs={"type_": "JSON"})
    applicant_count: int = 0
    category: Optional[str] = None
    salary_range: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = "open"
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    applications: List["Application"] = Relationship(back_populates="job")


class Candidate(SQLModel, table=True):
    __tablename__ = "candidates"
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    stream_id: Optional[str] = None
    stream_token: Optional[str] = None
    affinda_resume_id: Optional[str] = None
    skills: Optional[list] = Field(default=None, sa_column_kwargs={"type_": "JSON"})
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    applications: List["Application"] = Relationship(back_populates="candidate")
    documents: List["Document"] = Relationship(back_populates="candidate")
    notes: List["Note"] = Relationship(back_populates="candidate")


class Application(SQLModel, table=True):
    __tablename__ = "applications"
    id: Optional[int] = Field(default=None, primary_key=True)
    candidate_id: int = Field(foreign_key="candidates.id")
    job_id: int = Field(foreign_key="job_offers.id")
    stage: str = "Screening"
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    candidate: Optional[Candidate] = Relationship(back_populates="applications")
    job: Optional[JobOffer] = Relationship(back_populates="applications")
    events: List["Event"] = Relationship(back_populates="application")

class Event(SQLModel, table=True):
    __tablename__ = "events"
    id: Optional[int] = Field(default=None, primary_key=True)
    nylas_event_id: Optional[str] = None
    application_id: Optional[int] = Field(default=None, foreign_key="applications.id")
    title: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    participants: Optional[list] = Field(default=None, sa_column_kwargs={"type_": "JSON"})
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    application: Optional[Application] = Relationship(back_populates="events")

class Note(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    candidate_id: int = Field(foreign_key="candidate.id")
    user_id: int = Field(foreign_key="user.id")
    content: str
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    candidate: Optional[Candidate] = Relationship(back_populates="notes")
    author: Optional[User] = Relationship(back_populates="notes")


class Document(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    candidate_id: int = Field(foreign_key="candidate.id")
    file_url: str
    file_type: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    candidate: Optional[Candidate] = Relationship(back_populates="documents")
