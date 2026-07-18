from app.agents.base_agent import BaseAgent


class DuplicateAgent(BaseAgent):

    def __init__(self):

        super().__init__("DuplicateAgent")

    def build_prompt(self, input_data: dict):

        new_complaint = input_data["new_complaint"]

        existing_complaints = input_data[
            "existing_complaints"
        ]

        existing_text = "\n".join(

            f"{index + 1}. {complaint}"

            for index, complaint
            in enumerate(existing_complaints)

        )

        return f"""
You are an AI system that detects duplicate civic complaints.

Your task is to determine whether the NEW COMPLAINT
describes the same underlying civic problem as any
of the EXISTING COMPLAINTS.

Consider complaints duplicates when they refer to:

- The same problem
- In the same or nearby location
- Affecting the same issue or infrastructure

Examples of duplicates:

Complaint 1:
"There is a broken water pipeline in Sector 15."

Complaint 2:
"Water is leaking from the pipeline near Sector 15."

These are likely duplicates.

Do NOT mark complaints as duplicates only because
they belong to the same category.

Return ONLY valid JSON.

Required format:

{{
    "is_duplicate": false,
    "duplicate_index": null,
    "confidence": 0.0,
    "reason": ""
}}

Rules:

1. "is_duplicate" must be true or false.

2. "duplicate_index" must contain the number of the
   matching existing complaint if a duplicate exists.

3. If there is no duplicate, use null.

4. "confidence" must be a number between 0 and 1.

5. "reason" must briefly explain your decision.

NEW COMPLAINT:

{new_complaint}

EXISTING COMPLAINTS:

{existing_text}
"""

    def run(self, input_data: dict):

        return self.execute(input_data)


duplicate_agent = DuplicateAgent()