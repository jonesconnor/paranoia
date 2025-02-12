# pylint: disable=too-few-public-methods
"""
Database models for the ParaNoia application backend.

This module defines the SQLAlchemy ORM models for the ParaNoia application.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base

class Secret(Base):
    """
    Represents a secret stored in the database.

    Attributes:
        id (int): The primary key of the secret.
        secret (str): The encrypted secret text.
        uuid (str): The unique identifier for the secret.
        created_at (datetime): The timestamp when the secret was created.
        remaining_accesses (int): The number of remaining accesses for the secret.
    """
    __tablename__ = 'secrets'

    id = Column(Integer, primary_key=True, index=True)
    secret = Column(Text, nullable=False)
    uuid = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    remaining_accesses = Column(Integer, default=1)
