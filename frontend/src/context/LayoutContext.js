"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LayoutContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
