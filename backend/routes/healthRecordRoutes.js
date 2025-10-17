import express from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
import upload from "../utils/multer.js";
import {
  uploadHealthRecord,
  getHealthRecords,
  deleteHealthRecord,
  analyzeSingleBloodReport,
  analyzeBloodReports,
} from "../controllers/healthRecordController.js";

const router = express.Router();

router.post("/upload", userAuth, upload.single("file"), uploadHealthRecord);
router.get("/", userAuth, getHealthRecords);
router.delete("/:id", userAuth, deleteHealthRecord);
router.post("/analyze/single", userAuth, analyzeSingleBloodReport);
router.post("/analyze/compare", userAuth, analyzeBloodReports);

export default router;