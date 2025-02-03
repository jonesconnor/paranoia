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

data_store = {}

class DataModel(BaseModel):
    data: str

class SecretModel(BaseModel):
    secret: str

@app.get("/")
def hello_world():
    return {"message": "Hello World"}

@app.post("/postdata")
async def submit_data(data: DataModel):
    key = len(data_store) + 1
    data_store[key] = data.data
    return JSONResponse(status_code=201, content={"message": "Your data is somewhere in the cloud!", "key": key})

@app.get("/getdata/{key}")
async def get_data(key: int):
    if key in data_store:
        return {"data": data_store[key]}
    return JSONResponse(status_code=404, content={"message": "Data not found! Lost in the cloud!"})

@app.delete("/deletedata/{key}")
async def delete_data(key: int):
    if key in data_store:
        del data_store[key]
        return JSONResponse(status_code=200, content={"message": "Data deleted successfully!"})
    return JSONResponse(status_code=404, content={"message": "Data not found! Lost in the cloud!"})

@app.post("/generateuuid")
async def generate_uuid(secret: SecretModel, db: Session = Depends(get_db)):
    uuid = str(uuid4())
    secret = Secret(secret=secret.secret, uuid=uuid)
    db.add(secret)
    db.commit()
    db.refresh(secret)
    return JSONResponse(status_code=201, content={"message": "Secret stored successfully!",
                                                  "uuid": uuid,
                                                  "url": f"http://127.0.0.1:8000/getsecret/{uuid}"})

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