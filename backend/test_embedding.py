from app.services.llm.embedding_service import EmbeddingService

service = EmbeddingService()

embedding = service.generate(
    "Hello AI Workspace"
)

print(len(embedding))
print(embedding[:5])