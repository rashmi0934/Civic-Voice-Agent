import { useState } from "react";

import { submitComplaint } from "../services/api";


function CitizenPage() {

    const [
        complaintText,
        setComplaintText
    ] = useState("");


    const [
        result,
        setResult
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const handleSubmit = async (event) => {

        event.preventDefault();


        if (
            complaintText.trim() === ""
        ) {

            setError(
                "Please enter a complaint."
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            setResult(null);


            const data =
                await submitComplaint(
                    complaintText
                );


            setResult(data);


            setComplaintText("");


        } catch (error) {

            console.error(error);


            setError(
                "Unable to submit complaint. "
                + "Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div>

            <h1>
                Civic Voice
            </h1>


            <h2>
                Submit Your Complaint
            </h2>


            <form
                onSubmit={handleSubmit}
            >

                <textarea

                    value={
                        complaintText
                    }

                    onChange={(event) =>

                        setComplaintText(
                            event.target.value
                        )

                    }

                    placeholder={
                        "Describe your complaint..."
                    }

                    rows="8"

                />


                <br />


                <button

                    type="submit"

                    disabled={loading}

                >

                    {loading

                        ? "Processing..."

                        : "Submit Complaint"

                    }

                </button>

            </form>


            {error && (

                <p>

                    {error}

                </p>

            )}


            {/* SUCCESSFUL COMPLAINT */}

            {result && result.success && (

                <div>

                    <h2>

                        Complaint Submitted
                        Successfully

                    </h2>


                    <p>

                        Complaint ID:{" "}

                        {
                            result.complaint_id
                        }

                    </p>


                    <p>

                        Status: Pending

                    </p>


                    {result.analysis && (

                        <div>

                            <h3>

                                Complaint Analysis

                            </h3>


                            <p>

                                <strong>

                                    Category:

                                </strong>{" "}

                                {
                                    result.analysis
                                    .category
                                }

                            </p>


                            <p>

                                <strong>

                                    Urgency:

                                </strong>{" "}

                                {
                                    result.analysis
                                    .urgency
                                }

                            </p>


                            <p>

                                <strong>

                                    Location:

                                </strong>{" "}

                                {
                                    result.analysis
                                    .location
                                }

                            </p>


                            <p>

                                <strong>

                                    Affected People:

                                </strong>{" "}

                                {
                                    result.analysis
                                    .affected_people
                                }

                            </p>


                            <p>

                                <strong>

                                    Action Requested:

                                </strong>{" "}

                                {
                                    result.analysis
                                    .action_requested
                                }

                            </p>


                            <p>

                                <strong>

                                    Summary:

                                </strong>{" "}

                                {
                                    result.analysis
                                    .summary
                                }

                            </p>


                        </div>

                    )}

                </div>

            )}


            {/* DUPLICATE COMPLAINT */}

            {result && !result.success && (

                <div>

                    <h2>

                        Duplicate Complaint

                    </h2>


                    <p>

                        This complaint appears
                        to have already been
                        submitted.

                    </p>


                    {result.duplicate && (

                        <p>

                            Existing Complaint ID:{" "}

                            {
                                result.duplicate
                                .duplicate_index
                            }

                        </p>

                    )}


                    {result.duplicate && (

                        <p>

                            Confidence:{" "}

                            {
                                (
                                    result.duplicate
                                    .confidence * 100
                                ).toFixed(0)
                            }%

                        </p>

                    )}


                    {result.duplicate && (

                        <p>

                            Reason:{" "}

                            {
                                result.duplicate
                                .reason
                            }

                        </p>

                    )}

                </div>

            )}

        </div>

    );

}


export default CitizenPage;