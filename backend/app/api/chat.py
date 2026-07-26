from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["AI Chat"])


@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    service = ChatService(db)

    if request.conversation_id is None:
        conversation = service.conversation_repository.create("New Conversation")
        request.conversation_id = conversation.id

    reply = service.send_message(request.conversation_id, request.message)

    return ChatResponse(response=reply)