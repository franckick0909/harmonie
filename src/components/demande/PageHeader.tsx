"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  step?: number;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  step,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-[#927950]/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-[#927950]" />
        </div>
        <div>
          {step && (
            <p className="text-sm text-[#6b6b6b] uppercase tracking-wider mb-1">
              Étape {step}
            </p>
          )}
          <h1 className="font-serif text-3xl md:text-4xl text-[#1E211E]">
            {title}
          </h1>
        </div>
      </div>
      <p className="text-[#6b6b6b] text-lg max-w-2xl">{description}</p>
    </motion.div>
  );
}
