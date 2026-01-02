# 🚀 AI-Powered Job Matcher & Resume Parser

An intelligent recruitment platform that uses **Artificial Intelligence (NLP & ML)** to parse resumes, match candidates to jobs, predict salaries, and prepare users for interviews.

![Project Screenshot] 
<img width="932" height="837" alt="Screenshot 2026-01-02 155237" src="https://github.com/user-attachments/assets/a79f2a11-78d6-426c-aeb3-4dce3ec7501f" />
<img width="908" height="847" alt="Screenshot 2026-01-02 155320" src="https://github.com/user-attachments/assets/601a7f72-1736-4224-9199-62a048c9fc96" />


---

## 🌟 Key Features

### 1. 📄 AI Resume Parsing (NLP)
- Extracts emails, skills, and text from PDF resumes automatically.
- Built using **Python & NLTK/Spacy**.

### 2. 🎯 Smart Job Matching Engine
- Ranks available jobs based on skill intersection.
- Shows a **"Match Percentage"** (e.g., 85% Match) to help users prioritize applications.

### 3. 💰 AI Salary Predictor (Machine Learning)
- Uses **Linear Regression (Scikit-Learn)** to estimate salary ranges based on job experience requirements.
- Provides real-time estimates (e.g., "₹8.5 - 12.0 LPA").

### 4. 🤖 AI Interview Prep
- Generates custom **technical interview questions** based on the specific skills found in the user's resume (e.g., Python, React, SQL questions).

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Python, FastAPI, Uvicorn
- **Database:** SQLite (SQLAlchemy ORM)
- **AI/ML:** Scikit-Learn (Salary Prediction), NLP (Parsing)

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js & npm installed
- Python 3.8+ installed

### 1. Clone the Repository
```bash
git clone <[(https://github.com/mohitverma174/AI-Job-Searching-Portal)>
cd AI_Job_Portal


## Setup Backend

cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python seed_db.py  # (Optional) Populates DB with dummy jobs
python -m uvicorn app.main:app --reload
The backend runs on http://localhost:8000


3. Setup Frontend
Open a new terminal:



cd frontend
npm install
npm run dev

The frontend runs on http://localhost:5173

👤 Author
Mohit Verma
