import axiosInstance from "./axiosInstance";

// Get all doctors with optional filters
export const getAllDoctors = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.q) params.append("q", filters.q);
    if (filters.specialization) params.append("specialization", filters.specialization);
    
    const res = await axiosInstance.get(`/doctors?${params.toString()}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get public doctor profile by ID
export const getDoctorPublicProfile = async (doctorId) => {
  try {
    const res = await axiosInstance.get(`/doctors/getdoctorprofile/${doctorId}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get available dates for a doctor
export const getDoctorAvailableDates = async (doctorId) => {
  try {
    const res = await axiosInstance.get(`/availability/public/available-dates/${doctorId}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get available slots for a doctor on a specific date
export const getDoctorSlotsByDate = async (doctorId, date) => {
  try {
    const res = await axiosInstance.get(`/availability/public/slots/${doctorId}?date=${date}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Book an appointment
export const bookAppointment = async (appointmentData) => {
  try {
    const res = await axiosInstance.post("/appointments", appointmentData);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get my appointments
export const getMyAppointments = async () => {
  try {
    const res = await axiosInstance.get("/appointments/me");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Cancel appointment
export const cancelAppointment = async (appointmentId) => {
  try {
    const res = await axiosInstance.post(`/appointments/cancel/${appointmentId}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};