import express from "express";
import { bookAppointment, cancelAppointment, getMyAppointments} from "../controllers/appointmentController.js";
import { userAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", userAuth, bookAppointment);
router.post("/cancel/:id", userAuth, cancelAppointment);

router.get("/me", userAuth, getMyAppointments);

export default router;
