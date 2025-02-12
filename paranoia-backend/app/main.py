from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .database import get_db
from .models import Secret

from uuid import uuid4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SecretModel(BaseModel):
    secret: str

@app.get("/")
def hello_world():
    return {"message": "Hello World"}

@app.post("/generateuuid")
async def generate_uuid(secret: SecretModel, db: Session = Depends(get_db)):
    if not secret.secret.strip():
        return JSONResponse(status_code=400, content={"message": "Secret cannot be empty"})
    
    uuid = str(uuid4())
    secret = Secret(secret=secret.secret, uuid=uuid)
    db.add(secret)
    db.commit()
    db.refresh(secret)
    frontend_url = f"http://localhost:3000/reveal/{uuid}"
    return JSONResponse(status_code=201, content={"message": "Secret stored successfully!",
                                                  "uuid": uuid,
                                                  "url": frontend_url})

@app.get("/getsecret/{uuid}")
async def get_secret(uuid: str, db: Session = Depends(get_db)):
    secret = db.query(Secret).filter(Secret.uuid == uuid, Secret.remaining_accesses > 0).first()
    if secret:
        secret.remaining_accesses -= 1
        if secret.remaining_accesses == 0:
            db.delete(secret)
        db.commit()
        return {"secret": secret.secret}
    return JSONResponse(status_code=404, content={"message": "Secret not found!"})