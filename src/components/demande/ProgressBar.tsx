"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  { number: 1, label: "Soins" },
  { number: 2, label: "Patient" },
  { number: 3, label: "Ordonnance" },
  { number: 4, label: "Disponibilités" },
  { number: 5, label: "Récapitulatif" },
  { number: 6, label: "Confirmation" },
];

export function ProgressBar({ currentStep, totalSteps = 6 }: ProgressBarProps) {
  return (
    <div className="w-full py-8">
      {/* Progress bar desktop */}
      <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.number < currentStep
                    ? "bg-[#927950] border-[#927950] text-white"
                    : step.number === currentStep
                    ? "bg-[#927950] border-[#927950] text-white scale-110"
                    : "bg-[#F4E6CD] border-[#d5ccc0] text-[#6b6b6b]"
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  step.number <= currentStep
                    ? "text-[#1E211E]"
                    : "text-[#6b6b6b]"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 relative">
                <div className="absolute inset-0 bg-border" />
                <motion.div
                  className="absolute inset-0 bg-[#927950]"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: step.number < currentStep ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#1E211E]">
            Étape {currentStep} sur {totalSteps}
          </span>
          <span className="text-sm text-[#6b6b6b]">
            {steps[currentStep - 1]?.label}
          </span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#927950]"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
