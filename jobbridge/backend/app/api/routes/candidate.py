import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.api.deps import require_candidate
from app.core.config import settings
from app.models.user import User
from app.models.resume import Resume
from app.models.job_preference import JobPreference
from app.models.career_link import CareerLink
from app.models.feedback import Feedback
from app.models.hr_message import HRMessage
from app.schemas.resume import ResumeOut
from app.schemas.job_preference import JobPreferenceIn, JobPreferenceOut
from app.schemas.career_link import CareerLinkOut
from app.schemas.feedback import FeedbackIn, FeedbackOut
from app.schemas.hr_message import HRMessageOut
from app.schemas.user import UserOut
from app.services.resume_parser import extract_text_from_file
from app.services.gemini_service import extract_resume_data
from app.services.career_search_service import search_career_pages

router = APIRouter(prefix="/api/candidate", tags=["candidate"])

ALLOWED_EXTENSIONS = {".pdf", ".docx"}


@router.get("/me", response_model=UserOut)
def get_profile(user: User = Depends(require_candidate)):
    return user


@router.post("/resume", response_model=ResumeOut, status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(require_candidate),
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX resumes are supported")

    content = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(status_code=400, detail=f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    stored_name = f"{uuid.uuid4()}{ext}"
    stored_path = os.path.join(settings.UPLOAD_DIR, stored_name)
    with open(stored_path, "wb") as f:
        f.write(content)

    resume_text = extract_text_from_file(file.filename, content)
    extracted = extract_resume_data(resume_text)

    resume = Resume(
        user_id=user.id,
        file_url=stored_path,
        original_filename=file.filename,
        extracted_data=extracted,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("/resume", response_model=Optional[ResumeOut])
def get_latest_resume(db: Session = Depends(get_db), user: User = Depends(require_candidate)):
    return (
        db.query(Resume)
        .filter(Resume.user_id == user.id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )


@router.get("/resume/file")
def download_own_resume(db: Session = Depends(get_db), user: User = Depends(require_candidate)):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user.id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )
    if not resume or not os.path.exists(resume.file_url):
        raise HTTPException(status_code=404, detail="Resume file not found")
    return FileResponse(resume.file_url, filename=resume.original_filename or "resume")


@router.put("/job-preference", response_model=JobPreferenceOut)
def set_job_preference(
    payload: JobPreferenceIn,
    db: Session = Depends(get_db),
    user: User = Depends(require_candidate),
):
    pref = db.query(JobPreference).filter(JobPreference.user_id == user.id).first()
    if pref:
        pref.job_role = payload.job_role
    else:
        pref = JobPreference(user_id=user.id, job_role=payload.job_role)
        db.add(pref)
    db.commit()
    db.refresh(pref)
    return pref


@router.get("/career-feed", response_model=List[CareerLinkOut])
def get_career_feed(
    q: Optional[str] = Query(None, description="Free-text search over company/role"),
    db: Session = Depends(get_db),
    user: User = Depends(require_candidate),
):
    pref = db.query(JobPreference).filter(JobPreference.user_id == user.id).first()
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user.id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )

    job_role = pref.job_role if pref else "Software Engineer"
    skills = (resume.extracted_data or {}).get("skills", []) if resume else []

    # Check how many real (non-fallback) jobs we have for this role
    existing = db.query(CareerLink).filter(
        CareerLink.role == job_role,
        CareerLink.source != "curated"
    ).count()
    
    if existing < 5:
        fresh = search_career_pages(job_role, skills, limit=10)
        for item in fresh:
            already = (
                db.query(CareerLink)
                .filter(CareerLink.career_url == item["career_url"], CareerLink.role == job_role)
                .first()
            )
            if not already:
                db.add(
                    CareerLink(
                        company_name=item["company_name"],
                        career_url=item["career_url"],
                        role=job_role,
                        source=item.get("source"),
                    )
                )
        db.commit()

    query = db.query(CareerLink).filter(
        CareerLink.role == job_role,
        CareerLink.source != "curated"
    )
    if q:
        like = f"%{q}%"
        query = query.filter(CareerLink.company_name.ilike(like))
    links = query.order_by(CareerLink.created_at.desc()).all()

    results = []
    for link in links:
        applied = sum(1 for f in link.feedbacks if f.status.value == "applied")
        callback = sum(1 for f in link.feedbacks if f.status.value == "got_response")
        interview = sum(1 for f in link.feedbacks if f.status.value == "interview_scheduled")
        total = len(link.feedbacks) or 1
        response_rate = round((callback + interview) / total * 100, 1)
        out = CareerLinkOut.model_validate(link)
        out.applied_count = applied
        out.callback_count = callback
        out.interview_count = interview
        out.response_rate = response_rate
        results.append(out)
    return results


@router.post("/feedback", response_model=FeedbackOut, status_code=201)
def add_feedback(payload: FeedbackIn, db: Session = Depends(get_db), user: User = Depends(require_candidate)):
    link = db.query(CareerLink).filter(CareerLink.id == payload.career_link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Career link not found")
    feedback = Feedback(
        user_id=user.id,
        career_link_id=payload.career_link_id,
        status=payload.status,
        comment=payload.comment,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


@router.get("/feedback/{career_link_id}", response_model=List[FeedbackOut])
def list_feedback_for_link(
    career_link_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(require_candidate)
):
    return (
        db.query(Feedback)
        .filter(Feedback.career_link_id == career_link_id)
        .order_by(Feedback.created_at.desc())
        .all()
    )


@router.get("/messages", response_model=List[HRMessageOut])
def get_hr_messages(db: Session = Depends(get_db), user: User = Depends(require_candidate)):
    return (
        db.query(HRMessage)
        .filter(HRMessage.candidate_id == user.id)
        .order_by(HRMessage.created_at.desc())
        .all()
    )
