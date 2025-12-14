"use client";

import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

interface FormNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  isLoading?: boolean;
}

export function FormNavigation({
  onPrevious,
  onNext,
  canGoNext = true,
  canGoPrevious = true,
  nextLabel = "Continuer",
  previousLabel = "Précédent",
  isLoading = false,
}: FormNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Bouton Précédent */}
      {onPrevious ? (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isLoading}
        >
          {previousLabel}
        </Button>
      ) : (
        <div />
      )}

      {/* Bouton Suivant */}
      {onNext && (
        <Button
          type="button"
          variant="primary"
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          isLoading={isLoading}
        >
          {nextLabel}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
