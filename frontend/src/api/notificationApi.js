import axiosInstance from "./axiosInstance";

// Get my notifications
export const getMyNotifications = async (unreadOnly = false) => {
  try {
    const res = await axiosInstance.get(`/notifications?unreadOnly=${unreadOnly}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Get unread count
export const getUnreadCount = async () => {
  try {
    const res = await axiosInstance.get("/notifications/unread-count");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Mark notification as read
export const markNotificationRead = async (id) => {
  try {
    const res = await axiosInstance.put(`/notifications/${id}/read`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Mark all as read
export const markAllNotificationsRead = async () => {
  try {
    const res = await axiosInstance.put("/notifications/mark-all-read");
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// Delete notification
export const deleteNotification = async (id) => {
  try {
    const res = await axiosInstance.delete(`/notifications/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, message: err.message };
  }
};