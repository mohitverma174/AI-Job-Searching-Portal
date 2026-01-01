from fastapi import FastAPI
from . import models
from .database import engine

# 1. Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Job Portal")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Job Portal Backend"}

# We will add Resume Parsing code here in the next step!