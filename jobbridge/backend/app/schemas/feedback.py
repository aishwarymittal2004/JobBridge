import uuid
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel


FeedbackStatusLiteral = Literal[
    "applied", "got_response", "interview_scheduled", "rejected", "no_response", "custom"
]


class FeedbackIn(BaseModel):
    career_link_id: uuid.UUID
    status: FeedbackStatusLiteral
    comment: Optional[str] = None


class FeedbackOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    career_link_id: uuid.UUID
    status: FeedbackStatusLiteral
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
