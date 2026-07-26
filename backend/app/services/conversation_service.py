from app.repositories.conversation_repository import ConversationRepository


class ConversationService:

    def __init__(self, db):
        self.repository = ConversationRepository(db)

    def create_conversation(self, title: str | None = None):
        return self.repository.create(title)

    def get_conversation(self, conversation_id):
        conversation = self.repository.get_by_id(conversation_id)
        if conversation is None:
            raise ValueError("Conversation not found")
        return conversation

    def list_conversations(self):
        return self.repository.get_all()

    def rename_conversation(self, conversation_id, title: str):
        conversation = self.repository.update_title(conversation_id, title)
        if conversation is None:
            raise ValueError("Conversation not found")
        return conversation

    def delete_conversation(self, conversation_id):
        deleted = self.repository.delete(conversation_id)
        if not deleted:
            raise ValueError("Conversation not found")
        return True