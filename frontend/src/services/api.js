import axios from "axios";


const api = axios.create({

    baseURL: "http://127.0.0.1:8000"

});


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


export default api;