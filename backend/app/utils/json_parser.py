import json
import re


class JSONParser:

    @staticmethod
    def extract_json(text: str):

        text = text.replace(
            "```json",
            ""
        )

        text = text.replace(
            "```",
            ""
        )

        text = text.strip()


        matches = re.findall(

            r"\{(?:[^{}]|(?:\{[^{}]*\}))*\}",

            text,

            re.DOTALL

        )


        if not matches:

            raise ValueError(

                "No JSON object found."

            )


        return matches[-1]


    @staticmethod
    def parse(text: str):

        try:

            json_text = (

                JSONParser.extract_json(

                    text

                )

            )


            data = json.loads(

                json_text

            )


            return {

                "success": True,

                "data": data,

                "error": None

            }


        except Exception as e:

            return {

                "success": False,

                "data": None,

                "error": str(e)

            }


    @staticmethod
    def pretty(data):

        print(

            json.dumps(

                data,

                indent=4,

                ensure_ascii=False

            )

        )