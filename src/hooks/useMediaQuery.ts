"use client";

import { useEffect, useState } from "react";

export function useBreakpoint() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024); // lg breakpoint
      setIsTablet(width >= 768 && width < 1024); // md breakpoint
      setIsMobile(width < 768); // sm breakpoint
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return { isDesktop, isTablet, isMobile };
}
