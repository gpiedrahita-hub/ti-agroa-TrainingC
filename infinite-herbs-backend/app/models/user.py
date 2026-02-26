import uuid

from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    userName = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashedPassword = Column(String, nullable=False)
    firstName = Column(String, nullable=False)
    lastName = Column(String, nullable=False)
    role = Column(String, default="user")  # admin, user, viewer
    isActive = Column(Boolean, default=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
