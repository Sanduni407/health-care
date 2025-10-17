import axiosInstance from "./axiosInstance";

export const uploadHealthRecord = async (formData) => {
  try {
    const res = await axiosInstance.post("/health-records/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getHealthRecords = async (recordType = null) => {
  try {
    const query = recordType ? `?recordType=${recordType}` : "";
    const res = await axiosInstance.get(`/health-records${query}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const deleteHealthRecord = async (id) => {
  try {
    const res = await axiosInstance.delete(`/health-records/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const analyzeSingleReport = async (report) => {
  try {
    const res = await axiosInstance.post("/health-records/analyze/single", {
      report,
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const analyzeBloodReports = async (previousReport, currentReport) => {
  try {
    const res = await axiosInstance.post("/health-records/analyze/compare", {
      previousReport,
      currentReport,
    });
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};