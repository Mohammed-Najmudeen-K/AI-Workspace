from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.database import Base
from app.models.document import Document
from app.services.document_service import DocumentService


engine = create_engine("sqlite:///:memory:")
TestingSessionLocal = sessionmaker(bind=engine)


def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    return TestingSessionLocal()


class StubEmbeddingService:
    def generate(self, text: str) -> list[float]:
        return [0.0]


class StubChromaService:
    def add_chunk(self, document_id: int, chunk_id: int, text: str, embedding: list[float]) -> None:
        return None

    def delete_document(self, document_id: int) -> None:
        return None


def test_delete_all_documents_removes_database_rows_and_files(tmp_path):
    db = setup_test_db()
    service = DocumentService(
        db,
        embedding_service=StubEmbeddingService(),
        chroma_service=StubChromaService(),
    )

    first_file = tmp_path / "first.txt"
    second_file = tmp_path / "second.txt"
    first_file.write_text("hello")
    second_file.write_text("world")

    service.repository.create(filename="first.txt", filepath=str(first_file))
    service.repository.create(filename="second.txt", filepath=str(second_file))

    assert db.query(Document).count() == 2
    assert first_file.exists()
    assert second_file.exists()

    deleted_count = service.delete_all_documents()

    assert deleted_count == 2
    assert db.query(Document).count() == 0
    assert not first_file.exists()
    assert not second_file.exists()
