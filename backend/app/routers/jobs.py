from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from pydantic import BaseModel
from typing import List
from app.services.salary_predictor import predict_salary # <--- Add this

router = APIRouter()

class SkillsRequest(BaseModel):
    skills: List[str]

@router.post("/match-jobs")
def match_jobs(request: SkillsRequest, db: Session = Depends(get_db)):
    # 1. Get user skills
    user_skills = [s.lower() for s in request.skills]
    
    # 2. Get all jobs from DB
    all_jobs = db.query(models.Job).all()
    matched_jobs = []

    # 3. Find matches
    for job in all_jobs:
        if not job.required_skills:
            continue
            
        # Clean up job skills (split by comma)
        job_skills = [s.strip().lower() for s in job.required_skills.split(",")]
        
        # Check for overlap
        common_skills = set(user_skills).intersection(set(job_skills))
        match_count = len(common_skills)
        
        if match_count > 0:

            exp = job.min_experience if hasattr(job, "min_experience") and job.min_experience else 1.0
            predicted_salary = predict_salary(exp)

            matched_jobs.append({
                "title": job.title,
                "company": job.salary_range, 
                "location": job.location,
                "match_score": match_count,
                "common_skills": list(common_skills),
                "ai_salary": predicted_salary
            })

    # 4. Sort by best match
    matched_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    
    return matched_jobs