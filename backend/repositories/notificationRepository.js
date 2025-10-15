import Notification from "../models/notificationModel.js";

export const createNotification = (data) => new Notification(data).save();

export const getNotificationsByUser = (userId, unreadOnly = false) => {
  const query = { user: userId };
  if (unreadOnly) query.isRead = false;
  return Notification.find(query)
    .populate('appointmentId')
    .sort({ createdAt: -1 })
    .limit(50);
};

export const markAsRead = (notificationId) => 
  Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });

export const markAllAsRead = (userId) =>
  Notification.updateMany({ user: userId, isRead: false }, { isRead: true });

export const deleteNotification = (notificationId) =>
  Notification.findByIdAndDelete(notificationId);

export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ user: userId, isRead: false });
};