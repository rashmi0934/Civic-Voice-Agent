import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {submitComplaint,submitVoiceComplaint} from "../services/api";


function CitizenPage() {

     // =================================
    // Navigation
    // =================================

    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const token = localStorage.getItem("token");

    let user = {
        name:"",
        email: "",
        role: "citizen"
    };

    if (token) {
        try {
            user = JSON.parse(
                atob(token.split(".")[1])
            );
        } catch (e) {}
    }

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // =================================
    // Text complaint
    // =================================

    const [

        complaintText,

        setComplaintText

    ] = useState("");


    // =================================
    // Result
    // =================================

    const [

        result,

        setResult

    ] = useState(null);


    // =================================
    // Loading
    // =================================

    const [

        loading,

        setLoading

    ] = useState(false);


    // =================================
    // Error
    // =================================

    const [

        error,

        setError

    ] = useState("");


    // =================================
    // Voice recording state
    // =================================

    const [

        isRecording,

        setIsRecording

    ] = useState(false);


    const [

        voiceLoading,

        setVoiceLoading

    ] = useState(false);


    const mediaRecorderRef = useRef(null);


    const audioChunksRef = useRef([]);


    // =================================
    // Submit text complaint
    // =================================

    const handleSubmit = async (

        event

    ) => {


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


        }

        catch (error) {


            console.error(error);


            setError(

                "Unable to submit complaint. "

                + "Please try again."

            );

        }

        finally {


            setLoading(false);

        }

    };


    // =================================
    // Start voice recording
    // =================================

    const startRecording = async () => {


        try {


            setError("");

            setResult(null);


            const stream =

                await navigator.mediaDevices

                    .getUserMedia({

                        audio: true

                    });


            const mediaRecorder =

                new MediaRecorder(

                    stream

                );


            mediaRecorderRef.current =

                mediaRecorder;


            audioChunksRef.current = [];


            mediaRecorder.ondataavailable = (

                event

            ) => {


                if (

                    event.data.size > 0

                ) {


                    audioChunksRef.current

                        .push(

                            event.data

                        );

                }

            };


            mediaRecorder.onstop = async () => {


                const audioBlob =

                    new Blob(

                        audioChunksRef.current,

                        {

                            type:

                                "audio/webm"

                        }

                    );


                stream

                    .getTracks()

                    .forEach(

                        (

                            track

                        ) => track.stop()

                    );


                await submitVoice(

                    audioBlob

                );

            };


            mediaRecorder.start();


            setIsRecording(true);


        }

        catch (error) {


            console.error(error);


            setError(

                "Microphone access was denied "

                + "or is unavailable."

            );

        }

    };


    // =================================
    // Stop voice recording
    // =================================

    const stopRecording = () => {


        if (

            mediaRecorderRef.current

        ) {


            mediaRecorderRef.current.stop();


            setIsRecording(false);

        }

    };


    // =================================
    // Submit voice complaint
    // =================================

    const submitVoice = async (

        audioBlob

    ) => {


        try {


            setVoiceLoading(true);

            setError("");

            setResult(null);


            const data =

                await submitVoiceComplaint(

                    audioBlob

                );


            setResult(data);


        }

        catch (error) {


            console.error(error);


            setError(

                "Unable to process voice complaint. "

                + "Please try again."

            );

        }

        finally {


            setVoiceLoading(false);

        }

    };


    return (

    <div className="citizen-page">

    <div className="citizen-container">

        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px",
                position: "relative",
                overflow: "visible"
            }}
        >

            <div
                style={{
                    position: "relative"
                }}
            >

                <div
                    onClick={() => setShowProfile(!showProfile)}
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "#2563eb",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: "24px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 12px rgba(0,0,0,.25)"
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
                            width: "300px",
                            background: "#ffffff",
                            borderRadius: "12px",
                            boxShadow: "0 10px 30px rgba(0,0,0,.2)",
                            border: "1px solid #ddd",
                            padding: "20px",
                            zIndex: 9999
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                marginBottom: "15px"
                            }}
                        >

                            <div
                                style={{
                                    width: "70px",
                                    height: "70px",
                                    borderRadius: "50%",
                                    background: "#2563eb",
                                    color: "white",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "30px",
                                    marginBottom: "12px"
                                }}
                            >
                                👤
                            </div>

                            <h3
                                style={{
                                    margin: 0
                                }}
                            >
                                {user.name || "Citizen"}
                            </h3>

                            <p
                                style={{
                                    margin: "8px 0",
                                    color: "#666",
                                    textAlign: "center",
                                    wordBreak: "break-word"
                                }}
                            >
                                {user.email}
                            </p>

                            <span
                                style={{
                                    background: "#e3f2fd",
                                    color: "#1565c0",
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontSize: "14px"
                                }}
                            >
                                {user.role}
                            </span>

                        </div>

                        <button
                            onClick={logout}
                            style={{
                                width: "100%",
                                padding: "10px",
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            Logout
                        </button>

                    </div>

                )}

            </div>

        </div>    

        <div className="citizen-header">

                <h1>
                    Civic Voice
                </h1>

                <p>
                    Report issues in your community
                    and help make your city better.
                </p>

            </div>


            <div className="complaint-card">

                <h2>
                    Submit Your Complaint
                </h2>

                <p className="section-description">
                    Describe the problem you are facing
                    in your community.
                </p>


                <form
                    onSubmit={handleSubmit}
                    className="complaint-form"
                >

                    <textarea

                        value={complaintText}

                        onChange={(event) =>
                            setComplaintText(
                                event.target.value
                            )
                        }

                        placeholder={
                            "Example: There is dirty water "
                            + "coming from the taps in Sector 25..."
                        }

                        rows="7"

                        disabled={
                            loading ||
                            isRecording ||
                            voiceLoading
                        }

                    />


                    <button

                        type="submit"

                        className="submit-button"

                        disabled={
                            loading ||
                            isRecording ||
                            voiceLoading
                        }

                    >

                        {loading
                            ? "Processing..."
                            : "Submit Complaint"
                        }

                    </button>

                </form>


                <div className="voice-divider">

                    <span>
                        OR
                    </span>

                </div>


                <div className="voice-section">

                    <h3>
                        Submit a Voice Complaint
                    </h3>

                    <p>
                        Speak naturally and our AI agents
                        will analyze your complaint.
                    </p>


                    {!isRecording && (

                        <button

                            type="button"

                            className="voice-button"

                            onClick={
                                startRecording
                            }

                            disabled={
                                loading ||
                                voiceLoading
                            }

                        >

                            🎙️ Start Recording

                        </button>

                    )}


                    {isRecording && (

                        <button

                            type="button"

                            className="stop-button"

                            onClick={
                                stopRecording
                            }

                        >

                            ⏹️ Stop Recording

                        </button>

                    )}


                    {isRecording && (

                        <p className="recording-status">

                            🔴 Recording...

                        </p>

                    )}


                    {voiceLoading && (

                        <p className="processing-status">

                            🎧 Processing your complaint...

                        </p>

                    )}

                </div>

            </div>


            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {result && result.success && (

                <div className="result-card">

                    <div className="success-header">

                        <span className="success-icon">
                            ✓
                        </span>

                        <h2>
                            Complaint Submitted Successfully
                        </h2>

                    </div>


                    <div className="complaint-id">

                        Complaint ID:

                        <strong>

                            {result.complaint_id}

                        </strong>

                    </div>


                    {result.transcribed_text && (

                        <div className="transcription-box">

                            <h3>
                                Transcribed Voice
                            </h3>

                            <p>
                                {result.transcribed_text}
                            </p>

                        </div>

                    )}


                    {result.analysis && (

                        <div className="analysis-section">

                            <h3>
                                Complaint Analysis
                            </h3>


                            <div className="analysis-grid">

                                <div className="analysis-item">

                                    <span>
                                        Category
                                    </span>

                                    <strong>
                                        {
                                            result.analysis.category
                                        }
                                    </strong>

                                </div>


                                <div className="analysis-item">

                                    <span>
                                        Urgency
                                    </span>

                                    <strong>
                                        {
                                            result.analysis.urgency
                                        }
                                    </strong>

                                </div>


                                <div className="analysis-item">

                                    <span>
                                        Location
                                    </span>

                                    <strong>
                                        {
                                            result.analysis.location
                                        }
                                    </strong>

                                </div>


                                <div className="analysis-item">

                                    <span>
                                        Affected People
                                    </span>

                                    <strong>
                                        {
                                            result.analysis.affected_people
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="analysis-text">

                                <p>

                                    <strong>
                                        Action Requested:
                                    </strong>

                                    {" "}

                                    {
                                        result.analysis
                                            .action_requested
                                    }

                                </p>


                                <p>

                                    <strong>
                                        Summary:
                                    </strong>

                                    {" "}

                                    {
                                        result.analysis.summary
                                    }

                                </p>

                            </div>

                        </div>

                    )}

                </div>

            )}


            {result && !result.success && (

                <div className="error-card">

                    <h2>

                        {
                            result.is_duplicate
                                ? "Duplicate Complaint"
                                : "Complaint Submission Failed"
                        }

                    </h2>

                    <p>

                        {
                            result.reason ||
                            result.message ||
                            "Unable to submit complaint."
                        }

                    </p>

                    {result.missing_fields && (

                        <div>

                            <strong>
                                Missing Information:
                            </strong>

                            <ul>

                                {result.missing_fields.map((field) => (

                                    <li key={field}>

                                        {field}

                                    </li>

                                ))}

                            </ul>

                        </div>

                    )}

                </div>

            )}

        </div>

    </div>

);

}


export default CitizenPage;