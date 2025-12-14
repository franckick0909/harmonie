"use client";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Demande } from "@/types/demande";
import { useDraggable } from "@dnd-kit/core";

interface DemandeCardKitProps {
  demande: Demande;
  onClick: () => void;
}

const urgenceBadgeVariants = {
  FAIBLE: "success",
  NORMALE: "warning",
  ELEVEE: "info",
  URGENTE: "destructive",
} as const;

const urgenceLabels = {
  FAIBLE: "Faible",
  NORMALE: "Normale",
  ELEVEE: "Élevée",
  URGENTE: "Urgente",
};

const statutLabels = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

const statutBadgeVariants = {
  EN_ATTENTE: "warning",
  CONFIRMEE: "info",
  EN_COURS: "default",
  TERMINEE: "success",
  ANNULEE: "destructive",
} as const;

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "info";

export function DemandeCardKit({ demande, onClick }: DemandeCardKitProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: demande.id,
      data: {
        type: "demande",
        demande,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
        opacity: 0.8,
      }
    : undefined;

  const handleClick = (e: React.MouseEvent) => {
    // Ne pas ouvrir la modal si on vient de faire un drag
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick();
  };

  // Obtenir les couleurs selon le statut et l'urgence - Style plus clair comme l'image
  // Priorité : Urgence URGENTE > Statut CONFIRMEE > Autres
  const getBadgeClasses = () => {
    // Urgences prioritaires
    if (demande.urgence === "URGENTE") {
      return "bg-[#FFDCDC] text-[#1E211E] border-red-200 hover:bg-[#FFCECE] shadow-sm";
    }

    // Statut confirmé (bleu)
    if (demande.statut === "CONFIRMEE") {
      return "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 shadow-sm";
    }

    // Statut en cours (violet/pourpre)
    if (demande.statut === "EN_COURS") {
      return "bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100 shadow-sm";
    }

    // Statut terminé (vert)
    if (demande.statut === "TERMINEE") {
      return "bg-green-50 text-green-900 border-green-200 hover:bg-green-100 shadow-sm";
    }

    // Urgence élevée (bleu clair)
    if (demande.urgence === "ELEVEE") {
      return "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 shadow-sm";
    }

    // Par défaut (beige/marron)
    return "bg-[#F4E6CD]/70 text-[#1E211E] border-[#d5ccc0]/50 hover:bg-[#F4E6CD] shadow-sm";
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        touchAction: "none", // Empêche le scroll sur cet élément
      }}
      {...listeners}
      {...attributes}
      className="group relative cursor-move"
    >
      <Badge
        variant={urgenceBadgeVariants[demande.urgence] as BadgeVariant}
        onClick={handleClick}
        className={cn(
          "select-none border shadow-sm justify-center items-center flex",
          // Taille fixe pour les badges ronds (mobile/tablette) - plus petits pour permettre 6+ RDV
          "w-7 h-7 p-0",
          // Taille fixe pour les badges ovales (desktop) - hauteur fixe, largeur avec max
          "lg:w-auto lg:h-6 lg:min-h-[24px] lg:py-1 lg:px-2 lg:max-w-[200px]",
          "rounded-full",
          // Taille de texte uniforme et légèrement augmentée
          "text-[11px] leading-none",
          getBadgeClasses(),
          isDragging && "opacity-50"
        )}
      >
        <span className="font-medium text-[11px] leading-none truncate whitespace-nowrap block w-full text-center">
          <span className="lg:hidden uppercase">
            {demande.patient.prenom.charAt(0).toUpperCase()}
            {demande.patient.nom.charAt(0).toUpperCase()}
          </span>
          <span className="hidden lg:inline truncate">
            {demande.patient.prenom} {demande.patient.nom}
          </span>
        </span>
      </Badge>

      {/* Hover Card */}
      {!isDragging && (
        <div className="hidden group-hover:block absolute left-full top-0 ml-2 z-50 w-64 bg-[#F4E6CD]/05 backdrop-blur-sm border-[#d5ccc0]/20 shadow-lg rounded-lg p-3 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
          <div className="space-y-3">
            {/* Header */}
            <div>
              <h4 className="text-sm md:text-base lg:text-lg font-semibold">
                {demande.patient.prenom} {demande.patient.nom}
              </h4>
              <p className="text-xs md:text-sm text-[#9a9a9a]">
                {demande.patient.telephone || "Pas de téléphone"}
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={urgenceBadgeVariants[demande.urgence] as BadgeVariant}
                className="text-xs"
              >
                {urgenceLabels[demande.urgence]}
              </Badge>
              <Badge
                variant={statutBadgeVariants[demande.statut] as BadgeVariant}
                className="text-xs"
              >
                {statutLabels[demande.statut]}
              </Badge>
            </div>

            {/* Info */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-[#9a9a9a] min-w-[60px]">Soin:</span>
                <span className="font-medium">{demande.typeSoin}</span>
              </div>
              {demande.dateRdv && (
                <div className="flex items-start gap-2">
                  <span className="text-[#9a9a9a] min-w-[60px]">Date:</span>
                  <span>
                    {new Date(demande.dateRdv).toLocaleDateString("fr-FR")}
                    {demande.heureRdv && ` à ${demande.heureRdv}`}
                  </span>
                </div>
              )}
              {demande.lieu && (
                <div className="flex items-start gap-2">
                  <span className="text-[#9a9a9a] min-w-[60px]">Lieu:</span>
                  <span>📍 {demande.lieu}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="pt-2 border-t text-xs text-[#9a9a9a]">
              Cliquez pour voir les détails complets
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
