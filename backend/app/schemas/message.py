from datetime import datetime

from pydantic import BaseModel


class MessageCreate(BaseModel):
    conversation_id: int
    message: str


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True