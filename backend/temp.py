from app.services.llm.embedding_service import EmbeddingService
from app.services.vector.chroma_service import ChromaService

embedding = EmbeddingService().generate(
    "What is FastAPI?"
)

results = ChromaService().search(embedding)

print(results)