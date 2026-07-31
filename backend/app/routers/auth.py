from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserCreate
from app.services.auth_service import auth_service

router = APIRouter()


@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return auth_service.register(user, db)


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    return auth_service.login(
        form_data.username,   # username field contains email
        form_data.password,
        db
    )