from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.services.llm.gemini_service import GeminiService


class ChatService:

    def __init__(self, db, gemini_service=None):
        self.db = db
        self.conversation_repository = ConversationRepository(db)
        self.message_repository = MessageRepository(db)
        self.gemini_service = gemini_service or GeminiService()

    def send_message(self, conversation_id, message: str):
        conversation = self.conversation_repository.get_by_id(conversation_id)
        if conversation is None:
            raise ValueError("Conversation not found")

        self.message_repository.create(conversation_id, "user", message)

        try:
            reply = self.gemini_service.generate(message)
        except Exception as exc:
            reply = "I’m sorry, I couldn’t reach the AI service right now."

        self.message_repository.create(conversation_id, "assistant", reply)
        return reply