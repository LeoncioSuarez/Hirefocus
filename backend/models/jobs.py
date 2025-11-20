from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

try:
    from backend.db.database import Base
except ModuleNotFoundError:
    from db.database import Base


class JobOffer(Base):
    __tablename__ = "job_offers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    required_skills = Column(Text, nullable=True)  # comma-separated or JSON string
    applicant_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
