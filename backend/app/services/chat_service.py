from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.services.llm.embedding_service import EmbeddingService
from app.services.llm.gemini_service import GeminiService
from app.services.vector.chroma_service import ChromaService
from app.repositories.document_repository import DocumentRepository

class ChatService:

    def __init__(
        self,
        db,
        gemini_service=None,
        embedding_service=None,
        chroma_service=None,
    ):
        self.db = db
        self.conversation_repository = ConversationRepository(db)
        self.message_repository = MessageRepository(db)
        self.gemini_service = gemini_service or GeminiService()
        self.embedding_service = embedding_service or EmbeddingService()
        self.chroma_service = chroma_service or ChromaService()
        self.document_repository = DocumentRepository(db)

    def send_message(self, conversation_id, message: str):
        conversation = self.conversation_repository.get_by_id(conversation_id)

        if conversation is None:
            raise ValueError("Conversation not found")

        if conversation.title in ["New Chat", "New Conversation"]:
            title = message.strip()[:40]
            self.conversation_repository.update_title(
                conversation_id,
                title,
            )

        self.message_repository.create(
            conversation_id,
            "user",
            message,
        )

        try:
            # Create embedding for the user query
            query_embedding = self.embedding_service.generate(message)

            # Search ChromaDB
            context_chunks = self.chroma_service.search_texts(
                query_embedding,
                top_k=5,
            )

            # Generate answer using retrieved context
            reply = self.gemini_service.generate_with_context(
                message,
                context_chunks,
            )

            # Build source list
            sources = set()
            
            for chunk in context_chunks:
                
                document = self.document_repository.get_by_id(
                  chunk["document_id"]
                )

                if document:
                    sources.add(
                        f"{document.filename} "
                        f"(Chunk {chunk['chunk_id']})"
                    )

            if sources:
                reply += "\n\n---\nSources:\n"

                for source in sources:
                    reply += f"- {source}\n"

        except Exception as e:
            print(e)
            raise

        self.message_repository.create(
            conversation_id,
            "assistant",
            reply,
        )

        return reply

    def stream_send_message(
        self,
        conversation_id: int,
        message: str,
    ):
        conversation = self.conversation_repository.get_by_id(
            conversation_id
        )

        if conversation is None:
            yield "Conversation not found"
            return

        if conversation.title in [
            "New Chat",
            "New Conversation",
        ]:
            self.conversation_repository.update_title(
                conversation_id,
                message[:40],
            )

        self.message_repository.create(
            conversation_id,
            "user",
             message,
        )

        query_embedding = self.embedding_service.generate(message)

        context_chunks = self.chroma_service.search_texts(
            query_embedding,
            top_k=5,
        )

        full_reply = ""

        for chunk in self.gemini_service.stream_generate(
            message,
            context_chunks,
        ):
            full_reply += chunk
            yield chunk

        self.message_repository.create(
            conversation_id,
            "assistant",
            full_reply,
        )