from app.services.llm.gemini_service import GeminiService

service = GeminiService()

for chunk in service.stream_generate(
    "Explain FastAPI in one paragraph."
):
    print(chunk, end="", flush=True)