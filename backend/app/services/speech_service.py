from faster_whisper import WhisperModel


class SpeechService:

    def __init__(self):

        self.model = None


    def load_model(self):

        if self.model is None:

            print(
                "Loading speech recognition model..."
            )

            self.model = WhisperModel(

                "base",

                device="cpu",

                compute_type="int8"

            )

            print(

                "Speech recognition model loaded."

            )


    def transcribe(

        self,

        audio_file_path: str

    ):

        self.load_model()


        segments, info = self.model.transcribe(

            audio_file_path,

            beam_size=5,

            vad_filter=True,

            condition_on_previous_text=False

        )


        text_parts = []


        for segment in segments:

            text_parts.append(

                segment.text

            )


        transcribed_text = " ".join(

            text_parts

        ).strip()


        return {

            "text":
            transcribed_text,

            "language":
            info.language

        }


speech_service = SpeechService()