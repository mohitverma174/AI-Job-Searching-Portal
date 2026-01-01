from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from app.services.resume_parser import extract_text_from_pdf, extract_email, extract_skills

router = APIRouter()

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    # 1. Save the uploaded file temporarily
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # 2. Run our AI functions
        text = extract_text_from_pdf(file_location)
        email = extract_email(text)
        skills = extract_skills(text)
        
        # 3. Delete the temp file (cleanup)
        os.remove(file_location)
        
        # 4. Return the results
        return {
            "filename": file.filename,
            "extracted_email": email,
            "extracted_skills": skills,
            # "raw_text": text[:500] # Uncomment to debug text extraction
        }
        
    except Exception as e:
        if os.path.exists(file_location):
            os.remove(file_location)
        raise HTTPException(status_code=500, detail=str(e))