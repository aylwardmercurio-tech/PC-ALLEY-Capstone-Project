"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  UserPlus,
  LogOut,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  Download,
  Upload,
  ClipboardList,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsPanel from "./SettingsPanel";
import { useState, useEffect } from "react";

import { useLayout } from "../context/LayoutContext";

const Sidebar = () => {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState(() => {
    const initial = {};
    const paths = {
      "Contacts": ["/customers", "/customer-groups", "/import-contacts"],
      "Products": ["/products", "/inventory"],
      "Purchases": ["/purchases"],
      "Sell": ["/sell"],
      "Reports": ["/reports"]
    };
    
    Object.entries(paths).forEach(([key, matches]) => {
      if (matches.some(p => pathname.startsWith(p))) {
        initial[key] = true;
      }
    });
    return initial;
  });
  const { isCollapsed, setIsCollapsed, isMobile, isSidebarOpen, setIsSidebarOpen } = useLayout();
  const [user, setUser] = useState(null);
  const personnelTitle = user?.role === "super_admin" ? "Personnel Registry" : "Staff Registry";

  const getNavItems = () => {
    const isStaff = user?.role === 'employee' || user?.role === 'staff';

    if (isStaff) {
      return [
        { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", group: "MAIN" },
        { title: "Inventory", icon: Package, path: "/inventory", group: "MAIN" },
        { title: "Products", icon: Package, path: "/products", group: "SALES" },
        { title: "Customers", icon: Users, path: "/customers", group: "SALES" },
      ];
    }

    return [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", group: "MAIN" },
      { title: "Contacts", icon: Users, path: "#contacts", group: "SALES", subItems: [
        { title: "Customers", path: "/customers" },
        { title: "Customer Groups", path: "/customer-groups" },
        { title: "Import Contacts", path: "/import-contacts" }
      ]},
      { title: "Products", icon: Package, path: "#products", group: "SALES", subItems: [
        { title: "List Products", path: "/products" },
        { title: "Inventory Manager", path: "/inventory" },
        { title: "Dummy Product Add", path: "#dummy-product-1" }
      ]},
      { title: "Purchases", icon: Download, path: "#purchases", group: "SALES", subItems: [
        { title: "Purchase Order", path: "/purchases/orders" },
        { title: "List Purchases", path: "/purchases" },
        { title: "Add Purchase", path: "/purchases/add" },
        { title: "List Purchase Return", path: "/purchases/returns" }
      ]},
      { title: "Sell", icon: Upload, path: "#sell", group: "SALES", subItems: [
        { title: "All sales", path: "/sell/all" },
        { title: "Add Sale", path: "/sell/add" },
        { title: "List POS", path: "/sell/pos/list" },
        { title: "POS", path: "/sell/pos" },
        { title: "Add Draft", path: "/sell/drafts/add" },
        { title: "List Drafts", path: "/sell/drafts" },
        { title: "Add Quotation", path: "/sell/quotations/add" },
        { title: "List quotations", path: "/sell/quotations" },
        { title: "List Sell Return", path: "/sell/returns" },
        { title: "Shipments", path: "/sell/shipments" },
        { title: "Discounts", path: "/sell/discounts" },
        { title: "Import Sales", path: "/sell/import" }
      ]},
      { title: personnelTitle, icon: UserPlus, path: "/staff", group: "SALES" },
      { title: "Analytics", icon: BarChart3, path: "/analytics", group: "SYSTEM" },
      { title: "Reports", icon: ClipboardList, path: "#reports", group: "SYSTEM", subItems: [
        { title: "Profit / Loss Report", path: "/reports/profit-loss" },
        { title: "Purchase & Sale", path: "/reports/purchase-sale" },
        { title: "Tax Report", path: "/reports/tax" },
        { title: "Stock Report", path: "/reports/stock" },
        { title: "Trending Products", path: "/reports/trending" }
      ]},
      { title: "Notification Templates", icon: Mail, path: "#templates", group: "SYSTEM", subItems: [
        { title: "Dummy Template 1", path: "#dummy-template-1" }
      ]},
      { title: "Admin Panel", icon: ShieldCheck, path: "/admin", group: "SYSTEM" },
    ];
  };

  const navItems = getNavItems();

  const toggleMenu = (title, e) => {
    if (e) e.preventDefault();
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const menuGroups = ["MAIN", "SALES", "SYSTEM"];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // Close sidebar on navigation on mobile and auto-expand active menus
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    
    const items = getNavItems();
    setOpenMenus(prev => {
      const next = { ...prev };
      let changed = false;
      items.forEach(item => {
        if (item.subItems && item.subItems.some(sub => sub.path === pathname)) {
          if (!next[item.title]) {
            next[item.title] = true;
            changed = true;
          }
        }
      });
      return changed ? next : prev;
    });
  }, [pathname, isMobile, setIsSidebarOpen, user]);

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
      return !['/analytics', '/admin', '/staff'].includes(itemPath);
    }
    return true;
  };

  const sidebarWidth = isCollapsed ? 80 : 280;

  return (
    <>
      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? 280 : sidebarWidth,
          x: isMobile ? (isSidebarOpen ? 0 : -280) : 0 
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-screen bg-brand-navy/80 backdrop-blur-2xl border-r border-border flex flex-col z-50 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-colors duration-300`}
      >
        {/* Toggle Button - Desktop Only */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-4 top-8 w-8 h-8 rounded-lg bg-main/5 border border-border flex items-center justify-center hover:bg-brand-crimson hover:border-brand-crimson transition-all duration-300 group z-10"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}

        {/* Brand Section */}
        <div className={`p-8 pb-12 transition-all duration-300 ${isCollapsed && !isMobile ? 'px-4 flex justify-center' : ''}`}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0">
              <div className="w-full h-full bg-brand-crimson rounded-sm" />
            </div>
            {(!isCollapsed || isMobile) && (
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
              {(!isCollapsed || isMobile) && (
                <h3 className="px-4 text-[9px] uppercase tracking-[4px] text-muted font-black mb-2 opacity-50">
                  {group}
                </h3>
              )}
              <div className="space-y-1">
                {navItems
                  .filter((item) => item.group === group && isAllowed(item.path))
                  .map((item) => {
                    const isActive = pathname === item.path || (item.subItems && item.subItems.some(sub => sub.path === pathname));
                    const isExpanded = openMenus[item.title];
                    const ItemWrapper = item.subItems ? 'button' : Link;

                    return (
                      <div key={item.title} className="relative">
                        <ItemWrapper
                          href={item.subItems ? undefined : item.path}
                          onClick={item.subItems ? (e) => toggleMenu(item.title, e) : undefined}
                          className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative ${
                            isActive
                              ? "bg-brand-surface text-main shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"
                              : "text-muted hover:text-main"
                          } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                        >
                          <div className={`p-2 rounded-lg transition-all duration-300 ${
                            isActive 
                              ? 'bg-brand-crimson text-main shadow-[0_0_20px_rgba(215,38,56,0.5)]' 
                              : 'group-hover:bg-brand-surface group-hover:text-brand-neonblue'
                          }`}>
                            <item.icon size={18} />
                          </div>
                          
                          {(!isCollapsed || isMobile) && (
                            <div className="flex flex-1 items-center justify-between">
                              <span className={`text-[13px] font-bold tracking-tight transition-all duration-300 ${isActive ? "text-main glow-text" : ""}`}>
                                {item.title}
                              </span>
                              {item.subItems && (
                                <ChevronDown 
                                  size={14} 
                                  className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
                                />
                              )}
                            </div>
                          )}

                          {isActive && !isCollapsed && !isMobile && (
                            <motion.div
                              layoutId="active-indicator"
                              className="absolute left-0 w-[2px] h-6 bg-brand-crimson rounded-r-full shadow-[0_0_8px_#D72638]"
                            />
                          )}
                        </ItemWrapper>

                        <AnimatePresence initial={false}>
                          {item.subItems && isExpanded && (!isCollapsed || isMobile) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-14 pr-4 py-2 space-y-1">
                                {item.subItems.map((sub, idx) => (
                                  <Link
                                    key={idx}
                                    href={sub.path}
                                    className={`block py-2 text-[12px] font-medium transition-colors ${
                                      pathname === sub.path ? "text-brand-crimson" : "text-muted hover:text-main"
                                    }`}
                                  >
                                    {sub.title}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Settings Button */}
          <div className="pt-4 border-t border-border">
            <button
               onClick={() => setIsSettingsOpen(true)}
               className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-muted hover:text-brand-neonpurple ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            >
              <div className="p-2 rounded-lg group-hover:bg-brand-surface transition-all duration-300">
                <Settings size={18} />
              </div>
              {(!isCollapsed || isMobile) && <span className="text-[13px] font-bold tracking-tight">Settings</span>}
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className={`p-6 mt-auto border-t border-border ${isCollapsed && !isMobile ? 'p-4 flex justify-center' : ''}`}>
          <div className={`${(isCollapsed && !isMobile) ? '' : 'p-4 bg-brand-surface rounded-2xl border border-border'} flex items-center gap-4 group cursor-pointer hover:bg-brand-surface transition-all duration-300 ${roleTheme.glow}`}>
            <div className="relative shrink-0">
              <div className={`w-10 h-10 rounded-xl p-0.5 border ${roleTheme.border} overflow-hidden`}>
                <div className={`w-full h-full rounded-[10px] bg-gradient-to-tr ${roleTheme.gradient} flex items-center justify-center font-bold text-main text-sm`}>
                  {initials}
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-[2px] border-brand-surface" />
            </div>
            
            {(!isCollapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-main truncate">{userName}</p>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{roleName}</p>
              </div>
            )}
            
            {(!isCollapsed || isMobile) && (
              <button onClick={handleLogout} className="p-2 text-muted hover:text-brand-crimson transition-colors">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Spacing for layout - Hidden on Desktop if collapsed or on mobile */}
      {!isMobile && (
        <motion.div 
          animate={{ width: isCollapsed ? 80 : 280 }}
          className="flex-shrink-0"
        />
      )}

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Sidebar;
