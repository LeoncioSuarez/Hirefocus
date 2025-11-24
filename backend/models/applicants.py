from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

try:
	from backend.db.database import Base
except ModuleNotFoundError:
	from db.database import Base


class Application(Base):
	__tablename__ = "applications"

	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
	job_id = Column(Integer, ForeignKey("job_offers.id", ondelete="CASCADE"), nullable=False)
	cv = Column(Text, nullable=True)  # store CV text or a path to file
	created_at = Column(DateTime(timezone=True), server_default=func.now())

	user = relationship("User", back_populates="applications")
	job = relationship("JobOffer", back_populates="applications")
