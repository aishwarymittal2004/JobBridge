import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class CareerLink(Base):
    __tablename__ = "career_links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name = Column(String(255), nullable=False)
    career_url = Column(String(1000), nullable=False)
    role = Column(String(150), nullable=False)
    source = Column(String(255), nullable=True)
    posted_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    feedbacks = relationship("Feedback", back_populates="career_link", cascade="all, delete-orphan")
