from fastapi import APIRouter

from app.core.database import SessionLocal

from app.services.dashboard_service import dashboard_service


router = APIRouter()


@router.get("/summary")
def get_dashboard_summary():

    db = SessionLocal()

    try:

        result = dashboard_service.get_dashboard_summary(db)

        return {

            "success": True,

            "data": result

        }

    finally:

        db.close()