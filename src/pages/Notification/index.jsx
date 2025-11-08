import { useEffect } from "react";

import useNotifications from "../../hooks/useNotifications";
import Card from "../../components/Card";


export default function NotificationsPage() {
  const { 
    notifications, 
    totalCount,
    loading, 
    error, 
    fetchNotifications,
    markAsRead 
  } = useNotifications();

  useEffect(() => {
    // Fetch all notifications when page loads
    fetchNotifications();
  }, [fetchNotifications]);

  // Format date for notifications
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-5xl mx-auto pt-16">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Notifications {totalCount > 0 && `(${totalCount})`}
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="group transition-all duration-300 ease-in-out"
              >
                <Card className={`${
                  !notification.read ? 'bg-blue-50' : 'bg-gray-100'
                } hover:bg-primary cursor-pointer transition-all duration-300 ease-in-out border-none shadow-sm rounded-lg`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold pt-2 text-gray-900 group-hover:text-white transition-colors duration-300 ease-in-out">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm pt-2 pb-2 group-hover:text-white transition-colors duration-300 ease-in-out">
                        {notification.message}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-white transition-colors duration-300 ease-in-out whitespace-nowrap ml-4">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
