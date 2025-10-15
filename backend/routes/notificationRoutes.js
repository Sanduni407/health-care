import express from "express";
import { 
  getMyNotifications, 
  markNotificationRead, 
  markAllRead, 
  deleteNotification,
  getUnreadCount 
} from "../controllers/notificationController.js";
import { userAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", userAuth, getMyNotifications);
router.get("/unread-count", userAuth, getUnreadCount);
router.put("/:id/read", userAuth, markNotificationRead);
router.put("/mark-all-read", userAuth, markAllRead);
router.delete("/:id", userAuth, deleteNotification);

export default router;