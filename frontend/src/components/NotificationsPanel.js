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
  Zap,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { apiUrl } from "../lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const notificationConfig = {
  alert: {
    icon: AlertTriangle,
    color: "text-brand-crimson",
    bg: "bg-brand-crimson/10",
    border: "border-brand-crimson/20",
    glow: "shadow-[0_0_15px_rgba(215,38,56,0.15)]",
  },
  success: {
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    glow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]",
  },
  info: {
    icon: Info,
    color: "text-brand-neonblue",
    bg: "bg-brand-neonblue/10",
    border: "border-brand-neonblue/20",
    glow: "shadow-[0_0_15px_rgba(0,242,255,0.15)]",
  },
  restock_request: {
    icon: Bell,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    glow: "shadow-[0_0_15px_rgba(251,191,36,0.15)]",
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
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0A0A0A]/60 backdrop-blur-[6px] z-[100]"
          />

          {/* Premium Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 h-screen w-full max-w-[420px] bg-brand-surface border-l border-border shadow-[0_0_100px_rgba(0,0,0,0.5)] z-[101] flex flex-col font-dmsans overflow-hidden"
          >
            {/* Header Area */}
            <div className="relative p-6 border-b border-border bg-brand-surface/50 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-brand-crimson/10 border border-brand-crimson/20 flex items-center justify-center text-brand-crimson overflow-hidden">
                       <motion.div
                         animate={{ rotate: [0, -10, 10, -10, 0] }}
                         transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                       >
                         <Bell size={22} />
                       </motion.div>
                       {unreadCount > 0 && (
                         <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-crimson rounded-full border-2 border-brand-surface flex items-center justify-center">
                           <span className="text-[8px] font-black text-white">{unreadCount}</span>
                         </div>
                       )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-rajdhani font-black uppercase tracking-[2px] text-main leading-tight">Notifications</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${unreadCount > 0 ? 'bg-brand-crimson animate-pulse' : 'bg-green-500'}`} />
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
                        {unreadCount > 0 ? `${unreadCount} new alerts` : "All Good"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:text-main hover:bg-main/5 transition-all duration-300 group"
                  aria-label="Close"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Quick Actions Bar */}
              {notifications.length > 0 && (
                <div className="mt-6 flex gap-2">
                  <button 
                    onClick={markAllAsRead}
                    className="flex-1 h-10 rounded-xl bg-brand-bgbase border border-border flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[2px] text-muted hover:text-brand-neonblue hover:border-brand-neonblue/30 transition-all shadow-sm"
                  >
                    <CheckCheck size={14} />
                    Mark All Read
                  </button>
                  <button 
                    onClick={clearAll}
                    className="w-10 h-10 rounded-xl bg-brand-bgbase border border-border flex items-center justify-center text-muted hover:text-brand-crimson hover:border-brand-crimson/30 transition-all shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-brand-bgbase/30">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((note, idx) => {
                    const config = notificationConfig[note.type] || notificationConfig.info;
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`group relative rounded-[24px] border p-5 transition-all duration-300 ${
                          note.read 
                            ? "bg-brand-surface/40 border-border/50 opacity-60" 
                            : `bg-brand-surface border-border shadow-md ${config.glow}`
                        }`}
                      >
                        <div className="flex gap-5">
                          <div className={`mt-1 h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center border transition-colors ${
                            note.read ? "bg-main/5 border-border text-muted" : `${config.bg} ${config.border} ${config.color}`
                          }`}>
                            <Icon size={20} className={!note.read ? "animate-pulse" : ""} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="min-w-0">
                                <h3 className={`text-sm font-bold truncate leading-tight ${note.read ? 'text-main/60' : 'text-main'}`}>
                                  {note.title}
                                </h3>
                                <p className="text-[9px] font-black uppercase tracking-[2px] text-muted mt-1.5 flex items-center gap-2">
                                  <span className={`w-1 h-1 rounded-full ${note.read ? 'bg-muted' : config.color.replace('text-', 'bg-')}`} />
                                  {note.type} PRIORITY
                                </p>
                              </div>
                              <span className="text-[9px] font-black text-muted/40 uppercase tracking-widest whitespace-nowrap pt-0.5">
                                {note.time}
                              </span>
                            </div>

                            <p className={`text-[12px] leading-relaxed mb-4 ${note.read ? 'text-main/40' : 'text-main/80'}`}>
                              {note.message}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              {note.type === 'restock_request' ? (
                                !note.read ? (
                                  <>
                                    <button
                                      onClick={async (e) => { 
                                        e.stopPropagation(); 
                                        const id = note.link.split('id=')[1];
                                        const token = localStorage.getItem('token');
                                        try {
                                          const res = await fetch(apiUrl(`/api/restock-requests/${id}/approve`), {
                                            method: 'PATCH',
                                            headers: { 'Authorization': `Bearer ${token}` }
                                          });
                                          if (res.ok) {
                                            toast.success('Restock Approved');
                                            markAsRead(note.id);
                                          }
                                        } catch(err) { toast.error('Action Failed'); }
                                      }}
                                      className="h-9 px-4 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[2px] hover:bg-emerald-600 transition-all shadow-sm"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        window.location.href = note.link;
                                      }}
                                      className="h-9 px-4 rounded-xl bg-rose-500 text-white text-[9px] font-black uppercase tracking-[2px] hover:bg-rose-600 transition-all shadow-sm"
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => { window.location.href = note.link; }}
                                    className="h-9 px-4 rounded-xl bg-brand-bgbase border border-border text-[9px] font-black uppercase tracking-[2px] text-muted hover:text-main transition-all"
                                  >
                                    View Details
                                  </button>
                                )
                              ) : (
                                !note.read && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); markAsRead(note.id); }}
                                    className={`h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-[2px] text-white transition-all shadow-sm ${
                                      note.type === 'alert' ? 'bg-brand-crimson hover:bg-red-700' : 'bg-brand-neonblue hover:bg-blue-600'
                                    }`}
                                  >
                                    Acknowledge
                                  </button>
                                )
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); removeNotification(note.id); }}
                                className="h-9 px-4 rounded-xl bg-brand-bgbase border border-border text-[9px] font-black uppercase tracking-[2px] text-muted hover:text-main hover:border-main/20 transition-all"
                              >
                                {note.read ? 'Clear' : 'Dismiss'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 px-10 text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-[40px] bg-brand-surface border border-border flex items-center justify-center text-main/5 shadow-inner">
                      <Zap size={48} className="stroke-[1px]" />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-brand-neonblue/20 blur-[40px] rounded-full"
                    />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[4px] text-main">No New Messages</h3>
                  <p className="text-[11px] text-muted mt-4 leading-relaxed font-medium">
                    No active alerts found. Your store activity and stock levels are currently stable.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Status Info */}
            <div className="p-4 bg-brand-surface border-t border-border flex items-center justify-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <span className="text-[9px] font-black text-main/30 uppercase tracking-[2px]">Connected</span>
               </div>
               <div className="w-px h-3 bg-border" />
               <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-main/30 uppercase tracking-[2px]">Last Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;

