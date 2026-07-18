from ollama import Client


class LLMService:
    """
    Singleton service responsible for communicating with Ollama.
    Every AI Agent uses this service instead of talking to Ollama directly.
    """

    def __init__(
        self,
        host: str = "http://localhost:11434",
        model: str = "qwen3:4b"
    ):

        self.client = Client(host=host)
        self.model = model

    def generate(
        self,
        prompt: str,
        temperature: float = 0.2
    ) -> str:
        """
        Sends a prompt to Ollama and returns the generated text.
        """

        try:

            response = self.client.chat(

                model=self.model,

                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],

                options={
                    "temperature": temperature
                }

            )

            return response["message"]["content"]

        except Exception as e:

            raise Exception(
                f"Ollama Error: {str(e)}"
            )

    def set_model(
        self,
        model_name: str
    ):
        """
        Change model dynamically.
        """

        self.model = model_name

    def get_model(self):

        return self.model

    def health_check(self):
        """
        Check if Ollama is reachable.
        """

        try:

            response = self.client.list()

            return {

                "success": True,

                "models": [
                    model.model
                    for model in response.models
                ]

            }

        except Exception as e:

            return {

                "success": False,

                "error": str(e)

            }


# Singleton instance
llm_service = LLMService()