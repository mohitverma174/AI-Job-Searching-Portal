import sys
import os

# Add the current directory to Python's path so it can find 'app'
sys.path.append(os.getcwd())

from app.database import SessionLocal, engine
from app import models
db = SessionLocal()

# List of sample jobs
dummy_jobs = [
    {
        "title": "Python Developer",
        "company": "TechCorp",
        "location": "Remote",
        "description": "We need a backend developer strong in Python and FastAPI.",
        "required_skills": "Python,FastAPI,SQL,Git"
    },
    {
        "title": "Frontend Engineer",
        "company": "Creative UI",
        "location": "Bangalore",
        "description": "Looking for a React expert to build dashboards.",
        "required_skills": "React,JavaScript,CSS,HTML"
    },
    {
        "title": "Data Scientist",
        "company": "DataAI",
        "location": "Hyderabad",
        "description": "Analyze large datasets using ML models.",
        "required_skills": "Python,Machine Learning,Data Analysis,SQL"
    },
    {
        "title": "Java Backend Dev",
        "company": "FinTech Solutions",
        "location": "Mumbai",
        "description": "Enterprise Java development for banking.",
        "required_skills": "Java,Spring Boot,SQL,Microservices"
    }
]

def seed_jobs():
    # Check if jobs already exist
    existing_jobs = db.query(models.Job).count()
    if existing_jobs > 0:
        print("Database already has jobs. Skipping...")
        return

    for job_data in dummy_jobs:
        new_job = models.Job(
            title=job_data["title"],
            description=job_data["description"],
            location=job_data["location"],
            # We are reusing the 'salary_range' column for Company Name to save time
            salary_range=job_data["company"], 
            required_skills=job_data["required_skills"]
        )
        db.add(new_job)
    
    db.commit()
    print("✅ Successfully added dummy jobs to the database!")

if __name__ == "__main__":
    seed_jobs()