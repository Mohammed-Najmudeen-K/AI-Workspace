from uuid import UUID

from sqlalchemy.orm import Session

from app.models.conversation import Conversation
from app.models.user import User


class ConversationRepository:

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

    def create(self, title: str | None = None) -> Conversation:
        existing_user = self.db.query(User).filter(User.id == 1).first()
        if existing_user is None:
            existing_user = User(
                id=1,
                name="Default User",
                email="default@example.com",
                password="unused",
            )
            self.db.add(existing_user)
            self.db.flush()

        conversation = Conversation(
            title=title or "New Conversation",
            user_id=existing_user.id,
        )
        self.db.add(conversation)
        self.db.commit()
        self.db.refresh(conversation)
        return conversation

    def get_by_id(self, conversation_id):
        conversation_id = self._coerce_id(conversation_id)

        # Debug prints can be helpful during development
        print("Searching conversation:", conversation_id)

        conversation = (
            self.db.query(Conversation)
            .filter(Conversation.id == conversation_id)
            .first()
        )

        print("Found:", conversation)

        return conversation

    def get_all(self):
        return self.db.query(Conversation).order_by(Conversation.created_at.desc()).all()

    def update_title(self, conversation_id, title: str):
        conversation = self.get_by_id(conversation_id)
        if conversation is None:
            return None

        conversation.title = title
        self.db.commit()
        self.db.refresh(conversation)
        return conversation

    def delete(self, conversation_id):
        conversation = self.get_by_id(conversation_id)
        if conversation is None:
            return False

        self.db.delete(conversation)
        self.db.commit()
        return True
    
    def update_title(self, conversation_id: int, title: str):
        conversation = self.get_by_id(conversation_id)

        if conversation is None:
            return None

        conversation.title = title

        self.db.commit()
        self.db.refresh(conversation)

        return conversation