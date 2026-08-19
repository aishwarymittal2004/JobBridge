import uuid
from typing import List, Optional
import os
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.session import get_db
from app.api.deps import require_hr
from app.models.user import User, RoleEnum
from app.models.resume import Resume
from app.models.job_preference import JobPreference
from app.models.hr_message import HRMessage
from app.schemas.user import UserOut
from app.schemas.resume import ResumeOut
from app.schemas.hr_message import HRMessageIn, HRMessageOut

router = APIRouter(prefix="/api/hr", tags=["hr"])

MAX_MESSAGES_PER_CANDIDATE = 3


@router.get("/candidates", response_model=List[UserOut])
def list_candidates(
    skill: Optional[str] = None,
    job_role: Optional[str] = None,
    db: Session = Depends(get_db),
    hr_user: User = Depends(require_hr),
):
    query = db.query(User).filter(User.role == RoleEnum.candidate)

    if job_role:
        candidate_ids = (
            db.query(JobPreference.user_id)
            .filter(JobPreference.job_role.ilike(f"%{job_role}%"))
            .subquery()
        )
        query = query.filter(User.id.in_(candidate_ids))

    candidates = query.all()

    if skill:
        skill_lower = skill.lower()
        filtered = []
        for c in candidates:
            resume = (
                db.query(Resume)
                .filter(Resume.user_id == c.id)
                .order_by(Resume.uploaded_at.desc())
                .first()
            )
            skills = (resume.extracted_data or {}).get("skills", []) if resume else []
            if any(skill_lower in s.lower() for s in skills):
                filtered.append(c)
        candidates = filtered

    return candidates


@router.get("/candidates/{candidate_id}", response_model=UserOut)
def get_candidate(candidate_id: uuid.UUID, db: Session = Depends(get_db), hr_user: User = Depends(require_hr)):
    candidate = db.query(User).filter(User.id == candidate_id, User.role == RoleEnum.candidate).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


@router.get("/candidates/{candidate_id}/resume", response_model=Optional[ResumeOut])
def get_candidate_resume(candidate_id: uuid.UUID, db: Session = Depends(get_db), hr_user: User = Depends(require_hr)):
    candidate = db.query(User).filter(User.id == candidate_id, User.role == RoleEnum.candidate).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return (
        db.query(Resume)
        .filter(Resume.user_id == candidate_id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )


@router.get("/candidates/{candidate_id}/resume/file")
def download_candidate_resume(candidate_id: uuid.UUID, db: Session = Depends(get_db), hr_user: User = Depends(require_hr)):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == candidate_id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )
    if not resume or not os.path.exists(resume.file_url):
        raise HTTPException(status_code=404, detail="Resume file not found")
    return FileResponse(resume.file_url, filename=resume.original_filename or "resume")


@router.post("/messages", response_model=HRMessageOut, status_code=201)
def send_message(payload: HRMessageIn, db: Session = Depends(get_db), hr_user: User = Depends(require_hr)):
    candidate = db.query(User).filter(User.id == payload.candidate_id, User.role == RoleEnum.candidate).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    sent_count = (
        db.query(HRMessage)
        .filter(HRMessage.hr_id == hr_user.id, HRMessage.candidate_id == payload.candidate_id)
        .count()
    )
    if sent_count >= MAX_MESSAGES_PER_CANDIDATE:
        raise HTTPException(
            status_code=400,
            detail=f"Message limit reached ({MAX_MESSAGES_PER_CANDIDATE} messages per candidate)",
        )

    message = HRMessage(hr_id=hr_user.id, candidate_id=payload.candidate_id, message=payload.message)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("/messages/{candidate_id}", response_model=List[HRMessageOut])
def get_messages_with_candidate(
    candidate_id: uuid.UUID, db: Session = Depends(get_db), hr_user: User = Depends(require_hr)
):
    return (
        db.query(HRMessage)
        .filter(HRMessage.hr_id == hr_user.id, HRMessage.candidate_id == candidate_id)
        .order_by(HRMessage.created_at.asc())
        .all()
    )
