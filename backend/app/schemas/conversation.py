from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.message import MessageResponse


class ConversationCreate(BaseModel):
    title: str | None = Field(default="New Conversation", min_length=1, max_length=80)


class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    messages: list[MessageResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True