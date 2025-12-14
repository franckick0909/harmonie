"use client";

import { useDemandeStore } from "@/stores/demandeStore";
import { motion } from "framer-motion";
import { Calendar, Check, FileText, Stethoscope, User } from "lucide-react";

export function RecapSidebar() {
  const { formData, currentStep } = useDemandeStore();

  const sections = [
    {
      id: "soins",
      icon: Stethoscope,
      title: "Voulez-vous ajouter un autre soin ?",
      step: 1,
      content: formData.typeSoin || "Aucun soin sélectionné",
    },
    {
      id: "ordonnance",
      icon: FileText,
      title: "Avez-vous une ordonnance ?",
      step: 2,
      content: formData.ordonnance ? (
        <div className="flex flex-col gap-1">
          <span>
            {formData.ordonnance.nom
              ? `Document: ${formData.ordonnance.nom}`
              : formData.ordonnance.choice === "non"
              ? "Pas d'ordonnance"
              : "Ordonnance à fournir"}
          </span>
          {formData.ordonnance.medecinPrescripteur && (
            <span className="text-sm text-gray-500">
              Prescrit par: {formData.ordonnance.medecinPrescripteur}
            </span>
          )}
        </div>
      ) : (
        "Non renseigné"
      ),
    },
    {
      id: "disponibilites",
      icon: Calendar,
      title: "Où et quand souhaitez-vous faire vos soins ?",
      step: 3,
      content: formData.dateRdv
        ? `${new Date(formData.dateRdv).toLocaleDateString("fr-FR")} à ${
            formData.heureRdv || ""
          }`
        : "Non renseigné",
    },
    {
      id: "patient",
      icon: User,
      title: "Qui est le patient ?",
      step: 4,
      content:
        formData.patient.nom && formData.patient.prenom
          ? `${formData.patient.prenom} ${formData.patient.nom}`
          : "Non renseigné",
    },
  ];

  return (
    <div className="bg-[#F4E6CD] rounded-2xl shadow-lg p-6 sticky top-24">
      <h2 className="font-serif text-xl text-[#1E211E] mb-6">
        Récapitulatif de votre demande
      </h2>

      <div className="space-y-4">
        {sections.map((section, index) => {
          const isCompleted = currentStep > section.step;
          const isCurrent = currentStep === section.step;
          const isEmpty =
            section.content === "Non renseigné" ||
            section.content === "Aucun soin sélectionné";

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div
                className={`w-4 h-4 rounded-full border-2 mt-1 shrink-0 ${
                  isCompleted
                    ? "bg-[#927950] border-[#927950]"
                    : isCurrent
                    ? "border-[#927950]"
                    : "border-gray-300"
                }`}
              >
                {isCompleted && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <p className="text-base font-medium text-[#1E211E]">
                  {section.title}
                </p>
                <div
                  className={`text-base ${
                    isEmpty ? "text-gray-400 italic" : "text-[#6b6b6b]"
                  }`}
                >
                  {section.content}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tip */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-2">
          <span className="text-amber-500">💡</span>
          <p className="text-sm text-amber-800">
            <strong>Astuce :</strong> Vos informations sont sauvegardées
            automatiquement. Vous pouvez modifier chaque section à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}
