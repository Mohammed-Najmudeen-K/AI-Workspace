from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import ForeignKey

from app.database.database import Base


class DocumentChunk(Base):

    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True)

    document_id = Column(
        Integer,
        ForeignKey("documents.id"),
    )

    chunk_text = Column(Text)