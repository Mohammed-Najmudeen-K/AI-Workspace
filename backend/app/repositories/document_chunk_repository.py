from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk


class DocumentChunkRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        document_id,
        chunk_text,
    ):

        chunk = DocumentChunk(
            document_id=document_id,
            chunk_text=chunk_text,
        )

        self.db.add(chunk)

        self.db.commit()

        self.db.refresh(chunk)

        return chunk