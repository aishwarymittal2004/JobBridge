import uuid
from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel


class ResumeOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    file_url: str
    original_filename: Optional[str]
    extracted_data: Optional[Dict[str, Any]]
    uploaded_at: datetime

    class Config:
        from_attributes = True
