import { useState, useEffect, useCallback, useRef } from "react";
import { apiWithAuth } from "../axios/Instance";

const useNotifications = (limit = null) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const effectRan = useRef(false);

  // Fetch notifications with optional limit
  const fetchNotifications = useCallback(async (fetchLimit = limit) => {
    setLoading(true);
    setError(null);
    
    try {
      const api = apiWithAuth();
      // Add limit query parameter if backend supports it
      const url = fetchLimit 
        ? `/persona/notifications?limit=${fetchLimit}` 
        : "/persona/notifications";
      const response = await api.get(url);
      
      if (response.data && response.data.statusCode) {
        const { data } = response.data.statusCode;
        
        setNotifications(data.notifications || []);
        setUnreadCount(data.totalUnreadNotifications || 0);
        setTotalCount(data.totalNotifications || 0);
        
        return data.notifications;
      } else {
        setError("Invalid response structure");
        return [];
      }
    } catch (err) {
      console.error("Get notifications error:", err);
      setError(err.response?.data?.message || "Failed to fetch notifications");
      return [];
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Mark a specific notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!notificationId) return false;
    
    try {
      const api = apiWithAuth();
      const response = await api.patch(`/persona/notifications/${notificationId}`);
      
      if (response.data && response.data.statusCode && response.data.statusCode.status === 200) {
        // Update the local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        // Recalculate unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Mark as read error:", err);
      return false;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const api = apiWithAuth();
      const response = await api.patch("/persona/notifications");
      
      if (response.data && response.data.statusCode && response.data.statusCode.status === 200) {
        // Update all notifications to read in local state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        );
        // Reset unread count
        setUnreadCount(0);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Mark all as read error:", err);
      return false;
    }
  }, []);

  // Initial fetch of notifications - runs only once
  useEffect(() => {
    if (effectRan.current === false) {
      fetchNotifications();
      effectRan.current = true;
    }
  }, [fetchNotifications]);

  return { 
    notifications, 
    unreadCount,
    totalCount,
    loading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  };
};

export default useNotifications;
