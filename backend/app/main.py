from fastapi import FastAPI

from app.core.database import engine, Base
from app.routers.complaint import router as complaint_router

app = FastAPI(
    title="Civic Voice Agent"
)

Base.metadata.create_all(bind=engine)

app.include_router(
    complaint_router,
    prefix="/complaints",
    tags=["Complaints"]
)

@app.get("/")
def home():
    return {
        "message": "Civic Voice Agent Backend Running"
    }