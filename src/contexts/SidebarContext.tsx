"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobileMenu: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
  }, []);

  const setMobileMenuOpen = useCallback((open: boolean) => {
    setIsMobileMenuOpen(open);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileMenuOpen,
        toggleCollapsed,
        toggleMobileMenu,
        setCollapsed,
        setMobileMenuOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
