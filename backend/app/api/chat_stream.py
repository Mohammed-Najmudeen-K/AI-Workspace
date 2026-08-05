from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.chat import ChatRequest
from app.services.chat_service import ChatService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("/stream")
async def stream_chat(
    request: Request,
    chat_request: ChatRequest,
    db: Session = Depends(get_db),
):
    service = ChatService(db)

    async def event_generator():
        for chunk in service.stream_send_message(
            chat_request.conversation_id,
            chat_request.message,
        ):
            if await request.is_disconnected():
                break
            yield chunk

    return StreamingResponse(
        event_generator(),
        media_type="text/plain",
    )