import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class FeedbackStatus(str, enum.Enum):
    applied = "applied"
    got_response = "got_response"
    interview_scheduled = "interview_scheduled"
    rejected = "rejected"
    no_response = "no_response"
    custom = "custom"


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    career_link_id = Column(UUID(as_uuid=True), ForeignKey("career_links.id"), nullable=False)
    status = Column(Enum(FeedbackStatus), nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="feedbacks")
    career_link = relationship("CareerLink", back_populates="feedbacks")
