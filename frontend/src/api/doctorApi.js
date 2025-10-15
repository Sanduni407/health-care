import axiosInstance from "./axiosInstance";

// Get logged-in doctor profile
export const getDoctorProfile = async () => {
  try {
    const res = await axiosInstance.get("/doctors/me");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get any doctor by id (admin)
export const getDoctorById = async (id) => {
  try {
    const res = await axiosInstance.get(`/doctors/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Update profile
export const updateDoctorProfile = async (data) => {
  try {
    const res = await axiosInstance.post("/doctors", data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Upload image
export const uploadDoctorImage = async (formData, doctorId = null) => {
  try {
    const url = doctorId ? `/doctors/${doctorId}/image` : `/doctors/me/image`;
    const res = await axiosInstance.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};