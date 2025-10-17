import * as healthRecordRepository from "../repositories/healthRecordRepository.js";
import { analyzeSingleReport, analyzeReports } from "../utils/geminiService.js";

export const uploadRecord = async (patientId, recordType, fileName, filePath, fileSize, notes) => {
  try {
    const record = await healthRecordRepository.createRecord({
      patientId,
      recordType,
      fileName,
      filePath,
      fileSize,
      notes,
    });
    return record;
  } catch (err) {
    throw new Error("Upload failed: " + err.message);
  }
};

export const getRecords = async (patientId) => {
  try {
    return await healthRecordRepository.getPatientRecords(patientId);
  } catch (err) {
    throw new Error("Failed to fetch records: " + err.message);
  }
};

export const getRecordsByTypeService = async (patientId, recordType) => {
  try {
    return await healthRecordRepository.getRecordsByType(patientId, recordType);
  } catch (err) {
    throw new Error("Failed to fetch records by type: " + err.message);
  }
};

export const deleteRecordService = async (recordId) => {
  try {
    return await healthRecordRepository.deleteRecord(recordId);
  } catch (err) {
    throw new Error("Failed to delete record: " + err.message);
  }
};

export const analyzeSingleReportService = async (report) => {
  try {
    return await analyzeSingleReport(report);
  } catch (err) {
    throw new Error("Analysis failed: " + err.message);
  }
};

export const analyzeReportsService = async (previousReport, currentReport) => {
  try {
    return await analyzeReports(previousReport, currentReport);
  } catch (err) {
    throw new Error("Analysis failed: " + err.message);
  }
};