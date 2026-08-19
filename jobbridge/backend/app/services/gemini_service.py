"""
Resume analysis via Google Gemini.

If GEMINI_API_KEY is not configured, falls back to a lightweight local
heuristic extractor so the rest of the pipeline (career search, feed,
feedback) keeps working end to end in local/dev environments.
"""
import json
import re
from typing import Any, Dict

from app.core.config import settings

try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover
    genai = None

RESUME_EXTRACTION_PROMPT = """You are a resume parser. Read the resume text below and return ONLY
valid JSON (no markdown fences, no commentary) with this exact shape:

{{
  "skills": ["string", ...],
  "technologies": ["string", ...],
  "experience": [{{"title": "string", "company": "string", "duration": "string"}}],
  "education": [{{"degree": "string", "institution": "string", "year": "string"}}],
  "total_experience_years": number,
  "suggested_roles": ["string", ...]
}}

Resume text:
---
{resume_text}
---
"""


def _configure():
    if genai and settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        return True
    return False


def _fallback_extract(resume_text: str) -> Dict[str, Any]:
    """Very rough keyword-based extraction used when no Gemini key is set."""
    skill_bank = [
        "python", "java", "javascript", "typescript", "react", "node", "fastapi",
        "django", "flask", "sql", "postgresql", "mongodb", "aws", "docker",
        "kubernetes", "git", "redux", "tailwind", "c++", "c#", "machine learning",
        "data structures", "algorithms", "html", "css", "rest api", "graphql",
    ]
    text_lower = resume_text.lower()
    found_skills = sorted({s for s in skill_bank if s in text_lower})
    years_match = re.search(r"(\d+)\+?\s+years?", text_lower)
    total_years = int(years_match.group(1)) if years_match else 0

    return {
        "skills": found_skills,
        "technologies": found_skills,
        "experience": [],
        "education": [],
        "total_experience_years": total_years,
        "suggested_roles": found_skills[:3] if found_skills else ["Software Engineer"],
    }


def extract_resume_data(resume_text: str) -> Dict[str, Any]:
    if not _configure():
        return _fallback_extract(resume_text)

    try:
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        response = model.generate_content(
            RESUME_EXTRACTION_PROMPT.format(resume_text=resume_text[:15000])
        )
        raw = response.text.strip()
        raw = re.sub(r"^```json|^```|```$", "", raw, flags=re.MULTILINE).strip()
        data = json.loads(raw)
        return data
    except Exception:
        # Gemini call failed or returned non-JSON — degrade gracefully
        return _fallback_extract(resume_text)
