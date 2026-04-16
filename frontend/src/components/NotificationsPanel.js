"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  Trash2,
  ChevronRight,
} from "lucide-react";

const NotificationsPanel = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Stock Critical Level",
      message: "NVIDIA RTX 4070 inventory below 3 units at Manila Branch.",
      time: "12m ago",
      icon: AlertTriangle,
      color: "text-brand-crimson",
      bgOrigin: "bg-brand-crimson/5",
    },
    {
      id: 2,
      type: "success",
      title: "Sync Completed",
      message: "Daily sales audit for April 10, 2026 successfully uploaded.",
      time: "1h ago",
      icon: CheckCircle2,
      color: "text-green-500",
      bgOrigin: "bg-green-500/5",
    },
    {
      id: 3,
      type: "info",
      title: "System Update",
      message: "V2.4 kernel patch applied. New analytics modules unlocked.",
      time: "3h ago",
      icon: Info,
      color: "text-main",
      bgOrigin: "bg-main/5",
    },
  ];

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
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-brand-deep/95 backdrop-blur-xl border-l border-border shadow-2xl z-[101] flex flex-col font-dm-sans"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-crimson/10 border border-brand-crimson/20 flex items-center justify-center text-brand-crimson">
                  <Bell size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-main">Alert Hub</h2>
                  <p className="text-[10px] text-brand-muted font-bold uppercase tracking-tight">Active Transmissions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-main/5 rounded-lg transition-colors text-brand-muted hover:text-main"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="space-y-4">
                {notifications.map((note, i) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-2xl border border-border ${note.bgOrigin} group cursor-pointer hover:border-border transition-all`}
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 p-2 rounded-lg bg-brand-deep border border-border ${note.color}`}>
                        <note.icon size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-[13px] font-bold text-main group-hover:text-brand-crimson transition-colors">{note.title}</h3>
                          <span className="text-[9px] font-bold text-brand-muted uppercase whitespace-nowrap">{note.time}</span>
                        </div>
                        <p className="text-[11px] text-brand-muted leading-relaxed line-clamp-2">
                          {note.message}
                        </p>
                        <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-[9px] font-bold uppercase tracking-widest text-brand-crimson hover:underline">Acknowledge</button>
                          <span className="text-muted">|</span>
                          <button className="text-[9px] font-bold uppercase tracking-widest text-brand-muted hover:text-main">Forward</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State Mock */}
              <div className="mt-8 flex flex-col items-center justify-center py-12 opacity-20">
                <Clock size={48} className="stroke-[1px] mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest">End of stream</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-white/[0.02]">
              <button className="w-full py-3 rounded-xl border border-border bg-main/5 text-[10px] font-bold uppercase tracking-[3px] hover:bg-main/10 transition-all flex items-center justify-center gap-2">
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
