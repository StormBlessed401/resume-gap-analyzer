from fastapi import UploadFile, File, Form # Added Form to handle string inputs in multipart requests
import pdfplumber

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from services.skill_analyzer import analyze_skills

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- Request Model ---------
# Defines the structure of incoming JSON data
class TextInput(BaseModel):
    resume: str
    jd: str

# --------- API Endpoint ---------
# Receives request and forwards it to the ML service
@app.post("/analyze")
def analyze(data: TextInput):
    return analyze_skills(data.resume, data.jd)

@app.post("/analyze-pdf")
async def analyze_pdf(file: UploadFile = File(...), jd: str = Form("")): # Changed to Form for multipart support

    # Read PDF file
    with pdfplumber.open(file.file) as pdf:
        resume_text = ""
        for page in pdf.pages:
            resume_text += page.extract_text() or ""
    
    # Moved inside the function scope so resume_text is accessible
    print("Extracted resume text length:", len(resume_text))

    # Use existing ML logic
    result = analyze_skills(resume_text, jd)

    return result