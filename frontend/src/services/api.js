import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

// Automatically attach JWT token
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// =================================
// Register
// =================================

export const register = async (userData) => {

    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
};

// =================================
// Login
// =================================

export const login = async (email, password) => {

    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post(

        "/auth/login",

        formData,

        {

            headers: {

                "Content-Type": "application/x-www-form-urlencoded"

            }

        }

    );

    localStorage.setItem(
        "token",
        response.data.access_token
    );

    return response.data;
};


// =================================
// Logout
// =================================

export const logout = () => {

    localStorage.removeItem("token");

};

// =================================
// Submit Complaint
// =================================

export const submitComplaint = async (
    complaintText
) => {

    const response = await api.post(
        "/complaints/",
        {
            complaint_text: complaintText
        }
    );

    return response.data;

};

// =================================
// Dashboard Summary
// =================================

export const getDashboardSummary = async () => {

    const response = await api.get(
        "/dashboard/summary"
    );

    return response.data;

};

// =================================
// Get All Complaints
// =================================

export const getAllComplaints = async () => {

    const response = await api.get(
        "/complaints/"
    );

    return response.data;

};

// =================================
// Get Single Complaint
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
// Update Complaint Status
// =================================

export const updateComplaintStatus = async (
    complaintId,
    status
) => {

    const response = await api.patch(
        `/complaints/${complaintId}/status`,
        {
            status
        }
    );

    return response.data;

};

// =================================
// Filter Complaints
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
                status: status || undefined,
                category: category || undefined,
                urgency: urgency || undefined
            }
        }
    );

    return response.data;

};

// =================================
// Voice Complaint
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