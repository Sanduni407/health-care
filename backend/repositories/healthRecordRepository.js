import HealthRecord from "../models/healthRecordModel.js";

export const createRecord = async (data) => {
  try {
    const record = new HealthRecord(data);
    return await record.save();
  } catch (err) {
    throw new Error("Error creating record: " + err.message);
  }
};

export const getPatientRecords = async (patientId) => {
  try {
    return await HealthRecord.find({ patientId }).sort({ uploadDate: -1 });
  } catch (err) {
    throw new Error("Error fetching records: " + err.message);
  }
};

export const getRecordById = async (id) => {
  try {
    return await HealthRecord.findById(id);
  } catch (err) {
    throw new Error("Error fetching record: " + err.message);
  }
};

export const deleteRecord = async (id) => {
  try {
    return await HealthRecord.findByIdAndDelete(id);
  } catch (err) {
    throw new Error("Error deleting record: " + err.message);
  }
};

export const getRecordsByType = async (patientId, recordType) => {
  try {
    return await HealthRecord.find({ patientId, recordType }).sort({ uploadDate: -1 });
  } catch (err) {
    throw new Error("Error fetching records by type: " + err.message);
  }
};