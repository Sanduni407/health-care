import express from "express";
import {
  createFeedback,
  getDoctorFeedbacks,
  getFeedbackDetails,
  sendUrgentResponse,
  flagConcern,
  markRemarkReviewed,
  getPatientUrgentResponses,
  getUrgentResponseDetails,
  getAllFlaggedConcerns,
  getFlaggedConcernDetails,
  getAllDoctors
} from "../controllers/feedbackController.js";
import { userAuth } from "../middlewares/authMiddleware.js";
import { roleAuth } from "../middlewares/roleMiddleware.js";
import uploadFeedback from "../utils/feedbackMulter.js";

const router = express.Router();

// Patient routes
router.post("/", userAuth, roleAuth(["patient"]), uploadFeedback.single("attachment"), createFeedback);
router.get("/urgent-responses", userAuth, roleAuth(["patient"]), getPatientUrgentResponses);
router.get("/urgent-responses/:id", userAuth, roleAuth(["patient"]), getUrgentResponseDetails);
router.get("/doctors", userAuth, roleAuth(["patient"]), getAllDoctors);

// Doctor routes
router.get("/doctor/feedbacks", userAuth, roleAuth(["doctor"]), getDoctorFeedbacks);
router.get("/:id", userAuth, roleAuth(["doctor"]), getFeedbackDetails);
router.post("/:id/urgent-response", userAuth, roleAuth(["doctor"]), sendUrgentResponse);
router.post("/:id/flag-concern", userAuth, roleAuth(["doctor"]), flagConcern);
router.put("/:id/mark-reviewed", userAuth, roleAuth(["doctor"]), markRemarkReviewed);

// Admin routes
router.get("/admin/flagged-concerns", userAuth, roleAuth(["admin"]), getAllFlaggedConcerns);
router.get("/admin/flagged-concerns/:id", userAuth, roleAuth(["admin"]), getFlaggedConcernDetails);

export default router;