from sqlalchemy.orm import Session

from app.models.document import Document


class DocumentRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        filename: str,
        filepath: str,
    ):
        doc = Document(
            filename=filename,
            filepath=filepath,
        )

        self.db.add(doc)

        self.db.commit()

        self.db.refresh(doc)

        return doc

    def get_all(self):
        return self.db.query(Document).all()

    def delete(self, document_id: int):
        doc = (
            self.db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if doc:
            self.db.delete(doc)
            self.db.commit()

            return True

        return False

    def get_by_id(self, document_id: int):
        return (
            self.db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )    