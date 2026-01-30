from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

try:
	from backend.db.database import Base
except ModuleNotFoundError:
	from db.database import Base


class Application(Base):
	__tablename__ = "applications"

	id = Column(Integer, primary_key=True, index=True)
	candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
	job_id = Column(Integer, ForeignKey("job_offers.id", ondelete="CASCADE"), nullable=False)
	cv = Column(Text, nullable=True)  # store CV text or a path to file
	stage = Column(String(50), default="Screening") # Added stage for pipeline
	created_at = Column(DateTime(timezone=True), server_default=func.now())

	candidate = relationship("Candidate", back_populates="applications")
	job = relationship("JobOffer", back_populates="applications")
