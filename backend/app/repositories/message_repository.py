from uuid import UUID

from sqlalchemy.orm import Session

from app.models.message import Message


class MessageRepository:

    def __init__(self, db: Session):
        self.db = db

    def _coerce_id(self, conversation_id):
        if isinstance(conversation_id, UUID):
            return conversation_id.int
        if isinstance(conversation_id, str):
            try:
                return int(conversation_id)
            except ValueError:
                return conversation_id
        return conversation_id

    def create(self, conversation_id, role: str, content: str) -> Message:
        message = Message(
            conversation_id=self._coerce_id(conversation_id),
            role=role,
            content=content,
        )
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def get_by_conversation_id(self, conversation_id):
        conversation_id = self._coerce_id(conversation_id)
        return (
            self.db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .all()
        )