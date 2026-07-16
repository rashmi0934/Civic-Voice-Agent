from sqlalchemy.orm import Session

from models import Complaint


def create_complaint(db: Session, text: str):

    complaint = Complaint(
        original_text=text
    )

    db.add(complaint)

    db.commit()

    db.refresh(complaint)

    return complaint


def get_all_complaints(db: Session):

    return db.query(Complaint).all()