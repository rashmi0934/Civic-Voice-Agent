from pydantic import BaseModel


class ComplaintCreate(BaseModel):

    original_text: str


class ComplaintResponse(BaseModel):

    id: int

    original_text: str

    language: str

    complaint_type: str

    category: str

    urgency: str

    location: str

    affected_people: str | None

    requested_action: str | None

    summary: str | None

    duplicate: str

    duplicate_of: int | None

    class Config:
        from_attributes = True