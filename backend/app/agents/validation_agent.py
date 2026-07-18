from app.agents.base_agent import BaseAgent


class ValidationAgent(BaseAgent):

    def __init__(self):

        super().__init__("ValidationAgent")

    def build_prompt(self, complaint: str):

        return f"""
You are an AI system that validates citizen complaints.

Determine whether the following text is:

1. Complaint
2. Suggestion
3. Spam
4. Abuse
5. Greeting
6. Irrelevant

Return ONLY valid JSON.

Format:

{{
    "valid": true,
    "type": "Complaint",
    "reason": ""
}}

Complaint:

{complaint}
"""

    def run(self, complaint: str):

        return self.execute(complaint)


validation_agent = ValidationAgent()