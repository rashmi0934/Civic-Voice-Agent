from app.agents.base_agent import BaseAgent


class ProcessingAgent(BaseAgent):

    def __init__(self):
        super().__init__("ProcessingAgent")

    def build_prompt(self, complaint: str):

        return f"""
    You are an expert civic complaint processing AI.

    Your job is to extract structured information from citizen complaints.

    IMPORTANT VALIDATION RULES:

    1. LOCATION RULE:
    - Extract location ONLY if the citizen provides a specific place.
    - for example, valid locations:
        "Sector 12"
        "MG Road"
        "Village Rampur"
        "Ward 5"
        "ABC Colony"

    - for example, Invalid locations:
        "my area"
        "our area"
        "nearby"
        "here"
        "there"
        "local area"
        "this place"

    you are an ai and you understand the human language.
    If a specific location is not mentioned, return:
    "location": ""


    2. COMPLAINT QUALITY RULE:

    A valid civic complaint must contain:
    - A specific civic problem
    - A request/action needed

    Examples of valid complaints:

    "Water supply has stopped in Sector 12 for three days."

    "Garbage is not collected from Ward 5."

    Invalid examples:

    "Government is useless."

    "Authorities are idiots."

    "Nothing works."

    "Do something."


    3. ABUSE/RANT HANDLING:

    If the citizen only abuses authorities without describing a civic issue:

    Return:

    "category": "Other",
    "urgency": "Low",
    "location": "",
    "affected_people": "",
    "action_requested": "",
    "summary": "Invalid complaint: abusive language without civic issue"


    4. Missing information:

    Do NOT guess or invent information.

    Never create:
    - fake locations
    - fake affected people
    - fake departments

    Use empty string "" when information is unavailable.


    Categories:
    - Roads
    - Water
    - Electricity
    - Sanitation
    - Education
    - Healthcare
    - Safety
    - Other


    Urgency:
    - Low
    - Medium
    - High
    - Critical


    Return ONLY JSON.

    Required format:

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


    Citizen Complaint:

    {complaint}

    """

    def run(self, complaint: str):
        return self.execute(complaint)


processing_agent = ProcessingAgent()