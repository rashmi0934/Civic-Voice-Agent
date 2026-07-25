from app.services.llm_service import LLMService
from app.utils.json_parser import JSONParser
from app.core.agent_response import AgentResponse


class BaseAgent:

    def __init__(self, name: str):

        self.name = name

        self.llm_service = LLMService()


    def build_prompt(self, input_data):

        raise NotImplementedError(

            "Child agent must implement build_prompt()"

        )


    def execute(self, input_data):

        try:

            prompt = self.build_prompt(

                input_data

            )


            raw_response = self.llm_service.generate(prompt)


            parsed_result = JSONParser.parse(raw_response)


            # JSONParser returns:
            #
            # {
            #     "success": True,
            #     "data": {...},
            #     "error": None
            # }
            #
            # We only want the actual data here.


            if not parsed_result["success"]:

                return AgentResponse(

                    success=False,

                    agent=self.name,

                    data=None,

                    error=parsed_result["error"]

                )


            return AgentResponse(

                success=True,

                agent=self.name,

                data=parsed_result["data"],

                error=None

            )


        except Exception as e:

            return AgentResponse(

                success=False,

                agent=self.name,

                data=None,

                error=str(e)

            )