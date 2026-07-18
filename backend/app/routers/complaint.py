from fastapi import APIRouter
from pydantic import BaseModel

from app.managers.agent_manager import agent_manager


router = APIRouter()


class ComplaintRequest(BaseModel):
    complaint: str


@router.post("/")
def submit_complaint(request: ComplaintRequest):

    return agent_manager.submit_complaint(
        request.complaint
    )