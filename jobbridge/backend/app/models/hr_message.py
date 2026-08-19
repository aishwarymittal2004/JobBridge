import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class HRMessage(Base):
    __tablename__ = "hr_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hr_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    hr = relationship("User", foreign_keys=[hr_id], back_populates="messages_sent")
    candidate = relationship("User", foreign_keys=[candidate_id], back_populates="messages_received")
