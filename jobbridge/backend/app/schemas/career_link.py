import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CareerLinkOut(BaseModel):
    id: uuid.UUID
    company_name: str
    career_url: str
    role: str
    source: Optional[str]
    posted_date: Optional[str]
    created_at: datetime
    applied_count: int = 0
    callback_count: int = 0
    interview_count: int = 0
    response_rate: float = 0.0

    class Config:
        from_attributes = True
