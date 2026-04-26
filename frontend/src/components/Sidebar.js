"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Users2,
  UserPlus,
  LogOut,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  ChevronDown,
  Menu,
  Download,
  Upload,
  ClipboardList,
  Mail,
  Star,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsPanel from "./SettingsPanel";
import { useState, useEffect } from "react";

import { useLayout } from "../context/LayoutContext";
import { useTheme } from "../context/ThemeContext";
import { LogoBrandingV2, LogoIcon } from "./Logo";

const Sidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState(() => {
    const initial = {};
    const paths = {
      "Contacts": ["/customers", "/customer-groups", "/import-contacts"],
      "Products": ["/products", "/reports/stock"],
      "Purchases": ["/purchases"],
      "Sell": ["/sell"],
      "Expenses": ["/expenses"],
      "Reports": ["/reports"],
      "User Management": ["/staff", "/roles"]
    };

    Object.entries(paths).forEach(([key, matches]) => {
      if (matches.some(p => pathname.startsWith(p))) {
        initial[key] = true;
      }
    });
    return initial;
  });
  const { isCollapsed, setIsCollapsed, isMobile, isSidebarOpen, setIsSidebarOpen } = useLayout();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const personnelTitle = user?.role === "super_admin" ? "Team List" : "Our Staff";

  const getNavItems = () => {
    const role = user?.role;

    // 1. STAFF / EMPLOYEE VIEW
    if (role === 'employee' || role === 'staff') {
      return [

        {
          title: "Customers", icon: Users, path: "#contacts", group: "SALES", subItems: [
            { title: "Customer List", path: "/customers" }
          ]
        },
        {
          title: "Products", icon: Package, path: "#products", group: "SALES", subItems: [
            { title: "Product List", path: "/products" },
            { title: "Manage Stock", path: "/reports/stock" }
          ]
        },
        {
          title: "Sales", icon: Upload, path: "#sell", group: "SALES", subItems: [
            { title: "All Sales", path: "/sell/all" },
            { title: "Make a Sale", path: "/sales" }
          ]
        }
      ];
    }

    // 2. SUPER ADMIN VIEW (Focused on Global Registry & Infrastructure)
    if (role === 'super_admin') {
      return [
        { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", group: "MAIN" },
        {
          title: "Customers", icon: Users, path: "#contacts", group: "SALES", subItems: [
            { title: "Customer List", path: "/customers" }
          ]
        },
        {
          title: "Products", icon: Package, path: "#products", group: "SALES", subItems: [
            { title: "Product List", path: "/products" },
            { title: "Manage Stock", path: "/reports/stock" },
            { title: "Product Bundles", path: "/products/bundles" }
          ]
        },
        {
          title: "Reports", icon: ClipboardList, path: "#reports", group: "SYSTEM", subItems: [
            { title: "Profit / Loss", path: "/reports/profit-loss" },
            { title: "Stock Activity", path: "/reports/purchase-sale" }
          ]
        },
        { title: "System Admin", icon: ShieldCheck, path: "/admin", group: "SYSTEM" },
      ];
    }

    // 3. BRANCH MANAGER VIEW (Full Operational Suite)
    return [
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", group: "MAIN" },
      {
        title: "Customers", icon: Users, path: "#contacts", group: "SALES", subItems: [
          { title: "Customer List", path: "/customers" }
        ]
      },
      {
        title: "Products", icon: Package, path: "#products", group: "SALES", subItems: [
          { title: "Product List", path: "/products" },
          { title: "Manage Stock", path: "/reports/stock" },
          { title: "Product Bundles", path: "/products/bundles" }
        ]
      },
      {
        title: "Buy Stock", icon: Download, path: "#purchases", group: "SALES", subItems: [
          { title: "Stock Purchases", path: "/purchases" },
          { title: "Order Stock", path: "/purchases/restock" }
        ]
      },
      {
        title: "Sales", icon: Upload, path: "#sell", group: "SALES", subItems: [
          { title: "All Sales", path: "/sell/all" },
          { title: "Make a Sale", path: "/sales" }
        ]
      },
      {
        title: personnelTitle, icon: UserPlus, path: "#user-management", group: "SALES", subItems: [
          { title: "Staff List", path: "/staff" }
        ]
      },
      {
        title: "Reports", icon: ClipboardList, path: "#reports", group: "SYSTEM", subItems: [
          { title: "Profit / Loss", path: "/reports/profit-loss" },
          { title: "Stock Activity", path: "/reports/purchase-sale" }
        ]
      },
    ];
  };


  const navItems = getNavItems();

  const toggleMenu = (title, e) => {
    if (e) e.preventDefault();
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const menuGroups = ["MAIN", "SALES", "SYSTEM"];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Preserve theme and other non-auth preferences
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
    const isDark = theme === 'dark';
    switch (role?.toLowerCase()) {
      case 'super_admin':
      case 'admin': return {
        color: '#D72638',
        glow: isDark ? 'shadow-[0_0_20px_rgba(10,65,116,0.3)]' : 'shadow-[0_4px_12px_rgba(10,65,116,0.15)]',
        border: 'border-[#D72638]'
      };
      case 'branch_admin':
      case 'manager': return {
        color: '#0EA5E9',
        glow: isDark ? 'shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'shadow-[0_4px_12px_rgba(14,165,233,0.15)]',
        border: 'border-[#0EA5E9]'
      };
      case 'employee':
      case 'staff': return {
        color: '#F59E0B',
        glow: isDark ? 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'shadow-[0_4px_12px_rgba(245,158,11,0.15)]',
        border: 'border-[#F59E0B]'
      };
      default: return {
        color: '#10B981',
        glow: isDark ? 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'shadow-[0_4px_12px_rgba(16,185,129,0.15)]',
        border: 'border-[#10B981]'
      };
    }
  }

  const roleTheme = getRoleTheme(user?.role);
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : (user?.username ? user.username.substring(0, 2).toUpperCase() : 'AD');

  const getRoleDisplayName = (role) => {
    switch (role?.toLowerCase()) {
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

  const sidebarWidth = isCollapsed ? 80 : 240;

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
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        animate={{
          width: isMobile ? 240 : (isCollapsed ? (isHovered ? 240 : 80) : 240),
          x: isMobile ? (isSidebarOpen ? 0 : -240) : 0
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
        className={`fixed left-0 top-0 h-screen bg-brand-surface/80 md:bg-brand-surface/90 backdrop-blur-3xl border-r border-border flex flex-col z-50 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.5)]`}
      >
        {/* Brand Header */}
        <div className="flex items-center h-20 border-b border-border shrink-0 px-5">
          <Link href="/dashboard" className="flex-1 h-[60px] flex items-center gap-3 overflow-hidden">
            {isCollapsed && !isHovered && !isMobile ? (
              <LogoIcon className="w-10 h-10 mx-auto" />
            ) : (
              <div className="flex items-center justify-start w-full h-full px-2">
                <LogoBrandingV2 size="normal" />
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          {(isCollapsed && !isHovered && !isMobile) ? (
            /* COLLAPSED: flat list, no group wrappers, no gaps */
            <div className="space-y-1 py-2">
              {navItems.filter(item => isAllowed(item.path)).map((item) => {
                const isActive = pathname === item.path || (item.subItems && item.subItems.some(sub => sub.path === pathname));
                const ItemWrapper = item.subItems ? 'button' : Link;
                return (
                  <div key={item.title} className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-2"
                    >
                      <ItemWrapper
                        href={item.subItems ? undefined : item.path}
                        onClick={item.subItems ? (e) => toggleMenu(item.title, e) : undefined}
                        className={`w-full group flex items-center justify-center py-2 rounded-xl transition-all duration-300 relative ${isActive
                            ? "bg-brand-surface/50 text-main shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                            : "text-muted hover:text-main"
                          }`}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-300 ${isActive
                            ? `text-main ${roleTheme.glow}`
                            : 'group-hover:bg-brand-surface group-hover:text-brand-neonblue'
                          }`}
                          style={isActive ? { backgroundColor: roleTheme.color } : {}}
                        >
                          <item.icon size={18} />
                        </div>
                      </ItemWrapper>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* EXPANDED: grouped layout with section labels */
            <div className="space-y-6 py-2">
              {menuGroups.map((group) => (
                <div key={group} className="space-y-1">
                  <h3 className="px-4 text-[9px] uppercase tracking-[4px] text-main font-black mb-2 opacity-30">
                    {group}
                  </h3>
                  <div className="space-y-1">
                    {navItems
                      .filter((item) => item.group === group && isAllowed(item.path))
                      .map((item) => {
                        const isActive = pathname === item.path || (item.subItems && item.subItems.some(sub => sub.path === pathname));
                        const isExpanded = openMenus[item.title];
                        const ItemWrapper = item.subItems ? 'button' : Link;

                        return (
                          <motion.div
                            key={item.title}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative"
                          >
                            <ItemWrapper
                              href={item.subItems ? undefined : item.path}
                              onClick={item.subItems ? (e) => toggleMenu(item.title, e) : undefined}
                              className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative ${isActive
                                  ? "bg-brand-surface/40 backdrop-blur-md text-main shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-white/5"
                                  : "text-muted hover:text-main hover:bg-white/5"
                                }`}
                            >
                              <div className={`p-2 rounded-lg transition-all duration-300 ${isActive
                                  ? `text-main ${roleTheme.glow}`
                                  : 'group-hover:bg-brand-surface group-hover:text-brand-neonblue'
                                }`}
                                style={isActive ? { backgroundColor: roleTheme.color } : {}}
                              >
                                <item.icon size={18} />
                              </div>

                              <div className="flex flex-1 items-center justify-between">
                                <span className={`text-[13px] font-black tracking-tight transition-all duration-300 ${isActive ? "text-main" : "text-main/50 group-hover:text-main"}`}>
                                  {item.title}
                                </span>
                                {item.subItems && (
                                  <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""} ${isActive ? "text-main" : "text-muted/40"}`}
                                  />
                                )}
                              </div>

                              {isActive && (
                                <motion.div
                                  layoutId="active-indicator"
                                  className="absolute left-0 w-[3px] h-6 rounded-r-full shadow-[0_0_12px_rgba(0,0,0,0.5)]"
                                  style={{ backgroundColor: roleTheme.color }}
                                />
                              )}
                            </ItemWrapper>

                            <AnimatePresence initial={false}>
                              {item.subItems && isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-14 pr-4 py-2 space-y-1">
                                    {item.subItems.map((sub, idx) => (
                                      <motion.div key={sub.path} whileHover={{ x: 4 }}>
                                        <Link
                                          href={sub.path}
                                          className={`block py-2 text-[12px] font-medium transition-colors ${pathname === sub.path ? "text-brand-crimson" : "text-muted hover:text-main"
                                            }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className={`w-1 h-1 rounded-full ${pathname === sub.path ? 'bg-brand-crimson shadow-[0_0_8px_#D72638]' : 'bg-muted/30'}`} />
                                            {sub.title}
                                          </div>
                                        </Link>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}


          <div className="pt-4 border-t border-border">
            <motion.button
              whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSettingsOpen(true)}
              className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-muted hover:text-brand-neonpurple ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            >
              <div className="p-2 rounded-lg group-hover:bg-brand-surface transition-all duration-300">
                <Settings size={18} />
              </div>
              {(!isCollapsed || isHovered || isMobile) && <span className="text-[13px] font-bold tracking-tight">Settings</span>}
            </motion.button>
          </div>
        </div>

        {/* Profile Section */}
        <div className={`p-6 mt-auto border-t border-border ${isCollapsed && !isMobile ? 'p-4 flex justify-center' : ''}`}>
          <div className={`${(isCollapsed && !isMobile) ? '' : 'p-4 bg-brand-surface rounded-2xl border border-border'} flex items-center gap-4 group cursor-pointer hover:bg-brand-surface transition-all duration-300 ${roleTheme.glow}`}>
            <div className="relative shrink-0">
              <div className={`w-10 h-10 rounded-xl p-0.5 border ${roleTheme.border} overflow-hidden`}>
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-bold text-main text-sm`} style={{ backgroundColor: roleTheme.color }}>
                  {initials}
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-[2px] border-brand-surface" />
            </div>

            {(!isCollapsed || isHovered || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[13px] font-black text-main truncate">{userName}</p>
                <p className="text-[10px] text-main font-black uppercase tracking-widest opacity-30">{roleName}</p>
              </motion.div>
            )}

            {(!isCollapsed || isHovered || isMobile) && (
              <button onClick={handleLogout} className="p-2 text-muted hover:text-brand-crimson transition-colors">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Spacing for layout - Stable width to prevent content shift */}
      {!isMobile && (
        <motion.div
          animate={{ width: isCollapsed ? 80 : 240 }}
          className="flex-shrink-0 transition-all duration-300"
        />
      )}

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Sidebar;
