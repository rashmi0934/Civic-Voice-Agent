import { useEffect, useState } from "react";

import {
    getDashboardSummary,
    getAllComplaints,
    filterComplaints,
    updateComplaintStatus
} from "../services/api";


function DashboardPage() {

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

            <div className="dashboard-header">

                <h1>
                    Civic Voice Dashboard
                </h1>


                <button

                    onClick={loadDashboard}

                    className="refresh-button"

                >

                    Refresh Dashboard

                </button>

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