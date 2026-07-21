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
    def validate_complaint(
        self,
        complaint_text: str
    ):

        result = validation_agent.run(
            complaint_text
        )

        print("\nValidation Agent Output")

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

        print("\nProcessing Agent Output")

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

        complaint_list = [

            complaint.original_text

            for complaint in complaints

        ]

        result = duplicate_agent.run({

            "new_complaint": complaint_text,

            "existing_complaints":
            complaint_list

        })

        print("\nDuplicate Agent Output")

        print(result)

        return result

    # -----------------------------
    # Save Complaint
    # -----------------------------
    
    def save_complaint(
    self,
    processed_data: dict,
    complaint_text: str,
    db: Session,
    is_duplicate: str = "No",
    duplicate_of: int | None = None
):

        complaint = Complaint(

            original_text=complaint_text,

            category=processed_data["category"],

            urgency=processed_data["urgency"],

            location=processed_data["location"],

            affected_people=processed_data["affected_people"],

            requested_action=processed_data["action_requested"],

            summary=processed_data["summary"],

            duplicate=is_duplicate,

            duplicate_of=duplicate_of

        )

        db.add(complaint)

        db.commit()

        db.refresh(complaint)

        return complaint

    # -----------------------------
    # Main Pipeline
    # -----------------------------
    def submit_complaint(
        self,
        complaint_text: str
    ):

        db = self.get_db()

        try:

            # =============================
            # STEP 1: VALIDATION
            # =============================
            start = time.time()

            validation = self.validate_complaint(

                complaint_text

            )
            print(
                f"Validation took "
                f"{time.time() - start:.2f} seconds"
            )
            
            if not validation.success:

                return validation.to_dict()

            validation_data = validation.data

            if not validation_data.get(
                "valid",
                False
            ):

                return {

                    "success": False,

                    "message":
                    "Invalid complaint",

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

                return processed.to_dict()

            processed_data = processed.data

            # =============================
            # STEP 3: DUPLICATE DETECTION
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

                return duplicate.to_dict()

            duplicate_data = duplicate.data

            is_duplicate = "No"
            duplicate_of = None

            if duplicate_data.get(
                "is_duplicate",
                False
            ):
                is_duplicate = "Yes"
                duplicate_of = duplicate_data.get(
                    "duplicate_index"
                )

            # =============================
            # STEP 4: SAVE COMPLAINT
            # =============================

            complaint = self.save_complaint(
                processed_data=processed_data,
                complaint_text=complaint_text,
                db=db,
                is_duplicate=is_duplicate,
                duplicate_of=duplicate_of

            )

            # =============================
            # FINAL RESPONSE
            # =============================

            return {

            "success": True,

            "complaint_id": complaint.id,

            "is_duplicate": is_duplicate == "Yes",

            "duplicate_of": duplicate_of,

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