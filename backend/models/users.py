from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

try:
	from backend.db.database import Base
except ModuleNotFoundError:
	from db.database import Base


class User(Base):
	__tablename__ = "users"

	id = Column(Integer, primary_key=True, index=True)
	username = Column(String(50), unique=True, index=True, nullable=False)
	email = Column(String(255), unique=True, index=True, nullable=False)
	hashed_password = Column(String(255), nullable=False)
	is_active = Column(Boolean, nullable=False, server_default='true')
	created_at = Column(DateTime(timezone=True), server_default=func.now())

	applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
