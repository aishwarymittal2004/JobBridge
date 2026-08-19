import uuid
from pydantic import BaseModel, Field


class JobPreferenceIn(BaseModel):
    job_role: str = Field(min_length=2, max_length=150)


class JobPreferenceOut(JobPreferenceIn):
    id: uuid.UUID

    class Config:
        from_attributes = True
