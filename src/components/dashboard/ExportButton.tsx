"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, FileText, Loader2, Printer } from "lucide-react";
import { useState } from "react";

interface ExportOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void | Promise<void>;
}

interface ExportButtonProps {
  options: ExportOption[];
  label?: string;
}

export function ExportButton({
  options,
  label = "Exporter",
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleOptionClick = async (option: ExportOption) => {
    setIsLoading(option.id);
    try {
      await option.action();
    } catch (error) {
      console.error("Erreur export:", error);
    } finally {
      setIsLoading(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#927950] text-white rounded-lg hover:bg-[#7a6443] transition-colors text-sm"
      >
        <Download className="w-4 h-4" />
        {label}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#d5ccc0]/30 z-50 overflow-hidden"
            >
              <div className="p-2">
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    disabled={isLoading !== null}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#1E211E] hover:bg-[#F9F7F2] rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading === option.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#927950]" />
                    ) : (
                      option.icon
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Composant simplifié pour un seul bouton d'export
interface SimpleExportButtonProps {
  onClick: () => void | Promise<void>;
  label?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function SimpleExportButton({
  onClick,
  label = "Exporter PDF",
  icon = <FileText className="w-4 h-4" />,
  variant = "primary",
}: SimpleExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error("Erreur export:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors";
  const variantClasses =
    variant === "primary"
      ? "bg-[#927950] text-white hover:bg-[#7a6443]"
      : "bg-white border border-[#d5ccc0] text-[#1E211E] hover:bg-[#F9F7F2]";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses} disabled:opacity-50`}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {label}
    </button>
  );
}

// Bouton d'impression
interface PrintButtonProps {
  elementId?: string;
  onClick?: () => void;
  label?: string;
}

export function PrintButton({
  elementId,
  onClick,
  label = "Imprimer",
}: PrintButtonProps) {
  const handlePrint = () => {
    if (onClick) {
      onClick();
    } else if (elementId) {
      // Import dynamique pour éviter les erreurs SSR
      import("@/services/exportService").then(({ printElement }) => {
        printElement(elementId);
      });
    } else {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d5ccc0] text-[#1E211E] rounded-lg hover:bg-[#F9F7F2] transition-colors text-sm"
    >
      <Printer className="w-4 h-4" />
      {label}
    </button>
  );
}
