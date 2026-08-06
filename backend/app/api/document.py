from fastapi import APIRouter
from fastapi import Depends
from fastapi import File
from fastapi import UploadFile
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.document import DocumentResponse
from app.services.document_service import DocumentService

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post(
    "/upload",
    response_model=DocumentResponse,
    summary="Upload a document",
    description="Uploads a document file and stores it for retrieval in the knowledge base.",
)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    service = DocumentService(db)

    return service.save_document(file)


@router.get(
    "",
    response_model=list[DocumentResponse],
    summary="List documents",
    description="Returns all uploaded documents available in the knowledge base.",
)
def list_documents(
    db: Session = Depends(get_db),
):
    service = DocumentService(db)

    return service.list_documents()


@router.delete("/{document_id}", summary="Delete a document", description="Removes a document from the knowledge base by id.")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
):
    service = DocumentService(db)

    deleted = service.delete_document(document_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return {"message": "Document deleted"}


@router.delete("", summary="Delete all documents", description="Removes every uploaded document and its indexed chunks from the knowledge base.")
def delete_all_documents(db: Session = Depends(get_db)):
    service = DocumentService(db)
    deleted_count = service.delete_all_documents()

    return {"message": "Documents deleted", "deleted_count": deleted_count}