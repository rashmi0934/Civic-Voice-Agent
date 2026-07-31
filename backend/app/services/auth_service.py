from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


class AuthService:

    def register(
        self,
        user: UserCreate,
        db: Session
    ):

        existing = db.query(User).filter(
            User.email == user.email
        ).first()

        if existing:

            return {
                "success": False,
                "message": "Email already registered."
            }

        new_user = User(
            name=user.name,
            email=user.email,
            password=hash_password(user.password),
            role=user.role
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "success": True,
            "message": "User registered successfully."
        }

    def login(
        self,
        email: str,
        password: str,
        db: Session
    ):

        user = db.query(User).filter(
            User.email == email
        ).first()

        if not user:

            return {
                "success": False,
                "message": "Invalid email or password."
            }

        if not verify_password(
            password,
            user.password
        ):

            return {
                "success": False,
                "message": "Invalid email or password."
            }

        token = create_access_token(
            {
                "sub": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        )

        return {
            "success": True,
            "access_token": token,
            "token_type": "bearer",
            "role": user.role
        }


auth_service = AuthService()