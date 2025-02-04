from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base
from datetime import datetime, timezone

class Secret(Base):
    __tablename__ = 'secrets'

    id = Column(Integer, primary_key=True, index=True)
    secret = Column(Text, nullable=False)
    uuid = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    remaining_accesses = Column(Integer, default=2)