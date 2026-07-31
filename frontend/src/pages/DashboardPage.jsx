import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getDashboardSummary,
    getAllComplaints,
    filterComplaints,
    updateComplaintStatus
} from "../services/api";


function DashboardPage() {
    const navigate = useNavigate();

    const [showProfile, setShowProfile] = useState(false);

    const token = localStorage.getItem("token");

    let user = {
        name: "",
        email: "",
        role: "leader"
    };

    if (token) {
        try {
            user = JSON.parse(atob(token.split(".")[1]));
        } catch (e) {}
    }

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const [dashboard, setDashboard] =
        useState(null);

    const [complaints, setComplaints] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [statusFilter, setStatusFilter] =
        useState("");

    const [categoryFilter, setCategoryFilter] =
        useState("");

    const [urgencyFilter, setUrgencyFilter] =
        useState("");


    const loadDashboard = async () => {

        try {

            setLoading(true);

            setError("");


            const summary =
                await getDashboardSummary();


            const allComplaints =
                await getAllComplaints();


            setDashboard(summary.data);

            setComplaints(allComplaints);


        } catch (error) {

            console.error(error);

            setError(
                "Unable to load dashboard."
            );


        } finally {

            setLoading(false);

        }

    };


    const applyFilters = async () => {

        try {

            setError("");


            const result =
                await filterComplaints(

                    statusFilter,

                    categoryFilter,

                    urgencyFilter

                );


            setComplaints(result);


        } catch (error) {

            console.error(error);

            setError(
                "Unable to filter complaints."
            );

        }

    };


    const clearFilters = async () => {

        setStatusFilter("");

        setCategoryFilter("");

        setUrgencyFilter("");


        try {

            const result =
                await getAllComplaints();


            setComplaints(result);


        } catch (error) {

            console.error(error);

            setError(
                "Unable to load complaints."
            );

        }

    };

    const handleStatusChange = async (complaintId,newStatus
    ) => {

        try {

            await updateComplaintStatus(

                complaintId,

                newStatus

            );


            // Reload complaints after update

            const updatedComplaints =
                await getAllComplaints();


            setComplaints(
                updatedComplaints
            );


            // Reload dashboard summary

            const updatedSummary =
                await getDashboardSummary();


            setDashboard(
                updatedSummary.data
            );


        } catch (error) {

            console.error(error);

            setError(
                "Unable to update complaint status."
            );

        }

    };


    useEffect(() => {

        loadDashboard();

    }, []);


    if (loading) {

        return (

            <div className="dashboard-page">

                <h1>
                    Civic Voice Dashboard
                </h1>

                <p>
                    Loading dashboard...
                </p>

            </div>

        );

    }


    if (error && !dashboard) {

        return (

            <div className="dashboard-page">

                <h1>
                    Civic Voice Dashboard
                </h1>

                <p>
                    {error}
                </p>


                <button
                    onClick={loadDashboard}
                >

                    Try Again

                </button>

            </div>

        );

    }


    if (!dashboard) {

        return (

            <div className="dashboard-page">

                <p>
                    No dashboard data available.
                </p>

            </div>

        );

    }


    return (

        <div className="dashboard-page">


            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <div
                className="dashboard-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px"
                }}
            >

                <div>

                    <h1>
                        Civic Voice Dashboard
                    </h1>

                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        position: "relative"
                    }}
                >

                    <button
                        onClick={loadDashboard}
                        className="refresh-button"
                    >
                        Refresh Dashboard
                    </button>

                    <div
                        onClick={() => setShowProfile(!showProfile)}
                        style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "50%",
                            background: "#2563eb",
                            color: "white",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            fontSize: "22px",
                            fontWeight: "bold"
                        }}
                    >
                        👤
                    </div>

                    {showProfile && (

                        <div
                            style={{
                                position: "absolute",
                                top: "60px",
                                right: 0,
                                width: "280px",
                                background: "#fff",
                                borderRadius: "12px",
                                padding: "18px",
                                border: "1px solid #ddd",
                                boxShadow: "0 10px 30px rgba(0,0,0,.2)",
                                zIndex: 1000
                            }}
                        >

                            <div
                                style={{
                                    textAlign: "center"
                                }}
                            >

                                <div
                                    style={{
                                        width: "65px",
                                        height: "65px",
                                        margin: "0 auto 12px",
                                        borderRadius: "50%",
                                        background: "#2563eb",
                                        color: "#fff",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: "30px"
                                    }}
                                >
                                    👤
                                </div>

                                <h3>{user.name}</h3>

                                <p
                                    style={{
                                        color: "#666",
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {user.email}
                                </p>

                                <span
                                    style={{
                                        display: "inline-block",
                                        background: "#e3f2fd",
                                        color: "#1565c0",
                                        padding: "5px 12px",
                                        borderRadius: "20px"
                                    }}
                                >
                                    {user.role}
                                </span>

                            </div>

                            <button
                                onClick={logout}
                                style={{
                                    width: "100%",
                                    marginTop: "20px",
                                    padding: "10px",
                                    background: "#ef4444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer"
                                }}
                            >
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>


            {/* ========================= */}
            {/* SUMMARY */}
            {/* ========================= */}

            <section className="summary-section">

                <h2>
                    Complaint Summary
                </h2>


                <div className="summary-card total-card">

                    <h3>
                        Total Complaints
                    </h3>


                    <p className="large-number">

                        {
                            dashboard.total_complaints
                        }

                    </p>

                </div>


                <div className="summary-grid">


                    {/* CATEGORY */}

                    <div className="summary-box">

                        <h3>
                            By Category
                        </h3>


                        {Object.entries(

                            dashboard.by_category

                        ).map(

                            ([category, count]) => (

                                <div

                                    className="summary-row"

                                    key={category}

                                >

                                    <span>
                                        {category}
                                    </span>


                                    <strong>
                                        {count}
                                    </strong>

                                </div>

                            )

                        )}

                    </div>


                    {/* URGENCY */}

                    <div className="summary-box">

                        <h3>
                            By Urgency
                        </h3>


                        {Object.entries(

                            dashboard.by_urgency

                        ).map(

                            ([urgency, count]) => (

                                <div

                                    className="summary-row"

                                    key={urgency}

                                >

                                    <span>
                                        {urgency}
                                    </span>


                                    <strong>
                                        {count}
                                    </strong>

                                </div>

                            )

                        )}

                    </div>


                    {/* STATUS */}

                    <div className="summary-box">

                        <h3>
                            By Status
                        </h3>


                        {Object.entries(

                            dashboard.by_status

                        ).map(

                            ([status, count]) => (

                                <div

                                    className="summary-row"

                                    key={status}

                                >

                                    <span>
                                        {status}
                                    </span>


                                    <strong>
                                        {count}
                                    </strong>

                                </div>

                            )

                        )}

                    </div>


                    {/* LOCATION */}

                    <div className="summary-box">

                        <h3>
                            By Location
                        </h3>


                        {dashboard.by_location.map(

                            (location) => (

                                <div

                                    className="summary-row"

                                    key={
                                        location.location
                                    }

                                >

                                    <span>
                                        {
                                            location.location
                                        }
                                    </span>


                                    <strong>
                                        {
                                            location.count
                                        }
                                    </strong>

                                </div>

                            )

                        )}

                    </div>

                </div>

            </section>


            {/* ========================= */}
            {/* COMPLAINTS TABLE */}
            {/* ========================= */}

            <section className="complaints-section">

                <h2>
                    All Complaints
                </h2>


                {/* FILTERS */}

                <div className="filters">


                    <select

                        value={statusFilter}

                        onChange={(event) =>

                            setStatusFilter(

                                event.target.value

                            )

                        }

                    >

                        <option value="">

                            All Statuses

                        </option>


                        <option value="Pending">

                            Pending

                        </option>


                        <option value="In Progress">

                            In Progress

                        </option>


                        <option value="Resolved">

                            Resolved

                        </option>


                        <option value="Rejected">

                            Rejected

                        </option>

                    </select>


                    <select

                        value={categoryFilter}

                        onChange={(event) =>

                            setCategoryFilter(

                                event.target.value

                            )

                        }

                    >

                        <option value="">

                            All Categories

                        </option>


                        <option value="Water">

                            Water

                        </option>


                        <option value="Electricity">

                            Electricity

                        </option>


                        <option value="Roads">

                            Roads

                        </option>


                        <option value="Sanitation">

                            Sanitation

                        </option>


                        <option value="Education">

                            Education

                        </option>


                        <option value="Healthcare">

                            Healthcare

                        </option>


                        <option value="Safety">

                            Safety

                        </option>


                        <option value="Other">

                            Other

                        </option>

                    </select>


                    <select

                        value={urgencyFilter}

                        onChange={(event) =>

                            setUrgencyFilter(

                                event.target.value

                            )

                        }

                    >

                        <option value="">

                            All Urgencies

                        </option>


                        <option value="Critical">

                            Critical

                        </option>


                        <option value="High">

                            High

                        </option>


                        <option value="Medium">

                            Medium

                        </option>


                        <option value="Low">

                            Low

                        </option>

                    </select>


                    <button

                        onClick={applyFilters}

                    >

                        Apply Filters

                    </button>


                    <button

                        onClick={clearFilters}

                    >

                        Clear Filters

                    </button>

                </div>


                {error && (

                    <p>
                        {error}
                    </p>

                )}


                {complaints.length === 0 ? (

                    <p>
                        No complaints found.
                    </p>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Urgency
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Location
                                    </th>

                                    <th>
                                        Registered On
                                    </th>

                                    <th>
                                        Resolved On
                                    </th>

                                    <th>
                                        Affected People
                                    </th>

                                    <th>
                                        Action Requested
                                    </th>

                                    <th>
                                        Summary
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {complaints.map(

                                    (complaint) => (

                                        <tr

                                            key={
                                                complaint.id
                                            }

                                        >

                                            <td>
                                                {
                                                    complaint.id
                                                }
                                            </td>


                                            <td>
                                                {
                                                    complaint.category
                                                }
                                            </td>


                                            <td>
                                                {
                                                    complaint.urgency
                                                }
                                            </td>

                                        
                                            <td>
                                                <select

                                                    value={
                                                        complaint.status
                                                    }

                                                    onChange={(event) =>

                                                        handleStatusChange(

                                                            complaint.id,

                                                            event.target.value

                                                        )

                                                    }

                                                >

                                                    <option value="Pending">

                                                        Pending

                                                    </option>


                                                    <option value="In Progress">

                                                        In Progress

                                                    </option>


                                                    <option value="Resolved">

                                                        Resolved

                                                    </option>


                                                    <option value="Rejected">

                                                        Rejected

                                                    </option>

                                                </select>
                                            </td>


                                            <td>
                                                {
                                                    complaint.location
                                                }
                                            </td>


                                            <td>

                                                {

                                                    complaint
                                                        .created_at

                                                        ?

                                                    new Date(

                                                        complaint
                                                            .created_at

                                                    ).toLocaleString()

                                                        :

                                                    "Not available"

                                                }

                                            </td>


                                            <td>

                                                {

                                                    complaint
                                                        .resolved_at

                                                        ?

                                                    new Date(

                                                        complaint
                                                            .resolved_at

                                                    ).toLocaleString()

                                                        :

                                                    "Not resolved"

                                                }

                                            </td>


                                            <td>
                                                {
                                                    complaint
                                                        .affected_people
                                                }
                                            </td>


                                            <td>
                                                {
                                                    complaint
                                                        .requested_action
                                                }
                                            </td>


                                            <td>
                                                {
                                                    complaint.summary
                                                }
                                            </td>

                                        </tr>

                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>

    );

}


export default DashboardPage;