from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_complaints():
    return {
        "message": "Complaints endpoint working"
    }