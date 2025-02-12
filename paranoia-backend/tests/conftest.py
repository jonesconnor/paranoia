"""
Configuration and fixtures for testing the ParaNoia application backend.

This module sets up the test database and provides fixtures for use in test cases.
It includes a function to configure pytest and a fixture to provide a test database session.
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.main import app, get_db

def pytest_configure():
    """
    Configure pytest with a test database.

    This function sets up a SQLite test database and overrides the get_db dependency
    in the FastAPI app to use the test database session.
    """
    sqlalchemy_test_database_url = "sqlite:///./test.db"
    engine = create_engine(sqlalchemy_test_database_url)
    testing_session_local = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    def override_get_db():
        db = testing_session_local()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def test_db():
    """
    Fixture to provide a test database session.

    This fixture sets up a SQLite test database, creates all tables, and provides
    a database session for use in test cases. The database is cleaned up after each test.
    
    Yields:
        db (Session): A SQLAlchemy database session.
    """
    sqlalchemy_test_database_url = "sqlite:///./test.db"
    engine = create_engine(sqlalchemy_test_database_url)
    testing_session_local = sessionmaker(bind=engine)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = testing_session_local()
    try:
        yield db
    finally:
        db.close()
