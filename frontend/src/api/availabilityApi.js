import axiosInstance from "./axiosInstance";

// Weekly Templates
export const createWeeklyTemplate = async (data) => {
  try {
    const res = await axiosInstance.post("/availability/template", data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getWeeklyTemplates = async () => {
  try {
    const res = await axiosInstance.get("/availability/template");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const deleteWeeklyTemplate = async (id) => {
  try {
    const res = await axiosInstance.delete(`/availability/template/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// One-off Availability
export const createOneOffAvailability = async (data) => {
  try {
    const res = await axiosInstance.post("/availability/one-off", data);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getOneOffAvailabilities = async () => {
  try {
    const res = await axiosInstance.get("/availability/one-off");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const deleteOneOffAvailability = async (id) => {
  try {
    const res = await axiosInstance.delete(`/availability/one-off/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get doctor's slots
export const getDoctorSlots = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await axiosInstance.get(`/availability/slots?${query}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};