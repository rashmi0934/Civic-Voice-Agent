from app.core.database import SessionLocal

from app.services.dashboard_service import dashboard_service


# Create database session
db = SessionLocal()


try:

    # Get complete dashboard summary
    result = dashboard_service.get_dashboard_summary(db)

    print("\n")
    print("=" * 60)
    print("DASHBOARD SUMMARY")
    print("=" * 60)

    # ---------------------------------
    # Total Complaints
    # ---------------------------------

    print("\nTotal Complaints:")

    print(
        result["total_complaints"]
    )


    # ---------------------------------
    # Complaints by Category
    # ---------------------------------

    print("\nComplaints by Category:")

    print(
        result["by_category"]
    )


    # ---------------------------------
    # Complaints by Urgency
    # ---------------------------------

    print("\nComplaints by Urgency:")

    print(
        result["by_urgency"]
    )


    # ---------------------------------
    # Complaints by Status
    # ---------------------------------

    print("\nComplaints by Status:")

    print(
        result["by_status"]
    )


    # ---------------------------------
    # Complaints by Location
    # ---------------------------------

    print("\nComplaints by Location:")

    print(
        result["by_location"]
    )


    # ---------------------------------
    # Priority Complaints
    # ---------------------------------

    print("\nPriority Complaints:")


    for complaint in result[
        "priority_complaints"
    ]:

        print(
            "\n-----------------------------"
        )


        print(
            "ID:",
            complaint["id"]
        )


        print(
            "Category:",
            complaint["category"]
        )


        print(
            "Urgency:",
            complaint["urgency"]
        )


        print(
            "Status:",
            complaint["status"]
        )


        print(
            "Location:",
            complaint["location"]
        )


        print(
            "Summary:",
            complaint["summary"]
        )


        print(
            "Action Requested:",
            complaint["requested_action"]
        )


finally:

    db.close()