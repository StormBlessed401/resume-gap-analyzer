# ============================================================
# Skill Analyzer Service
# ------------------------------------------------------------
# - Loads skills dynamically from JSON
# - Supports multi-word skills
# - Clean modular architecture
# - Backend-based match scoring
# ============================================================

import json
import os
from typing import Set


# ============================================================
# LOAD SKILLS FROM JSON FILE
# ------------------------------------------------------------
# Why?
# - Makes skill list scalable
# - Easier to maintain
# - Looks professional
# - No hardcoded skills in Python file
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SKILLS_PATH = os.path.join(BASE_DIR, "skills.json")

with open(SKILLS_PATH, "r", encoding="utf-8") as f:
    SKILL_SET = set(json.load(f))


# ============================================================
# FUNCTION: normalize_text
# ------------------------------------------------------------
# Ensures consistent lowercase comparison
# ============================================================

def normalize_text(text: str) -> str:
    return text.lower().strip()


# ============================================================
# FUNCTION: extract_skills
# ------------------------------------------------------------
# Detects skills from SKILL_SET inside text
#
# Handles:
# - Multi-word skills like "machine learning"
# - Case-insensitive detection
#
# Why substring match works:
# Because we are checking full skill phrases,
# not random tokens.
# ============================================================

def extract_skills(text: str) -> Set[str]:

    normalized_text = normalize_text(text)
    found_skills = set()

    for skill in SKILL_SET:
        if skill in normalized_text:
            found_skills.add(skill)

    return found_skills


# ============================================================
# MAIN FUNCTION: analyze_skills
# ------------------------------------------------------------
# 1. Extract skills from resume
# 2. Extract skills from JD
# 3. Compare
# 4. Calculate match score
# ============================================================

def analyze_skills(resume: str, jd: str):

    resume_skills = extract_skills(resume)
    jd_skills = extract_skills(jd)

    matched = resume_skills.intersection(jd_skills)
    missing = jd_skills - resume_skills

    total_required = len(jd_skills)

    match_score = (
        round((len(matched) / total_required) * 100, 2)
        if total_required > 0
        else 0
    )

    return {
        "matched_skills": sorted(list(matched)),
        "missing_skills": sorted(list(missing)),
        "match_score": match_score
    }
