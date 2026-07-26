from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.database import Base
from app.models.conversation import Conversation
from app.models.message import Message
from app.services.chat_service import ChatService
from app.services.conversation_service import ConversationService


engine = create_engine("sqlite:///:memory:")
TestingSessionLocal = sessionmaker(bind=engine)


def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    return TestingSessionLocal()


def test_conversation_ids_are_integer_backed():
    db = setup_test_db()

    conversation_service = ConversationService(db)
    conversation = conversation_service.create_conversation("Integer IDs")

    assert isinstance(conversation.id, int)
    assert db.query(Conversation).count() == 1


def test_conversation_and_chat_flow():
    db = setup_test_db()

    conversation_service = ConversationService(db)
    conversation = conversation_service.create_conversation("Test Chat")

    assert conversation.title == "Test Chat"
    assert db.query(Conversation).count() == 1

    class StubGeminiService:
        def generate(self, prompt: str) -> str:
            return "Hello from Gemini"

    chat_service = ChatService(db, gemini_service=StubGeminiService())
    reply = chat_service.send_message(conversation.id, "Hello")

    assert reply == "Hello from Gemini"
    stored_messages = db.query(Message).filter(Message.conversation_id == conversation.id).all()
    assert len(stored_messages) == 2
    assert any(message.role == "user" and message.content == "Hello" for message in stored_messages)
    assert any(message.role == "assistant" and message.content == "Hello from Gemini" for message in stored_messages)
