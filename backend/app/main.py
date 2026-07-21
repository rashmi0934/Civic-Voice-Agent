from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base
from app.routers.complaint import router as complaint_router

from app.routers.dashboard import router as dashboard_router

app = FastAPI(
    title="Civic Voice Agent"
)

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5173",

        "http://localhost:5174",

        "http://127.0.0.1:5173",

        "http://127.0.0.1:5174"

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

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