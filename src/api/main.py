from fastapi import Depends, FastAPI, File, UploadFile
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

from fastapi.middleware.cors import CORSMiddleware

import shutil
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000/about"],  # Replace with the actual URL of your Next.js app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/timeline/", response_model=list[schemas.ZCountTimelineCreate])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    timeline = crud.get_timeline(db, skip=skip, limit=limit)
    return timeline

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Define the directory to save the file
    save_dir = "public/uploads"
    os.makedirs(save_dir, exist_ok=True)  # Create directory if it doesn’t exist

    # Define the full path for saving the file
    file_path = os.path.join(save_dir, "my-file.jpg")

    # Write the file to the directory
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "File uploaded and saved successfully", "file_path": file_path}



#uvicorn src.api.main:app --reload