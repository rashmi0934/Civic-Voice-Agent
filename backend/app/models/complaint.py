from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.core.database import Base


class Complaint(Base):

    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    original_text = Column(Text)

    language = Column(String(50), default="Unknown")

    complaint_type = Column(String(50), default="Unknown")

    category = Column(String(100), default="Pending")

    urgency = Column(String(50), default="Pending")

    status = Column(String(50),default="Pending")
    
    location = Column(String(255), default="Unknown")

    affected_people = Column(Text)

    requested_action = Column(Text)

    summary = Column(Text)

    duplicate = Column(String(20), default="No")

    duplicate_of = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True),server_default=func.now())

    resolved_at = Column(DateTime(timezone=True),nullable=True)