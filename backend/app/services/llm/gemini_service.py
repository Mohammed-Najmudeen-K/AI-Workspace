from google import genai
from google.genai.errors import ClientError

from app.core.config import settings


client = genai.Client(
    api_key=settings.GOOGLE_API_KEY
)


class GeminiService:

    def build_prompt(self, prompt: str) -> str:
        return f"You are a helpful assistant.\n\nUser: {prompt}"

    def generate(self, prompt: str):
        try:
            response = client.models.generate_content(
                model="gemini-3.5-flash",
                contents=self.build_prompt(prompt),
            )
            return response.text
        except Exception:
            return "I’m sorry, I couldn’t reach the AI service right now."