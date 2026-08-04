from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.complaint import Complaint

from app.agents.validation_agent import validation_agent
from app.agents.processing_agent import processing_agent
from app.agents.duplicate_agent import duplicate_agent

import time


class AgentManager:

    # -----------------------------
    # Database
    # -----------------------------

    def get_db(self) -> Session:

        return SessionLocal()


    # -----------------------------
    # Validation
    # -----------------------------

    def validate_complaint(self, complaint_text: str):

        result = validation_agent.run(complaint_text)

        print(

            "\nValidation Agent Output"

        )

        print(result)

        return result


    # -----------------------------
    # Processing
    # -----------------------------

    def process_complaint(

        self,

        complaint_text: str

    ):

        result = processing_agent.run(

            complaint_text

        )

        print(

            "\nProcessing Agent Output"

        )

        print(result)

        return result


    # -----------------------------
    # Duplicate Detection
    # -----------------------------

    def detect_duplicate(

        self,

        complaint_text: str,

        db: Session

    ):

        complaints = db.query(

            Complaint

        ).all()


        existing_complaints = [

            {

                "id": complaint.id,

                "text": complaint.original_text

            }

            for complaint in complaints

        ]


        result = duplicate_agent.run({

            "new_complaint": complaint_text,

            "existing_complaints":

            existing_complaints

        })


        print(

            "\nDuplicate Agent Output"

        )

        print(result)

        return result


    # -----------------------------
    # Save Complaint
    # -----------------------------

    def save_complaint(

        self,

        processed_data: dict,

        complaint_text: str,

        db: Session

    ):

        complaint = Complaint(

            original_text=complaint_text,

            category=processed_data["category"],

            urgency=processed_data["urgency"],

            location=processed_data["location"],

            affected_people=processed_data["affected_people"],

            requested_action=

            processed_data["action_requested"],

            summary=processed_data["summary"],

            duplicate="No",

            duplicate_of=None

        )


        db.add(complaint)

        db.commit()

        db.refresh(complaint)


        return complaint


    # -----------------------------
    # Main Pipeline
    # -----------------------------

    def submit_complaint(self, complaint_text: str):
        # =============================
        print("Complaint text: ")
        print(complaint_text)
        # =============================
        
        db = self.get_db()

        try:

            # =============================
            # STEP 1: VALIDATION
            # =============================

            start = time.time()

            validation = self.validate_complaint(complaint_text)

            print(

                f"Validation took "

                f"{time.time() - start:.2f} seconds"

            )


            if not validation.success:

                return {

                    "success": False,

                    "message":

                    "Unable to validate the complaint.",

                    "error":

                    validation.error

                }


            validation_data = validation.data


            if not validation_data.get(

                "valid",

                False

            ):

                return {

                    "success": False,

                    "message":

                    "This is not a valid civic complaint.",

                    "reason":

                    validation_data.get(

                        "reason",

                        ""

                    )

                }


            # =============================
            # STEP 2: PROCESSING
            # =============================

            start = time.time()


            processed = self.process_complaint(

                complaint_text

            )


            print(

                f"Processing took "

                f"{time.time() - start:.2f} seconds"

            )


            if not processed.success:

                return {

                    "success": False,

                    "message":

                    "Unable to process the complaint.",

                    "error":

                    processed.error

                }


            processed_data = processed.data

            # =============================
            # LOCATION CHECK
            # =============================

            location = str(
                processed_data.get("location", "")
            ).strip().lower()

            invalid_locations = [
                "",
                "unknown",
                "not provided",
                "not specified",
                "none",
                "null",
                "my area",
                "our area",
                "this area",
                "local area",
                "area",
                "nearby",
                "here",
                "there"
            ]

            if location in invalid_locations:

                return {

                    "success": False,

                    "message":
                    "Complaint not submitted.",

                    "missing_fields": [
                        "location"
                    ],

                    "reason":
                    "Please provide a specific location (e.g., Sector 12, MG Road, Village Rampur)."

                }


            # # =============================
            # # STEP 3: REQUIRED FIELD CHECK
            # # =============================

            # required_fields = {

            #     "category":

            #     "category",

            #     "urgency":

            #     "urgency",

            #     "location":

            #     "location",

            #     "affected_people":

            #     "affected people",

            #     "action_requested":

            #     "requested action"

            # }


            # missing_fields = []


            # for field, display_name in (

            #     required_fields.items()

            # ):

            #     value = processed_data.get(

            #         field

            #     )

            #     invalid_values = [
            #         "unknown",
            #         "not provided",
            #         "not specified",
            #         "none",
            #         "null",
            #         "my area",
            #         "area",
            #         "nearby",
            #         "here",
            #         "there",
            #         "our area",
            #         "my area",
            #         "this area",
            #         "local area"
            #     ]


            #     if (

            #         value is None

            #         or

            #         str(value).strip() == ""

            #         or

            #         str(value).lower().strip() in invalid_values

            #     ):

            #         missing_fields.append(display_name)


            # if missing_fields:

            #     return {

            #         "success": False,

            #         "message":

            #         "Complaint not submitted.",

            #         "missing_fields":

            #         missing_fields,

            #         "reason":

            #         f"Missing required information: {', '.join(missing_fields)}"
            #     }


            # =============================
            # STEP 4: DUPLICATE DETECTION
            # =============================

            start = time.time()


            duplicate = self.detect_duplicate(

                complaint_text,

                db

            )


            print(

                f"Duplicate detection took "

                f"{time.time() - start:.2f} seconds"

            )


            if not duplicate.success:

                return {

                    "success": False,

                    "message":

                    "Unable to check for duplicate complaints.",

                    "error":

                    duplicate.error

                }


            duplicate_data = duplicate.data


            if duplicate_data.get(

                "is_duplicate",

                False

            ):

                return {

                    "success": False,

                    "message":

                    "This complaint already exists.",

                    "is_duplicate":

                    True,

                    "duplicate_of":

                    duplicate_data.get(

                        "duplicate_index"

                    ),

                    "confidence":

                    duplicate_data.get(

                        "confidence"

                    ),

                    "reason":

                    duplicate_data.get(

                        "reason",

                        ""

                    )

                }


            # =============================
            # STEP 5: SAVE ONLY VALID,

            # NON-DUPLICATE COMPLAINTS

            # =============================

            complaint = self.save_complaint(

                processed_data=processed_data,

                complaint_text=complaint_text,

                db=db

            )


            # =============================
            # FINAL RESPONSE

            # =============================

            return {

                "success": True,

                "complaint_id": complaint.id,

                "is_duplicate": False,

                "duplicate_of": None,

                "analysis": processed_data

            }


        except Exception as e:

            return {

                "success": False,

                "error": str(e)

            }


        finally:

            db.close()


agent_manager = AgentManager()