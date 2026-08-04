from app.agents.base_agent import BaseAgent


class TranscriptionCorrectionAgent(
    BaseAgent
):

    def __init__(self):

        super().__init__(

            "TranscriptionCorrectionAgent"

        )


    def build_prompt(

        self,

        input_data

    ):

        transcribed_text = (

            input_data["transcribed_text"]

        )


        return f"""

You are an expert multilingual speech transcription correction agent.

A speech-to-text model has converted a citizen's voice complaint into text.

The complaint may be in:

- English
- Hindi
- Hinglish
- Urdu
- Punjabi

or other languages
Your job is ONLY to correct transcription mistakes.

The transcription may contain words that sound similar to the
correct words.

Your task is to correct ONLY obvious speech recognition mistakes.

IMPORTANT RULES:

1. Preserve the original meaning exactly.

2. Do not add new information.

3. Do not remove important information.

4. Correct words based on the surrounding context.

5. Keep locations, numbers, names, and factual details unchanged
unless they are clearly a speech recognition error.

6. Return ONLY valid JSON.

7. Do not include markdown.

8. Do not include explanations.

IMPORTANT:

If the transcription is in Urdu script but the language is Hindi,
convert it to standard Hindi written in Devanagari.

If the input is Hinglish,
keep it in simple English letters.

Never return Urdu script unless the speaker was actually speaking Urdu.

Return this exact JSON format:

{{
    "corrected_text":
    "corrected complaint text"
}}

Original transcription:

{transcribed_text}

"""

    def run(

        self,

        transcribed_text: str

    ):
        # print("Transcription agent output: ")
        # print(transcribed_text)
        return self.execute({

            "transcribed_text":

            transcribed_text

        })


transcription_correction_agent = (

    TranscriptionCorrectionAgent()

)