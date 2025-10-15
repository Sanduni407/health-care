import * as notificationRepo from "../repositories/notificationRepository.js";

// Get my notifications
export const getMyNotifications = async (req, res) => {
  try {
    const unreadOnly = req.query.unreadOnly === 'true';
    const notifications = await notificationRepo.getNotificationsByUser(req.user.id, unreadOnly);
    const unreadCount = await notificationRepo.getUnreadCount(req.user.id);
    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await notificationRepo.markAsRead(req.params.id);
    res.json({ success: true, notification });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Mark all as read
export const markAllRead = async (req, res) => {
  try {
    await notificationRepo.markAllAsRead(req.user.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    await notificationRepo.deleteNotification(req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationRepo.getUnreadCount(req.user.id);
    res.json({ success: true, count });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};