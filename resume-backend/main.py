from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
from services.skill_analyzer import analyze_skills

app = FastAPI()

# ==============================
# CORS CONFIGURATION (VERY IMPORTANT)
# ==============================

origins = [
    "http://localhost:3000",  # local development
    "https://resume-gap-analyzer-qgpsb65pm-saurabhs-projects-73c2d3be.vercel.app",  # your deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# ROOT ROUTE (Health Check)
# ==============================

@app.get("/")
def root():
    return {"message": "Resume Gap Analyzer Backend is Live 🚀"}


# ==============================
# PDF ANALYSIS ROUTE
# ==============================

@app.post("/analyze-pdf")
async def analyze_pdf(
    file: UploadFile = File(...),
    jd: str = Form(...)
):
    # Extract text from uploaded PDF
    text = ""
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    # Analyze skills
    result = analyze_skills(text, jd)

    return result
