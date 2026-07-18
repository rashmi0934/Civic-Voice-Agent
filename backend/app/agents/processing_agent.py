from app.agents.base_agent import BaseAgent


class ProcessingAgent(BaseAgent):

    def __init__(self):
        super().__init__("ProcessingAgent")

    def build_prompt(self, complaint: str):

        return f"""
You are an expert civic complaint analysis AI.

Analyze the citizen complaint and return ONLY valid JSON.

Categories (choose exactly one):
- Roads
- Water
- Electricity
- Sanitation
- Education
- Healthcare
- Safety
- Other

Urgency (choose exactly one):
- Low
- Medium
- High
- Critical

Return JSON in this exact format:

{{
    "category": "",
    "urgency": "",
    "location": "",
    "affected_people": "",
    "action_requested": "",
    "summary": "",
    "keywords": [],
    "sentiment": ""
}}

Complaint:

{complaint}
"""

    def run(self, complaint: str):
        return self.execute(complaint)


processing_agent = ProcessingAgent()