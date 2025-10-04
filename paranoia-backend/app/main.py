"""
Main application module for the ParaNoia backend.

This module sets up the FastAPI application, including middleware, routes,
and database interactions.
It defines endpoints for generating UUIDs for secrets and retrieving secrets.

Classes:
    SecretModel: Pydantic model for validating secret data.

Functions:
    hello_world(): Endpoint to return a simple greeting message.
    generate_uuid(secret: SecretModel, db: Session): Endpoint to generate a UUID for a secret and
    store it in the database.
    get_secret(uuid: str, db: Session): Endpoint to retrieve a secret by its UUID.
"""
from uuid import uuid4
from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .config import FRONTEND_BASE_URL
from .database import get_db
from .models import Secret

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SecretModel(BaseModel):
    """
    Pydantic model for validating secret data.

    Attributes:
        secret (str): The secret text to be stored.
    """
    secret: str

@app.get("/")
def hello_world():
    """
    Endpoint to return a simple greeting message.

    Returns:
        dict: A dictionary containing a greeting message.
    """
    return {"message": "Hello World"}

@app.post("/generateuuid")
async def generate_uuid(secret: SecretModel, db: Session = Depends(get_db)):
    """
    Endpoint to generate a UUID for a secret and stores it in the database.

    Args:
        secret (SecretModel): The secret data to be stored.
        db (Session): The database session.

    Returns:
        JSONResponse: A JSON response containing the UUID and URL of the stored secret.
    """
    if not secret.secret.strip():
        return JSONResponse(status_code=400, content={"message": "Secret cannot be empty"})
    uuid = str(uuid4())
    secret = Secret(secret=secret.secret, uuid=uuid)
    db.add(secret)
    db.commit()
    db.refresh(secret)
    frontend_url = f"{FRONTEND_BASE_URL.rstrip('/')}/reveal/{uuid}"
    return JSONResponse(status_code=201, content={"message": "Secret stored successfully!",
                                                  "uuid": uuid,
                                                  "url": frontend_url})

@app.get("/getsecret/{uuid}")
async def get_secret(uuid: str, db: Session = Depends(get_db)):
    """
    Endpoint to retrieve a secret by its UUID.

    Args:
        uuid (str): The UUID of the secret to be retrieved.
        db (Session): The database session.

    Returns:
        dict: A dictionary containing the secret text if found.
        JSONResponse: A JSON response with a 404 status code if the secret is not found.
    """
    secret = db.query(Secret).filter(Secret.uuid == uuid, Secret.remaining_accesses > 0).first()
    if secret:
        secret.remaining_accesses -= 1
        if secret.remaining_accesses == 0:
            db.delete(secret)
        db.commit()
        return {"secret": secret.secret}
    return JSONResponse(status_code=404, content={"message": "Secret not found!"})
