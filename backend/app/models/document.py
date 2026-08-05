from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from app.database.database import Base


class Document(Base):

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)

    filename = Column(String, nullable=False)

    filepath = Column(String, nullable=False)

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow,
    )