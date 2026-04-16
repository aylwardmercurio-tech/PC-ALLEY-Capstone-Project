"use client";

import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();
const STORAGE_KEY = "pc_alley_notifications";

const seedNotifications = [
  {
    id: "seed-stock-critical",
    type: "alert",
    title: "Stock Critical Level",
    message: "NVIDIA RTX 4070 inventory below 3 units at Manila Branch.",
    time: "12m ago",
    createdAt: Date.now() - 12 * 60 * 1000,
    read: false,
  },
  {
    id: "seed-sync-complete",
    type: "success",
    title: "Sync Completed",
    message: "Daily sales audit uploaded successfully.",
    time: "1h ago",
    createdAt: Date.now() - 60 * 60 * 1000,
    read: false,
  },
];

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setNotifications(seedNotifications);
        return;
      }

      const parsed = JSON.parse(saved);
      setNotifications(Array.isArray(parsed) ? parsed : seedNotifications);
    } catch {
      setNotifications(seedNotifications);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = ({ type = "info", title, message }) => {
    const createdAt = Date.now();
    const next = {
      id: `${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      title,
      message,
      createdAt,
      time: formatRelativeTime(createdAt),
      read: false,
    };

    setNotifications((prev) => [next, ...prev].slice(0, 25));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((note) => (note.id === id ? { ...note, read: true } : note))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((note) => ({ ...note, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((note) => note.id !== id));
  };

  const clearAll = () => setNotifications([]);

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
