"""
Database configuration and utility functions for the ParaNoia application backend.

This module sets up the SQLAlchemy engine, session, and base class for the ORM models.
It also provides a dependency function for obtaining a database session in FastAPI routes.

Attributes:
    engine: The SQLAlchemy engine connected to the database.
    SessionLocal: The SQLAlchemy session factory.
    Base: The declarative base class for ORM models.

Functions:
    get_db(): Dependency function for obtaining a database session.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """
    Dependency function for obtaining a database session.

    This function provides a SQLAlchemy database session to FastAPI routes.
    Yields a database session and ensures that the session closes after the request is completed.

    Yields:
        db (Session): A SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
