from datetime import datetime
from pydantic import BaseModel
from app.schemas.message import MessageResponse


class ConversationCreate(BaseModel):
    title: str | None = "New Conversation"


class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    messages: list[MessageResponse] = []

    class Config:
        from_attributes = True