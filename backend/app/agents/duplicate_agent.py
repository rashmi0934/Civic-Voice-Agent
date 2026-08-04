from app.agents.base_agent import BaseAgent
from app.core.agent_response import AgentResponse

class DuplicateAgent(BaseAgent):

    def __init__(self):

        super().__init__("DuplicateAgent")

    def build_prompt(self, input_data: dict):

        new_complaint = input_data["new_complaint"]

        existing_complaints = input_data["existing_complaints"]

        if not existing_complaints:
            existing_text = "NO EXISTING COMPLAINTS IN DATABASE."
        else:
            existing_text = "\n".join(

            f"Database ID: {complaint['id']}\n"
            f"Complaint: {complaint['text']}\n"

            for complaint in existing_complaints

        )


        return f"""
    You are an AI system that detects duplicate civic complaints.

    Determine whether the NEW COMPLAINT describes the
    same underlying civic problem as any EXISTING COMPLAINT.

    A complaint is a duplicate only when the core issue
    is substantially the same.

    Consider:

    1. The underlying problem
    2. The affected infrastructure or service
    3. The location
    4. The specific cause or issue

    A complaint is NOT a duplicate merely because:

    - It belongs to the same category
    - It is in the same city
    - It concerns the same type of infrastructure
    - It has similar words

    For example:

    Existing:
    "There is a water pipeline leaking in Sector 15."

    New:
    "The water pipeline is still leaking near Sector 15."

    These are duplicates.

    However:

    Existing:
    "There is no water supply in Sector 15."

    New:
    "There is a broken water pipeline in Sector 22."

    These are NOT duplicates because the locations and
    underlying problems are different.

    Return ONLY valid JSON.

    Required format:

    {{
        "is_duplicate": false,
        "duplicate_index": null,
        "confidence": 0.0,
        "reason": ""
    }}

    Rules:

    - is_duplicate must be true or false.
    - duplicate_index must contain the DATABASE ID of the matching complaint.
    - If there is no duplicate, duplicate_index must be null.
    - confidence must be between 0 and 1.
    - reason must briefly explain the decision.

    NEW COMPLAINT:

    {new_complaint}

    EXISTING COMPLAINTS:

    {existing_text}
    """

    def run(self, input_data: dict):

        existing_complaints = input_data["existing_complaints"]

        if len(existing_complaints) == 0:

            return AgentResponse(
                success=True,
                agent=self.name,
                data={
                    "is_duplicate": False,
                    "duplicate_index": None,
                    "confidence": 0.0,
                    "reason": "No existing complaints."
                },
                error=None
            )

        return self.execute(input_data)


duplicate_agent = DuplicateAgent()