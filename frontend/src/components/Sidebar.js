"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsPanel from "./SettingsPanel";
import { useState, useEffect } from "react";

import { useLayout } from "../context/LayoutContext";

const Sidebar = () => {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isCollapsed, setIsCollapsed } = useLayout();

  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", group: "MAIN" },
    { title: "Inventory", icon: Package, path: "/inventory", group: "MAIN" },
    { title: "Products", icon: ShoppingCart, path: "/products", group: "SALES" },
    { title: "Customers", icon: Users, path: "/customers", group: "SALES" },
    { title: "Analytics", icon: BarChart3, path: "/analytics", group: "SYSTEM" },
    { title: "Admin Panel", icon: ShieldCheck, path: "/admin", group: "SYSTEM" },
  ];

  const menuGroups = ["MAIN", "SALES", "SYSTEM"];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const getRoleTheme = (role) => {
    switch (role?.toLowerCase()) {
      case 'super_admin': 
      case 'admin': return { gradient: 'from-[#D72638] to-[#BC13FE]', glow: 'shadow-[0_0_15px_rgba(215,38,56,0.3)]', border: 'border-[#D72638]' };
      case 'branch_admin':
      case 'manager': return { gradient: 'from-[#00F2FF] to-[#1B4F9B]', glow: 'shadow-[0_0_15px_rgba(0,242,255,0.3)]', border: 'border-[#00F2FF]' };
      case 'employee':
      case 'staff': return { gradient: 'from-[#FFD700] to-[#FFA500]', glow: 'shadow-[0_0_15px_rgba(255,215,0,0.3)]', border: 'border-[#FFD700]' };
      default: return { gradient: 'from-[#22c55e] to-[#166534]', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]', border: 'border-[#22c55e]' };
    }
  }

  const roleTheme = getRoleTheme(user?.role);
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : (user?.username ? user.username.substring(0, 2).toUpperCase() : 'AD');
  
  const getRoleDisplayName = (role) => {
    switch(role?.toLowerCase()) {
      case 'super_admin': return 'Super Admin';
      case 'branch_admin': return 'Branch Manager';
      case 'employee': return 'Staff Associate';
      default: return role || 'Administrator';
    }
  };

  const roleName = getRoleDisplayName(user?.role);
  const userName = user?.name || user?.username || 'Admin User';

  const isAllowed = (itemPath) => {
    if (user?.role === 'employee') {
      return !['/analytics', '/admin'].includes(itemPath);
    }
    return true;
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="fixed left-0 top-0 h-screen bg-brand-navy/80 backdrop-blur-2xl border-r border-border flex flex-col z-50 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-colors duration-300"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-4 top-8 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-crimson hover:border-brand-crimson transition-all group z-10"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Brand Section */}
        <div className={`p-8 pb-12 transition-all ${isCollapsed ? 'px-4 flex justify-center' : ''}`}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0">
              <div className="w-full h-full bg-brand-crimson rounded-sm" />
            </div>
            {!isCollapsed && (
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-rajdhani font-black text-2xl tracking-[2px] text-main"
              >
                PC AL<span className="text-main">LEY</span>
              </motion.h2>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group} className="space-y-4">
              {!isCollapsed && (
                <h3 className="px-4 text-[9px] uppercase tracking-[4px] text-muted font-black mb-2 opacity-50">
                  {group}
                </h3>
              )}
              <div className="space-y-1">
                {navItems
                  .filter((item) => item.group === group && isAllowed(item.path))
                  .map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <div key={item.path} className="relative">
                        <Link
                          href={item.path}
                          className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative ${
                            isActive
                              ? "bg-brand-surface text-main shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"
                              : "text-muted hover:text-main"
                          } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                          <div className={`p-2 rounded-lg transition-all ${
                            isActive 
                              ? 'bg-brand-crimson text-white shadow-[0_0_20px_rgba(215,38,56,0.5)]' 
                              : 'group-hover:bg-brand-surface group-hover:text-brand-neonblue'
                          }`}>
                            <item.icon size={18} />
                          </div>
                          
                          {!isCollapsed && (
                            <span className={`text-[13px] font-bold tracking-tight transition-all ${isActive ? "text-white glow-text" : ""}`}>
                              {item.title}
                            </span>
                          )}

                          {isActive && !isCollapsed && (
                            <motion.div
                              layoutId="active-indicator"
                              className="absolute left-0 w-[2px] h-6 bg-brand-crimson rounded-r-full shadow-[0_0_8px_#D72638]"
                            />
                          )}
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Settings Button */}
          <div className="pt-4 border-t border-white/5">
            <button
               onClick={() => setIsSettingsOpen(true)}
               className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-muted hover:text-brand-neonpurple ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="p-2 rounded-lg group-hover:bg-brand-surface transition-all">
                <Settings size={18} />
              </div>
              {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">Settings</span>}
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className={`p-6 mt-auto border-t border-border ${isCollapsed ? 'p-4 flex justify-center' : ''}`}>
          <div className={`${isCollapsed ? '' : 'p-4 bg-brand-surface rounded-2xl border border-border'} flex items-center gap-4 group cursor-pointer hover:bg-brand-surface transition-all ${roleTheme.glow}`}>
            <div className="relative shrink-0">
              <div className={`w-10 h-10 rounded-xl p-0.5 border ${roleTheme.border} overflow-hidden`}>
                <div className={`w-full h-full rounded-[10px] bg-gradient-to-tr ${roleTheme.gradient} flex items-center justify-center font-bold text-white text-sm`}>
                  {initials}
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-[2px] border-[#08090D]" />
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-main truncate">{userName}</p>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{roleName}</p>
              </div>
            )}
            
            {!isCollapsed && (
              <button onClick={handleLogout} className="p-2 text-muted hover:text-brand-crimson transition-colors">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Spacing for layout */}
      <motion.div 
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="flex-shrink-0"
      />

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Sidebar;
