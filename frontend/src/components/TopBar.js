"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Settings as SettingsIcon, Calendar, Command, User, ChevronDown, LogOut, Sun, Moon, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import NotificationsPanel from "./NotificationsPanel";
import Breadcrumb from "./Breadcrumb";
import { useTheme } from "../context/ThemeContext";
import { useLayout } from "../context/LayoutContext";
import { useNotifications } from "../context/NotificationContext";

 const TopBar = ({ title }) => {
   const { theme, toggleTheme } = useTheme();
   const { isMobile, isSidebarOpen, setIsSidebarOpen } = useLayout();
   const { unreadCount, markAllAsRead } = useNotifications();
   const router = useRouter();
   const [user, setUser] = useState(null);
   const [dateStr, setDateStr] = useState("");
   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
   const [isProfileOpen, setIsProfileOpen] = useState(false);
 
   const handleLogout = () => {
     localStorage.removeItem("token");
     localStorage.removeItem("user");
     router.push("/");
   };
 
   const getInitials = (name) => {
     if (!name) return "AD";
     return name
       .split(" ")
       .map((n) => n[0])
       .join("")
       .toUpperCase();
   };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = now.getFullYear();
    setDateStr(`${day} ${month} ${year}`);
  }, []);

  return (
    <header className="h-16 md:h-20 flex items-center justify-between px-3 md:px-8 bg-brand-surface/80 backdrop-blur-xl border-b border-border sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 rounded-xl bg-brand-surface border border-border flex items-center justify-center text-main hover:bg-brand-crimson/10 transition-all duration-300 active:scale-95"
          >
            <Menu size={20} />
          </button>
        )}
        
        {/* Breadcrumbs / Title */}
        <div className="flex-1 min-w-0">
          <Breadcrumb defaultTitle={title} />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 md:gap-8">


        <div className="flex items-center gap-3">
          {/* Theme Quick Toggle */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-brand-surface border border-border/50 flex items-center justify-center transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ y: 20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={18} className="text-brand-neonblue" /> : <Moon size={18} className="text-brand-neonblue" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          
          <div className="h-6 w-px bg-border/40 mx-1 hidden md:block" />
          
          <motion.button 
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setIsNotificationsOpen(true);
            }}
            className={`relative h-10 md:h-11 rounded-xl border transition-all duration-300 shadow-sm ${
              unreadCount > 0
                ? "bg-brand-surface border-brand-crimson/30 shadow-[0_8px_20px_rgba(10,65,116,0.1)]"
                : "bg-brand-surface border-border/50 hover:border-brand-crimson/20"
            } ${isMobile ? "w-10" : "px-4"}`}
            title={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
          >
            <div className={`relative flex items-center justify-center ${isMobile ? "w-full" : "gap-3"}`}>
              <div className="relative flex items-center justify-center">
                {unreadCount > 0 && (
                  <span className="absolute inset-[-4px] rounded-full border border-brand-crimson/20 animate-ping" />
                )}
                <Bell size={18} className={`${unreadCount > 0 ? "text-brand-crimson" : "text-muted/60"}`} />
              </div>
              {!isMobile && (
                <div className="hidden md:flex flex-col items-start leading-none">
                  <span className="text-[8px] font-black uppercase tracking-[1px] text-main/30">
                    System
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-[1px] ${unreadCount > 0 ? "text-main" : "text-main/20"}`}>
                    {unreadCount > 0 ? `${unreadCount} alerts` : "No Alerts"}
                  </span>
                </div>
              )}
            </div>
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 pr-2 py-1 md:py-1.5 bg-brand-surface border border-border rounded-xl hover:bg-brand-muted/5 transition-all duration-300 group shadow-sm"
            >
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-tr from-brand-crimson to-brand-neonpurple flex items-center justify-center text-[9px] md:text-[10px] font-black text-main shadow-lg">
                {getInitials(user?.name)}
              </div>
              <ChevronDown size={12} className={`text-muted group-hover:text-main transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-brand-surface border border-border rounded-2xl p-2 shadow-2xl backdrop-blur-3xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border mb-2 text-main">
                    <p className="text-[12px] font-black truncate">{user?.name || "Administrator"}</p>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest">{user?.role || "Admin"}</p>
                  </div>
                  <button 
                    onClick={() => { setIsProfileOpen(false); router.push("/profile"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-black text-main/60 hover:text-main hover:bg-white/5 rounded-xl transition-all duration-300 group"
                  >
                    <User size={16} className="text-main/40 group-hover:text-brand-neonblue" />
                    User Profile
                  </button>
                  <button 
                    onClick={() => { setIsProfileOpen(false); router.push("/settings"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-black text-main/60 hover:text-main hover:bg-white/5 rounded-xl transition-all duration-300 group"
                  >
                    <SettingsIcon size={16} className="text-main/40 group-hover:text-brand-neonpurple" />
                    System Settings
                  </button>
                  <div className="h-px bg-border my-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold text-brand-crimson hover:bg-brand-crimson/10 rounded-xl transition-all duration-300"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </header>
  );
};

export default TopBar;
