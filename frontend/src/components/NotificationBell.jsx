import { useState, useEffect } from "react";
import { Bell, X, Check, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../api/notificationApi";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchUnreadCount = async () => {
    const res = await getUnreadCount();
    if (res.success) {
      setUnreadCount(res.count);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await getMyNotifications();
    if (res.success) {
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (id) => {
    const res = await markNotificationRead(id);
    if (res.success) {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    const res = await markAllNotificationsRead();
    if (res.success) {
      fetchNotifications();
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteNotification(id);
    if (res.success) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    await markNotificationRead(notification._id);
    
    // Navigate based on type
    if (notification.type === "urgent_response") {
      navigate("/patient-profile");
    } else if (notification.type === "concern_flagged") {
      navigate("/admin-dashboard");
    } else if (notification.appointmentId) {
      navigate("/my-appointments");
    }
    
    setIsOpen(false);
    fetchNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment_cancelled":
        return "❌";
      case "appointment_confirmed":
        return "✅";
      case "appointment_reminder":
        return "⏰";
      case "urgent_response":
        return "💬";
      case "concern_flagged":
        return "🚩";
      default:
        return "📢";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = Math.floor((now - notifDate) / 1000); // seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-teal-600 transition-colors rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[32rem] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-teal-50">
              <h3 className="font-bold text-gray-800 text-lg">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm text-teal-600">
                    ({unreadCount} new)
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notif.isRead ? "bg-teal-50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm mb-1">
                            {notif.title}
                          </p>
                          <p className="text-gray-600 text-sm mb-2">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatTime(notif.createdAt)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {!notif.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notif._id);
                              }}
                              className="p-1 text-teal-600 hover:bg-teal-100 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notif._id);
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}