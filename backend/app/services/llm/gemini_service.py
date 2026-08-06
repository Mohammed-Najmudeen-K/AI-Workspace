from google import genai

from app.core.config import settings

client = genai.Client(api_key=settings.GOOGLE_API_KEY)


class GeminiService:

    def build_prompt(self, prompt: str) -> str:
        return f"""
You are a helpful assistant.

User:
{prompt}
"""

    def build_rag_prompt(
        self,
        question: str,
        context: list[str],
    ):
        joined = "\n\n".join(context)

        if context:
            return f"""
You are a helpful AI assistant.

Use the provided context when it is relevant.
If the answer is not present in the context, say that clearly and provide a helpful general answer if possible.

Context:

{joined}

Question:

{question}
"""

        return f"""
You are a helpful AI assistant.

Answer the user's question directly and helpfully.
Do not claim to have retrieved any documents if none were provided.

Question:

{question}
"""

    def generate(self, prompt: str):
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )

        return response.text

    def generate_with_context(
        self,
        question: str,
        context: list[str],
    ):
        prompt = self.build_rag_prompt(
            question,
            context,
        )

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )

        return response.text

    # NEW
    def stream_generate(
        self,
        question: str,
        context_chunks: list[dict],
    ):
        prompt = self.build_rag_prompt(
            question,
            [chunk["text"] for chunk in context_chunks],
        )

        stream = client.models.generate_content_stream(
            model="gemini-3.6-flash",
            contents=prompt,
        )

        for chunk in stream:
            if chunk.text:
                yield chunk.text