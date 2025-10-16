import express from "express";
import { 
  getOutstandingBills, 
  makePayment, 
  getPaymentHistory, 
  getBillDetails,
  getAllBills,
  cancelBill 
} from "../controllers/billController.js";
import { userAuth } from "../middlewares/authMiddleware.js";
import { roleAuth } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Patient routes
router.get("/outstanding", userAuth, getOutstandingBills);
router.post("/pay", userAuth, makePayment);
router.get("/history", userAuth, getPaymentHistory);
router.get("/:id", userAuth, getBillDetails);

// Admin routes
router.get("/", userAuth, roleAuth(['admin']), getAllBills);
router.post("/cancel/:id", userAuth, roleAuth(['admin']), cancelBill);

export default router;