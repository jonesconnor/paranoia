from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

data_store = {}

class DataModel(BaseModel):
    data: str

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