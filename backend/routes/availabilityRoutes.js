import express from "express";
import { 
  createTemplate, 
  listTemplates, 
  deleteTemplate,
  createOneOff, 
  listOneOffs,
  deleteOneOff,
  getDoctorSlots, 
  getDoctorAvailableDates, 
  getDoctorSlotsByDate
} from "../controllers/availabilityController.js";
import { userAuth } from "../middlewares/authMiddleware.js";
import { roleAuth } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Weekly templates
router.post("/template", userAuth, roleAuth(['doctor','admin']), createTemplate);
router.get("/template", userAuth, roleAuth(['doctor','admin']), listTemplates);
router.delete("/template/:id", userAuth, roleAuth(['doctor','admin']), deleteTemplate);

// One-off availability
router.post("/one-off", userAuth, roleAuth(['doctor','admin']), createOneOff);
router.get("/one-off", userAuth, roleAuth(['doctor','admin']), listOneOffs);
router.delete("/one-off/:id", userAuth, roleAuth(['doctor','admin']), deleteOneOff);

// Doctor slots
router.get("/slots", userAuth, roleAuth(["doctor", "admin"]), getDoctorSlots);

// Public endpoints
router.get("/public/available-dates/:doctorId", getDoctorAvailableDates);
router.get("/public/slots/:doctorId", getDoctorSlotsByDate);

export default router;