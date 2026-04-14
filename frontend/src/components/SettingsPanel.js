"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Shield,
  Bell,
  Monitor,
  Database,
  Globe,
  HelpCircle,
  Save,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const SettingsPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, toggleTheme } = useTheme();

  const [user, setUser] = useState(null);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const userName = user?.name || "Administrator";
  const userEmail = user?.email || user?.username || "admin@pcalley.system";
  const initials = userName.substring(0, 2).toUpperCase();

  const options = [
    { id: "darkMode", label: "Dark Mode Matrix", desc: "System-wide obsidian theme", active: theme === "dark" },
    { id: "glassmorphism", label: "Glassmorphism Effects", desc: "High-GPU blur rendering", active: true },
    { id: "motion", label: "Motion Dynamics", desc: "Fluid UI transitions", active: true },
    { id: "legacy", label: "Legacy Compatibility", desc: "Support for low-res monitors", active: false },
  ];

  const handleToggle = (id) => {
    if (id === "darkMode") {
      toggleTheme();
    }
  };

  const tabs = [
    { id: "profile", icon: User, label: "Admin Profile" },
    { id: "security", icon: Shield, label: "Core Security" },
    { id: "notifications", icon: Bell, label: "Alert Config" },
    { id: "system", icon: Monitor, label: "Interface" },
    { id: "database", icon: Database, label: "Database link" },
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
            className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-deep border-l border-white/5 shadow-2xl z-[101] flex flex-col font-dm-sans"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h2 className="text-xl font-rajdhani font-bold tracking-wider uppercase">System Config</h2>
                <p className="text-[10px] text-brand-muted font-bold tracking-[2px] uppercase mt-1">Terminal ID: PC-AL-001</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-crimson hover:text-white transition-all group"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-20 border-r border-white/5 py-8 flex flex-col items-center gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all relative ${
                      activeTab === tab.id ? "bg-brand-crimson text-white shadow-lg shadow-brand-crimson/20" : "text-brand-muted hover:text-white hover:bg-white/5"
                    }`}
                    title={tab.label}
                  >
                    <tab.icon size={20} />
                    {activeTab === tab.id && (
                      <motion.div layoutId="tab-indicator" className="absolute -right-[1px] w-[3px] h-6 bg-brand-crimson rounded-l-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {activeTab === "profile" && (
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-[2px] text-white">Identity Core</h3>
                        
                        <div className="flex flex-col items-center gap-4 p-6 glass-card rounded-2xl border-white/5">
                           <div className="relative group">
                              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-crimson to-red-900 border-2 border-white/10 flex items-center justify-center text-3xl font-bold shadow-2xl">
                                {initials}
                              </div>
                              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-brand-deep border border-white/10 flex items-center justify-center hover:bg-brand-crimson transition-colors shadow-lg">
                                <Globe size={14} />
                              </button>
                           </div>
                           <div className="text-center">
                              <p className="font-bold text-lg">{userName}</p>
                              <p className="text-[10px] text-brand-muted uppercase tracking-widest font-medium">Head Office · ID: {user?.id || '2284'}</p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-[#00F2FF]/20 transition-all">
                               <div>
                                  <p className="text-sm font-bold">Dark Mode Matrix</p>
                                  <p className="text-[10px] text-brand-muted uppercase tracking-widest font-medium">Toggle system aesthetic</p>
                               </div>
                               <div 
                                 onClick={toggleTheme}
                                 className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${theme === 'dark' ? "bg-brand-crimson" : "bg-white/10"}`}
                               >
                                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${theme === 'dark' ? "right-1" : "left-1"}`} />
                               </div>
                            </div>
                            <div className="group">
                               <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block mb-2 px-1">Display Name</label>
                               <input type="text" defaultValue={userName} className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-crimson/30 transition-all font-medium" />
                            </div>
                            <div className="group">
                               <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest block mb-2 px-1">Access Channel</label>
                               <input type="text" defaultValue={userEmail} className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-crimson/30 transition-all font-medium" />
                            </div>
                         </div>
                       </div>
                    )}

                    {activeTab === "system" && (
                       <div className="space-y-6">
                          <h3 className="text-sm font-bold uppercase tracking-[2px] text-white">Interface Protocol</h3>
                          
                          <div className="space-y-3">
                             {options.filter(o => o.id !== 'darkMode').map((opt, i) => (
                               <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                  <div>
                                     <p className="text-sm font-bold">{opt.label}</p>
                                     <p className="text-[10px] text-brand-muted uppercase tracking-tighter">{opt.desc}</p>
                                  </div>
                                  <div 
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${opt.active ? "bg-brand-crimson" : "bg-white/10"}`}
                                  >
                                     <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${opt.active ? "right-1" : "left-1"}`} />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {["security", "notifications", "database"].includes(activeTab) && (
                      <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
                        <HelpCircle size={48} className="mb-4 stroke-[1px]" />
                        <h4 className="text-xs uppercase tracking-[3px] font-bold">Module Locked</h4>
                        <p className="text-[10px] mt-2 font-medium">Requires L3 Authorization to configure.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
              <button className="flex items-center gap-2 text-brand-muted hover:text-brand-crim transition-colors group">
                 <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Disconnect Terminal</span>
              </button>
              <button className="h-12 px-8 bg-brand-crimson hover:bg-red-700 rounded-xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-brand-crimson/20 active:scale-[0.98]">
                <Save size={16} />
                Sync Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
