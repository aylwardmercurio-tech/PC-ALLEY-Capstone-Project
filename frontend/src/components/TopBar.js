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
    <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-brand-navy/80 backdrop-blur-xl border-b border-border sticky top-0 z-40 transition-colors duration-300">
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
        
        {/* Breadcrumbs / Title - Shorter on mobile */}
        <div className={isMobile ? "max-w-[150px] truncate" : ""}>
          <Breadcrumb defaultTitle={title} />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-8">
        {/* Search Bar - Hidden on small mobile, shown on md+ */}
        <div className="relative group hidden lg:block">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-neonblue transition-all duration-300">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search System Core..."
            className="w-64 xl:w-80 bg-brand-surface/50 border border-border rounded-xl py-2.5 pl-5 pr-12 text-[12px] text-main placeholder:text-muted/40 focus:outline-none focus:border-brand-neonblue/30 focus:ring-1 focus:ring-brand-neonblue/10 transition-all duration-300 font-bold tracking-tight"
          />
        </div>

        {/* Theme Quick Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-brand-surface border border-border hover:border-brand-neonblue/30 flex items-center justify-center transition-all duration-300 group relative overflow-hidden shadow-sm"
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
              {theme === 'dark' ? <Sun size={18} className="text-brand-neonblue" /> : <Moon size={18} className="text-brand-blueprimary" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Global Notifications */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="h-6 w-px bg-border mx-1 hidden md:block" />
          
          <button 
            onClick={() => {
              setIsNotificationsOpen(true);
              markAllAsRead();
            }}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-brand-surface border border-border hover:border-brand-crimson/30 flex items-center justify-center relative transition-all duration-300 group"
          >
            <Bell size={18} className="text-muted group-hover:text-main" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-crimson text-[9px] font-black text-white flex items-center justify-center border-2 border-brand-bgbase shadow-[0_0_8px_rgba(215,38,56,0.5)]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

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
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest">{user?.role || "Master User"}</p>
                  </div>
                  <button 
                    onClick={() => { setIsProfileOpen(false); router.push("/profile"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold text-muted hover:text-main hover:bg-brand-muted/5 rounded-xl transition-all duration-300 group"
                  >
                    <User size={16} className="text-muted group-hover:text-brand-neonblue" />
                    User Profile
                  </button>
                  <button 
                    onClick={() => { setIsProfileOpen(false); router.push("/settings"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold text-muted hover:text-main hover:bg-brand-muted/5 rounded-xl transition-all duration-300 group"
                  >
                    <SettingsIcon size={16} className="text-muted group-hover:text-brand-neonpurple" />
                    System Settings
                  </button>
                  <div className="h-px bg-border my-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-bold text-brand-crimson hover:bg-brand-crimson/10 rounded-xl transition-all duration-300"
                  >
                    <LogOut size={16} />
                    System Logout
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
