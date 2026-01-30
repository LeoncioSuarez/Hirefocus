from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

try:
    from backend.db.database import Base
except ModuleNotFoundError:
    from db.database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    avatar_url = Column(String(500), nullable=True)  # For Stream Chat image
    
    # Affinda / Parsing Data
    affinda_resume_id = Column(String(100), nullable=True)
    resume_url = Column(String(500), nullable=True)
    skills = Column(JSON, nullable=True)  # Store skills as JSON list
    experience_summary = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")
