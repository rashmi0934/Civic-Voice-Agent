from openai import OpenAI
import time


class LLMService:
    """
    Singleton service for communicating with OpenRouter.

    Features:
    - Automatic retry
    - Timeout
    - Better error handling
    """

    def __init__(
        self,
        api_key: str,
        model: str = "deepseek/deepseek-chat-v3-0324",
        base_url: str = "https://openrouter.ai/api/v1"
    ):

        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url,
            timeout=60
        )

        self.model = model

    def generate(
        self,
        prompt: str,
        temperature: float = 0.2,
        max_retries: int = 3
    ):

        last_error = None

        for attempt in range(max_retries):

            try:

                response = self.client.chat.completions.create(

                    model=self.model,

                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],

                    temperature=temperature,

                    extra_headers={
                        "HTTP-Referer": "http://localhost:5173",
                        "X-Title": "Civic Voice Agent"
                    }

                )

                return response.choices[0].message.content

            except Exception as e:

                last_error = e

                error_text = str(e)

                print(
                    f"\nOpenRouter attempt "
                    f"{attempt + 1}/{max_retries} failed."
                )

                print(error_text)

                # Retry only for temporary provider errors
                if (
                    "429" in error_text or
                    "503" in error_text or
                    "rate-limited" in error_text.lower() or
                    "too busy" in error_text.lower()
                ):

                    if attempt < max_retries - 1:

                        wait_time = 2 * (attempt + 1)

                        print(
                            f"Provider busy. Retrying in {wait_time} seconds..."
                        )

                        time.sleep(wait_time)

                        continue

            # Don't retry permanent errors (400, invalid request, etc.)

        raise Exception(
            f"OpenRouter Error after {max_retries} attempts:\n{last_error}"
        )

    def set_model(
        self,
        model_name: str
    ):

        self.model = model_name

    def get_model(self):

        return self.model

    def health_check(self):

        try:

            return {
                "success": True,
                "model": self.model
            }

        except Exception as e:

            return {
                "success": False,
                "error": str(e)
            }


# ------------------------------
# Singleton Instance
# ------------------------------

from app.core.config import settings

llm_service = LLMService(
    api_key=settings.OPENROUTER_API_KEY,
    model=settings.OPENROUTER_MODEL
)