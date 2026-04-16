"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  Trash2,
  Bell,
  CheckCheck,
  Sparkles,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const notificationConfig = {
  alert: {
    icon: AlertTriangle,
    color: "text-brand-crimson",
    bgOrigin: "bg-brand-crimson/5",
  },
  success: {
    icon: CheckCircle2,
    color: "text-green-500",
    bgOrigin: "bg-green-500/5",
  },
  info: {
    icon: Info,
    color: "text-main",
    bgOrigin: "bg-main/5",
  },
};

const NotificationsPanel = ({ isOpen, onClose }) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();
  const unreadCount = notifications.filter((note) => !note.read).length;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[380px] bg-brand-navy/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.4)] z-[101] flex flex-col font-dm-sans"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-white/10 bg-brand-navy/95 backdrop-blur-2xl">
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-crimson/10 border border-brand-crimson/20 flex items-center justify-center text-brand-crimson">
                      <Bell size={18} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[3px] text-main">Alert Hub</h2>
                      <p className="text-[10px] text-brand-muted font-bold uppercase tracking-[2px] mt-1">
                        {notifications.length ? `${notifications.length} alerts` : "No active alerts"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-colors text-brand-muted hover:text-main flex items-center justify-center"
                    aria-label="Close notifications"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-brand-muted mb-1">Unread</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-rajdhani font-black text-main">{unreadCount}</span>
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-brand-crimson/20 bg-brand-crimson/10 px-2 py-1 text-[9px] font-black uppercase tracking-[2px] text-brand-crimson">
                          <Sparkles size={10} />
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={markAllAsRead}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left hover:bg-white/[0.06] transition-all"
                  >
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-brand-muted mb-1">Quick Action</p>
                    <div className="flex items-center gap-2 text-main text-[10px] font-black uppercase tracking-[2px]">
                      <CheckCheck size={14} />
                      Mark All Read
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {notifications.length ? (
                <div className="space-y-3">
                  {notifications.map((note, i) => {
                    const config = notificationConfig[note.type] || notificationConfig.info;
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`rounded-2xl border p-4 group transition-all ${
                          note.read
                            ? "border-white/8 bg-white/[0.025] opacity-60"
                            : `border-white/10 ${config.bgOrigin} bg-white/[0.035] hover:bg-white/[0.05]`
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className={`mt-1 h-11 w-11 shrink-0 rounded-2xl bg-[#0C1522] border border-white/10 flex items-center justify-center ${config.color}`}>
                            <Icon size={17} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-[13px] font-bold text-main">{note.title}</h3>
                                  {!note.read && (
                                    <span className="inline-flex h-2 w-2 rounded-full bg-brand-crimson shadow-[0_0_10px_rgba(215,38,56,0.55)]" />
                                  )}
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-[2px] text-brand-muted mt-1">
                                  {note.type} priority
                                </p>
                              </div>
                              <span className="text-[9px] font-bold text-brand-muted uppercase whitespace-nowrap">{note.time}</span>
                            </div>
                            <p className="text-[11px] text-brand-muted leading-relaxed">
                              {note.message}
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                              <button
                                onClick={() => markAsRead(note.id)}
                                className="h-9 px-3 rounded-lg border border-brand-crimson/20 bg-brand-crimson/10 text-[9px] font-black uppercase tracking-[2px] text-brand-crimson hover:bg-brand-crimson/15 transition-all"
                              >
                                Acknowledge
                              </button>
                              <button
                                onClick={() => removeNotification(note.id)}
                                className="h-9 px-3 rounded-lg border border-white/10 bg-white/[0.03] text-[9px] font-black uppercase tracking-[2px] text-brand-muted hover:text-main hover:bg-white/[0.05] transition-all"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center py-12">
                  <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-brand-neonblue">
                      <Clock size={28} className="stroke-[1.5px]" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[4px] text-main">No Alerts In Stream</p>
                    <p className="text-[11px] text-brand-muted mt-3 max-w-[260px] mx-auto leading-relaxed">
                      New stock warnings, personnel activity, and system notices will appear here in real time.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02]">
              <button
                onClick={clearAll}
                className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] text-[10px] font-bold uppercase tracking-[3px] hover:bg-white/[0.07] transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                Purge All Alerts
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;
