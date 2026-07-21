from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.complaint import Complaint


class DashboardService:

    # ---------------------------------
    # Total number of complaints
    # ---------------------------------
    def get_total_complaints(
        self,
        db: Session
    ):

        total = db.query(
            func.count(Complaint.id)
        ).scalar()

        return total

    # ---------------------------------
    # Complaints grouped by category
    # ---------------------------------
    def get_complaints_by_category(
        self,
        db: Session
    ):

        results = db.query(

            Complaint.category,

            func.count(
                Complaint.id
            ).label("count")

        ).group_by(

            Complaint.category

        ).all()

        return {

            category: count

            for category, count

            in results

        }

    # ---------------------------------
    # Complaints grouped by urgency
    # ---------------------------------
    def get_complaints_by_urgency(
        self,
        db: Session
    ):

        results = db.query(

            Complaint.urgency,

            func.count(
                Complaint.id
            ).label("count")

        ).group_by(

            Complaint.urgency

        ).all()

        return {

            urgency: count

            for urgency, count

            in results

        }

    # ---------------------------------
    # Complaints grouped by location
    # ---------------------------------
    def get_complaints_by_location(
        self,
        db: Session
    ):

        results = db.query(

            Complaint.location,

            func.count(
                Complaint.id
            ).label("count")

        ).group_by(

            Complaint.location

        ).order_by(

            func.count(
                Complaint.id
            ).desc()

        ).all()

        return [

            {

                "location": location,

                "count": count

            }

            for location, count

            in results

        ]

    # ---------------------------------
    # Critical and high urgency issues
    # ---------------------------------
    def get_priority_complaints(
        self,
        db: Session
    ):

        complaints = db.query(

            Complaint

        ).filter(

            Complaint.urgency.in_(
                ["Critical", "High"]
            )

        ).order_by(

            Complaint.created_at.desc()

        ).all()

        return complaints

    # ---------------------------------
    # Complaints grouped by status
    # ---------------------------------
    def get_complaints_by_status(
        self,
        db: Session
    ):

        results = db.query(

            Complaint.status,

            func.count(
                Complaint.id
            ).label("count")

        ).group_by(

            Complaint.status

        ).all()

        return {

            status: count

            for status, count

            in results

        }


    # ---------------------------------
    # Complete dashboard summary
    # ---------------------------------
    def get_dashboard_summary(self,db: Session):
        return {

            "total_complaints":
            self.get_total_complaints(db),

            "by_category":
            self.get_complaints_by_category(db),

            "by_urgency":
            self.get_complaints_by_urgency(db),

            "by_status":
            self.get_complaints_by_status(db),

            "by_location":
            self.get_complaints_by_location(db),

            "priority_complaints": [

                self.complaint_to_dict(
                    complaint
                )

                for complaint
                in self.get_priority_complaints(db)

            ]

        }
    
    def complaint_to_dict(self,complaint: Complaint):

        return {

            "id": complaint.id,

            "original_text":
            complaint.original_text,

            "category":
            complaint.category,

            "urgency":
            complaint.urgency,

            "status":
            complaint.status,

            "location":
            complaint.location,

            "affected_people":
            complaint.affected_people,

            "requested_action":
            complaint.requested_action,

            "summary":
            complaint.summary,

            "duplicate":
            complaint.duplicate,

            "duplicate_of":
            complaint.duplicate_of,

            "created_at":
            str(complaint.created_at)

        }


dashboard_service = DashboardService()