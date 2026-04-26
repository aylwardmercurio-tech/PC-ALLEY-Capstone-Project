"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiUrl } from "../lib/api";

const NotificationContext = createContext();
const STORAGE_KEY = "pc_alley_notifications";

const formatRelativeTime = (createdAt) => {
  const diffMs = Date.now() - createdAt;
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(apiUrl("/api/notifications"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.map(n => ({
          ...n,
          read: n.is_read,
          createdAt: new Date(n.createdAt).getTime()
        })));
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const addNotification = async ({ type = "info", title, message }) => {
    // For local immediate feedback, we can add it locally, 
    // but usually, server-side actions will trigger notifications for other users.
    const createdAt = Date.now();
    const next = {
      id: `local-${createdAt}`,
      type,
      title,
      message,
      createdAt,
      time: formatRelativeTime(createdAt),
      read: false,
    };
    setNotifications((prev) => [next, ...prev].slice(0, 25));
  };

  const markAsRead = async (id) => {
    if (typeof id === 'string' && id.startsWith('local-')) {
      setNotifications((prev) =>
        prev.map((note) => (note.id === id ? { ...note, read: true } : note))
      );
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await fetch(apiUrl(`/api/notifications/${id}/read`), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(apiUrl(`/api/notifications/read-all`), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const removeNotification = async (id) => {
    // We don't have a specific delete for single notif in API yet, but we can clear all.
    // For now, just filter locally.
    setNotifications((prev) => prev.filter((note) => note.id !== id));
  };

  const clearAll = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(apiUrl(`/api/notifications/clear-all`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  const unreadCount = notifications.filter((note) => !note.read).length;
  const hydratedNotifications = notifications.map((note) => ({
    ...note,
    time: formatRelativeTime(note.createdAt || Date.now()),
  }));

  return (
    <NotificationContext.Provider
      value={{
        notifications: hydratedNotifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
