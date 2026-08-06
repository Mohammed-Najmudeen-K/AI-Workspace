import os

from app.repositories.document_repository import DocumentRepository
from app.utils.document_parser import DocumentParser
from app.utils.text_chunker import TextChunker
from app.services.llm.embedding_service import EmbeddingService
from app.services.vector.chroma_service import ChromaService


class DocumentService:

    def __init__(self, db, embedding_service=None, chroma_service=None):
        self.repository = DocumentRepository(db)
        self.embedding_service = embedding_service or EmbeddingService()
        self.chroma_service = chroma_service or ChromaService()

    def save_document(self, file):
        upload_dir = "app/uploads"

        os.makedirs(upload_dir, exist_ok=True)

        filepath = os.path.join(upload_dir, file.filename)

        with open(filepath, "wb") as buffer:
            buffer.write(file.file.read())

        document = self.repository.create(
            filename=file.filename,
            filepath=filepath,
        )

        # -----------------------------
        # Extract text
        # -----------------------------
        text = DocumentParser.extract_text(filepath)

        # -----------------------------
        # Split into chunks
        # -----------------------------
        chunks = TextChunker.chunk(text)

        # -----------------------------
        # Save chunks into ChromaDB
        # -----------------------------
        for index, chunk in enumerate(chunks):

            embedding = self.embedding_service.generate(chunk)

            self.chroma_service.add_chunk(
                document_id=document.id,
                chunk_id=index,
                text=chunk,
                embedding=embedding,
            )

        return document

    def list_documents(self):
        return self.repository.get_all()

    def delete_document(self, document_id: int):
        document = self.repository.get_by_id(document_id)

        if not document:
            return False

        if os.path.exists(document.filepath):
            os.remove(document.filepath)

        self.chroma_service.delete_document(document_id)
        return self.repository.delete(document_id)

    def delete_all_documents(self):
        documents = self.repository.get_all()

        for document in documents:
            if os.path.exists(document.filepath):
                os.remove(document.filepath)

            self.chroma_service.delete_document(document.id)

        return self.repository.delete_all()