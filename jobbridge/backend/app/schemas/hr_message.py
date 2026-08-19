import uuid
from datetime import datetime
from pydantic import BaseModel, Field


class HRMessageIn(BaseModel):
    candidate_id: uuid.UUID
    message: str = Field(min_length=1, max_length=500)


class HRMessageOut(BaseModel):
    id: uuid.UUID
    hr_id: uuid.UUID
    candidate_id: uuid.UUID
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
