from fastapi import FastAPI

from app.core.database import engine, Base
from app.routers.complaint import router as complaint_router

from app.routers.dashboard import router as dashboard_router

app = FastAPI(
    title="Civic Voice Agent"
)

Base.metadata.create_all(bind=engine)

app.include_router(
    complaint_router,
    prefix="/complaints",
    tags=["Complaints"]
)

app.include_router(
    dashboard_router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

@app.get("/")
def home():
    return {
        "message": "Civic Voice Agent Backend Running"
    }