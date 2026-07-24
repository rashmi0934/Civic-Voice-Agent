from fastapi import APIRouter, HTTPException, UploadFile, File

import os
import tempfile

from app.services.speech_service import speech_service

from datetime import datetime
from app.managers.agent_manager import agent_manager

from app.schemas.complaint import ComplaintCreate, ComplaintResponse, ComplaintStatusUpdate
from app.core.database import SessionLocal
from app.models.complaint import Complaint


router = APIRouter()


@router.post("/")
def submit_complaint(
    complaint: ComplaintCreate
):

    result = agent_manager.submit_complaint(

        complaint.complaint_text

    )

    return result

@router.post("/voice")
async def submit_voice_complaint(

    audio: UploadFile = File(...)

):

    temporary_file_path = None


    try:

        file_extension = (

            os.path.splitext(

                audio.filename

            )[1]

        )


        with tempfile.NamedTemporaryFile(

            delete=False,

            suffix=file_extension

        ) as temporary_file:


            temporary_file_path = (

                temporary_file.name

            )


            contents = await audio.read()


            temporary_file.write(

                contents

            )


        # -----------------------------
        # Speech-to-text
        # -----------------------------

        transcription = (

            speech_service.transcribe(

                temporary_file_path

            )

        )


        transcribed_text = (

            transcription["text"]

        )


        detected_language = (

            transcription["language"]

        )


        if not transcribed_text.strip():

            raise HTTPException(

                status_code=400,

                detail="Could not understand the audio."

            )


        # -----------------------------
        # Existing AI pipeline
        # -----------------------------

        result = (

            agent_manager.submit_complaint(

                transcribed_text

            )

        )


        # Add transcription information

        result["transcribed_text"] = (

            transcribed_text

        )


        result["language"] = (

            detected_language

        )


        return result


    finally:

        if (

            temporary_file_path

            and

            os.path.exists(

                temporary_file_path

            )

        ):

            os.remove(

                temporary_file_path

            )
        

@router.get(
    "/",
    response_model=list[ComplaintResponse]
)
def get_all_complaints():

    db = SessionLocal()

    try:

        complaints = db.query(
            Complaint
        ).order_by(

            Complaint.created_at.desc()

        ).all()

        return complaints

    finally:

        db.close()

@router.get(
    "/filter"
)
def filter_complaints(

    status: str | None = None,

    category: str | None = None,

    urgency: str | None = None

):

    db = SessionLocal()

    try:

        query = db.query(
            Complaint
        )


        if status is not None:

            query = query.filter(

                Complaint.status == status

            )


        if category is not None:

            query = query.filter(

                Complaint.category == category

            )


        if urgency is not None:

            query = query.filter(

                Complaint.urgency == urgency

            )


        complaints = query.order_by(

            Complaint.created_at.desc()

        ).all()


        return complaints


    finally:

        db.close()

@router.get(
    "/{complaint_id}",
    response_model=ComplaintResponse
)
def get_complaint(
    complaint_id: int
):

    db = SessionLocal()

    try:

        complaint = db.query(
            Complaint
        ).filter(

            Complaint.id == complaint_id

        ).first()

        if complaint is None:

            raise HTTPException(

                status_code=404,

                detail="Complaint not found"

            )

        return complaint

    finally:

        db.close()


@router.patch(
    "/{complaint_id}/status"
)
def update_complaint_status(

    complaint_id: int,

    status_update: ComplaintStatusUpdate

):

    db = SessionLocal()

    try:

        complaint = db.query(

            Complaint

        ).filter(

            Complaint.id == complaint_id

        ).first()


        if complaint is None:

            raise HTTPException(

                status_code=404,

                detail="Complaint not found"

            )


        allowed_statuses = [

            "Pending",

            "In Progress",

            "Resolved",

            "Rejected"

        ]


        if status_update.status not in allowed_statuses:

            raise HTTPException(

                status_code=400,

                detail="Invalid status"

            )


        complaint.status = status_update.status
        if status_update.status == "Resolved":
            complaint.resolved_at = datetime.now()

        db.commit()
        db.refresh(complaint)


        return {

            "success": True,

            "complaint_id": complaint.id,

            "status": complaint.status

        }


    finally:

        db.close()