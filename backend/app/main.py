from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import resumes, jobs  # <--- IMPORT JOBS HERE

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Job Portal")

# CORS Setup (Allows React to talk to Python)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect the Routers
app.include_router(resumes.router)
app.include_router(jobs.router)     # <--- CONNECT JOBS HERE

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Job Portal Backend"}