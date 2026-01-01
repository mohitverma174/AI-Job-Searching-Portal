import spacy
import re
from PyPDF2 import PdfReader

# Load the small English model from Spacy
nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(file_path):
    """
    Helper function to open a PDF and read all text from it.
    """
    with open(file_path, "rb") as f:
        reader = PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_email(text):
    """
    Uses Regular Expressions (Regex) to find an email address.
    """
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None

def extract_skills(text):
    """
    Uses Spacy to find skills. 
    Note: In a real startup, we train a custom model. 
    For a college project, we match against a predefined list of keywords.
    """
    doc = nlp(text)
    
    # A list of technical skills to look for
    # You can add more skills to this list!
    skills_db = [
        "Python", "Java", "C++", "SQL", "React", "FastAPI", 
        "JavaScript", "HTML", "CSS", "Machine Learning", 
        "Data Analysis", "Communication", "Leadership", "Git"
    ]
    
    found_skills = []
    
    # Simple keyword matching based on tokens
    # (We convert everything to lowercase to make it case-insensitive)
    for token in doc:
        if token.text in skills_db and token.text not in found_skills:
            found_skills.append(token.text)
            
    return found_skills