import axiosInstance from "./axiosInstance";

// Create feedback
export const createFeedback = async (formData) => {
  try {
    const res = await axiosInstance.post("/feedback", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get all doctors for dropdown
export const getAllDoctors = async () => {
  try {
    const res = await axiosInstance.get("/feedback/doctors");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get doctor's feedbacks
export const getDoctorFeedbacks = async (status = null, tag = null) => {
  try {
    let url = "/feedback/doctor/feedbacks?";
    if (status) url += `status=${status}&`;
    if (tag) url += `tag=${tag}`;
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get feedback details
export const getFeedbackDetails = async (id) => {
  try {
    const res = await axiosInstance.get(`/feedback/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Send urgent response
export const sendUrgentResponse = async (id, reply) => {
  try {
    const res = await axiosInstance.post(`/feedback/${id}/urgent-response`, { reply });
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Flag concern
export const flagConcern = async (id, concern) => {
  try {
    const res = await axiosInstance.post(`/feedback/${id}/flag-concern`, { concern });
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Mark remark as reviewed
export const markRemarkReviewed = async (id) => {
  try {
    const res = await axiosInstance.put(`/feedback/${id}/mark-reviewed`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get patient's urgent responses
export const getPatientUrgentResponses = async () => {
  try {
    const res = await axiosInstance.get("/feedback/urgent-responses");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get urgent response details
export const getUrgentResponseDetails = async (id) => {
  try {
    const res = await axiosInstance.get(`/feedback/urgent-responses/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get all flagged concerns (admin)
export const getAllFlaggedConcerns = async () => {
  try {
    const res = await axiosInstance.get("/feedback/admin/flagged-concerns");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get flagged concern details
export const getFlaggedConcernDetails = async (id) => {
  try {
    const res = await axiosInstance.get(`/feedback/admin/flagged-concerns/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};