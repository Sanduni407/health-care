import * as healthRecordService from "../services/healthRecordService.js";

export const uploadHealthRecord = async (req, res) => {
  try {
    const { recordType, notes } = req.body;
    const patientId = req.user.id;

    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    if (!recordType) {
      return res.json({ success: false, message: "Record type is required" });
    }

    console.log("Uploading file:", {
      fileName: req.file.originalname,
      filePath: req.file.path,
      recordType,
      patientId,
    });

    const fileName = req.file.filename;
    const relativePath = `/uploads/records/${fileName}`;

    const record = await healthRecordService.uploadRecord(
      patientId,
      recordType,
      req.file.originalname,
      relativePath,
      req.file.size,
      notes || ""
    );

    console.log("Record created successfully:", record);
    res.json({ success: true, record });
  } catch (err) {
    console.error("Upload error:", err);
    res.json({ success: false, message: err.message });
  }
};

export const getHealthRecords = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { recordType } = req.query;

    let records;
    if (recordType) {
      records = await healthRecordService.getRecordsByTypeService(patientId, recordType);
    } else {
      records = await healthRecordService.getRecords(patientId);
    }

    res.json({ success: true, records });
  } catch (err) {
    console.error("Fetch error:", err);
    res.json({ success: false, message: err.message });
  }
};

export const deleteHealthRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await healthRecordService.deleteRecordService(id);
    res.json({ success: true, message: "Record deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.json({ success: false, message: err.message });
  }
};

export const analyzeSingleBloodReport = async (req, res) => {
  try {
    const { report } = req.body;

    if (!report) {
      return res.json({
        success: false,
        message: "Report content is required",
      });
    }

    if (report.trim().length < 10) {
      return res.json({
        success: false,
        message: "Report must contain meaningful content",
      });
    }

    const result = await healthRecordService.analyzeSingleReportService(report);

    res.json(result);
  } catch (err) {
    console.error("Analysis error:", err);
    res.json({ success: false, message: err.message });
  }
};

export const analyzeBloodReports = async (req, res) => {
  try {
    const { previousReport, currentReport } = req.body;

    if (!previousReport || !currentReport) {
      return res.json({
        success: false,
        message: "Both previous and current reports are required",
      });
    }

    if (previousReport.trim().length < 10 || currentReport.trim().length < 10) {
      return res.json({
        success: false,
        message: "Reports must contain meaningful content",
      });
    }

    const result = await healthRecordService.analyzeReportsService(
      previousReport,
      currentReport
    );

    res.json(result);
  } catch (err) {
    console.error("Analysis error:", err);
    res.json({ success: false, message: err.message });
  }
};