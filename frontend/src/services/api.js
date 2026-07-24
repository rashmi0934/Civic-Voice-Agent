import axios from "axios";


const api = axios.create({

    baseURL: "http://127.0.0.1:8000"

});


// =================================
// Submit a new complaint
// =================================

export const submitComplaint = async (

    complaintText

) => {

    const response = await api.post(

        "/complaints/",

        {

            complaint_text:
            complaintText

        }

    );

    return response.data;

};


// =================================
// Get dashboard summary
// =================================

export const getDashboardSummary = async () => {

    const response = await api.get(

        "/dashboard/summary"

    );

    return response.data;

};


// =================================
// Get all complaints
// =================================

export const getAllComplaints = async () => {

    const response = await api.get(

        "/complaints/"

    );

    return response.data;

};


// =================================
// Get a single complaint
// =================================

export const getComplaint = async (

    complaintId

) => {

    const response = await api.get(

        `/complaints/${complaintId}`

    );

    return response.data;

};


// =================================
// Update complaint status
// =================================

export const updateComplaintStatus = async (

    complaintId,

    status

) => {

    const response = await api.patch(

        `/complaints/${complaintId}/status`,

        {

            status: status

        }

    );

    return response.data;

};


// =================================
// Filter complaints
// =================================

export const filterComplaints = async (
    status = "",
    category = "",
    urgency = ""
) => {

    const response = await api.get(

        "/complaints/filter",

        {

            params: {

                status:
                    status || undefined,

                category:
                    category || undefined,

                urgency:
                    urgency || undefined

            }

        }

    );

    return response.data;

};

// =================================
// Submit voice complaint
// =================================

export const submitVoiceComplaint = async (

    audioBlob

) => {

    const formData = new FormData();


    formData.append(

        "audio",

        audioBlob,

        "voice_complaint.webm"

    );


    const response = await api.post(

        "/complaints/voice",

        formData

    );


    return response.data;

};

export default api;

