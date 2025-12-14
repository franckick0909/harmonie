"use client";

import { FormNavigation } from "@/components/demande/FormNavigation";
import { Button } from "@/components/ui/Button";
import { useDemandeStore } from "@/stores/demandeStore";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Question {
  id: string;
  label: string;
  type: "text" | "select" | "checkbox" | "textarea" | "radio" | "slider";
  options?: string[];
  required?: boolean;
  conditionalOn?: string;
  conditionalValue?: string;
  min?: number;
  max?: number;
  unit?: string;
}

interface TypeSoin {
  id: string;
  titre: string;
  questions?: Question[];
}

const typesSoins: TypeSoin[] = [
  {
    id: "pansement",
    titre: "Pansement",
    questions: [
      { id: "zone", label: "Zone du pansement", type: "text", required: true },
      {
        id: "frequence",
        label: "Fréquence",
        type: "select",
        options: ["1 fois/jour", "Tous les jours", "Autre"],
        required: true,
      },
      {
        id: "typeDePlaie",
        label: "Type de plaie",
        type: "checkbox",
        options: [
          "Plaie infectée",
          "Post-opératoire / Chirurgie",
          "Brûlure",
          "Plaie diabétique",
          "Kiste / abscès",
          "PICC line / Midline",
          "Ulcère",
          "Escarre",
          "Autre",
        ],
      },
      {
        id: "meche",
        label: "Pansement avec mèche(s)",
        type: "radio",
        options: ["Oui", "Non", "Je ne sais pas"],
        required: false,
      },
    ],
  },
  {
    id: "prisedesang",
    titre: "Prise de sang",
    questions: [
      {
        id: "type",
        label: "Type de prélèvement",
        type: "select",
        options: ["Prise de sang", "ECBU", "Autre"],
        required: true,
      },
      {
        id: "jeun",
        label: "À jeun ?",
        type: "select",
        options: ["Oui", "Non", "Je ne sais pas"],
        required: true,
      },
      {
        id: "creneau",
        label: "Créneau souhaité",
        type: "checkbox",
        options: ["6h - 7h", "7h - 8h", "8h - 9h", "9h - 10h", "10h - 12h"],
        required: false,
      },
      {
        id: "analyses",
        label: "Analyses prescrites (optionnel)",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "surveillance",
    titre: "Surveillance des constantes (tension, pouls, température...)",
  },
  {
    id: "injection",
    titre: "Injection",
    questions: [
      {
        id: "type",
        label: "Type d'injection",
        type: "select",
        options: ["Sous-cutanée", "Intramusculaire", "Intraveineuse"],
        required: true,
      },
      {
        id: "duree",
        label: "Durée du traitement",
        type: "slider",
        min: 1,
        max: 15,
        unit: "jours",
        required: true,
      },
      {
        id: "medicament",
        label: "Médicament (optionnel)",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: "agrafes",
    titre: "Ablation points de suture / agrafes",
    questions: [
      {
        id: "typeSoin",
        label: "Sélectionnez un ou plusieurs soins",
        type: "checkbox",
        options: ["Points de suture", "Agrafes"],
        required: true,
      },
      {
        id: "nombrePlus10",
        label: "Y a-t-il plus de 10 points ou agrafes à retirer ?",
        type: "select",
        options: ["Oui", "Non", "Je ne sais pas"],
        required: true,
      },
    ],
  },
  {
    id: "medicaments",
    titre: "Distribution et surveillance prise de médicaments",
    questions: [
      {
        id: "type",
        label: "Type de surveillance",
        type: "select",
        options: [
          "Distribution",
          "Surveillance de prise",
          "Prise en charge du pillulier hebdomadaire",
        ],
        required: true,
      },
      {
        id: "frequencePrincipale",
        label: "Fréquence",
        type: "radio",
        options: ["Tous les jours", "1 fois / semaine"],
        required: true,
      },
      {
        id: "frequenceJournaliere",
        label: "Combien de fois par jour ?",
        type: "radio",
        options: ["1 fois / jour", "2 fois / jour"],
        required: true,
        conditionalOn: "frequencePrincipale",
        conditionalValue: "Tous les jours",
      },
    ],
  },
  {
    id: "diabete",
    titre: "Surveillance glycémie / diabète",
    questions: [
      {
        id: "typeSoin",
        label: "Sélectionnez un ou plusieurs soins",
        type: "checkbox",
        options: ["Contrôle glycémie", "Injection d'insuline"],
        required: true,
      },
    ],
  },
  {
    id: "sonde",
    titre: "Soins de sonde / stomie",
    questions: [
      {
        id: "type",
        label: "Type",
        type: "select",
        options: ["Sonde urinaire", "Gastrostomie", "Colostomie", "Autre"],
        required: true,
      },
    ],
  },
  {
    id: "vaccination",
    titre: "Vaccination",
    questions: [
      {
        id: "dose",
        label: "Type de vaccination",
        type: "checkbox",
        options: ["Grippe", "Covid-19", "Autre"],
        required: true,
      },
    ],
  },
  {
    id: "autres",
    titre: "Autres soins",
    questions: [
      {
        id: "description",
        label: "Description du soin",
        type: "textarea",
        required: true,
      },
      {
        id: "frequence",
        label: "Fréquence souhaitée",
        type: "text",
        required: true,
      },
    ],
  },
];

export default function SoinsPage() {
  const router = useRouter();
  const { setTypeSoin, nextStep, goToStep } = useDemandeStore();
  const [selectedSoins, setSelectedSoins] = useState<string[]>([]);
  const [currentSoin, setCurrentSoin] = useState<TypeSoin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | string[]>>(
    {}
  );
  const [soinsDetails, setSoinsDetails] = useState<
    Record<string, Record<string, string | string[]>>
  >({});

  const handleCheckboxChange = useCallback(
    (soinId: string) => {
      const soin = typesSoins.find((s) => s.id === soinId);
      if (!soin) return;

      setSelectedSoins((prevSelected) => {
        if (prevSelected.includes(soinId)) {
          setSoinsDetails((prevDetails) => {
            const newSoinsDetails = { ...prevDetails };
            delete newSoinsDetails[soinId];
            return newSoinsDetails;
          });
          return prevSelected.filter((id) => id !== soinId);
        } else {
          if (soin.questions && soin.questions.length > 0) {
            setCurrentSoin(soin);
            setFormData(soinsDetails[soinId] || {});
            setIsModalOpen(true);
          }
          return [...prevSelected, soinId];
        }
      });
    },
    [soinsDetails]
  );

  const handleEditSoin = (soinId: string) => {
    const soin = typesSoins.find((s) => s.id === soinId);
    if (!soin) return;

    setCurrentSoin(soin);
    setFormData(soinsDetails[soinId] || {});
    setIsModalOpen(true);
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentSoin) {
      setSoinsDetails({
        ...soinsDetails,
        [currentSoin.id]: formData,
      });
    }

    setIsModalOpen(false);
    setCurrentSoin(null);
    setFormData({});
  };

  const handleCheckboxGroupChange = useCallback(
    (questionId: string, value: string, checked: boolean) => {
      setFormData((prevFormData) => {
        const currentValues = (prevFormData[questionId] as string[]) || [];

        if (checked) {
          return {
            ...prevFormData,
            [questionId]: [...currentValues, value],
          };
        } else {
          return {
            ...prevFormData,
            [questionId]: currentValues.filter((v) => v !== value),
          };
        }
      });
    },
    []
  );

  const handleContinue = () => {
    if (selectedSoins.length === 0) return;

    const selectedLabels = selectedSoins
      .map((id) => typesSoins.find((s) => s.id === id)?.titre)
      .filter(Boolean)
      .join(", ");

    setTypeSoin(selectedLabels);
    nextStep();
    goToStep(2);
    router.push("/demande/ordonnance");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-4">
          De quel(s) soin(s) avez-vous besoin ?
        </h1>
        <p className="text-sm text-red-600">* Champs obligatoires</p>
      </div>

      {/* Navigation en haut */}
      <div className="mb-6">
        <FormNavigation
          onNext={handleContinue}
          canGoNext={selectedSoins.length > 0}
          canGoPrevious={false}
          nextLabel="Continuer"
        />
      </div>

      {/* Checkboxes Grid */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {typesSoins.map((soin) => (
            <div
              key={soin.id}
              className={`group flex items-center justify-start p-4 rounded-lg border-2 transition-all cursor-pointer select-none ${
                selectedSoins.includes(soin.id)
                  ? "border-[#927950] bg-[#927950]/5 shadow-md"
                  : "border-gray-200 hover:border-[#927950] hover:bg-[#927950]/5"
              }`}
              onClick={() => handleCheckboxChange(soin.id)}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  selectedSoins.includes(soin.id)
                    ? "border-[#927950] bg-[#927950]"
                    : "border-gray-300"
                }`}
              >
                {selectedSoins.includes(soin.id) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="ml-3 text-sm sm:text-base font-medium text-[#1a1a1a] flex-1 leading-snug group-hover:text-[#927950]">
                {soin.titre}
              </span>
              {selectedSoins.includes(soin.id) && (
                <div className="ml-2 text-[#927950]">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section: Soins sélectionnés */}
      {selectedSoins.length > 0 && (
        <div className="bg-[#F9F7F2] rounded-lg border border-[#927950]/20 p-4 sm:p-6 mb-6">
          <h3 className="text-base font-semibold text-[#927950] mb-4">
            🔵 {selectedSoins.length} soin{selectedSoins.length > 1 ? "s" : ""}{" "}
            sélectionné{selectedSoins.length > 1 ? "s" : ""}
          </h3>

          <div className="space-y-3">
            {selectedSoins.map((soinId) => {
              const soin = typesSoins.find((s) => s.id === soinId);
              if (!soin) return null;

              return (
                <div
                  key={soinId}
                  className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between gap-2 hover:shadow-md transition-all cursor-pointer"
                  onClick={() =>
                    soin.questions &&
                    soin.questions.length > 0 &&
                    handleEditSoin(soinId)
                  }
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-[#1a1a1a] truncate">
                      {soin.titre}
                    </p>
                    {soinsDetails[soinId] && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Détails renseignés
                      </p>
                    )}
                  </div>
                  {soin.questions && soin.questions.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSoin(soinId);
                      }}
                      className="text-[#927950]"
                    >
                      Modifier
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-sm text-gray-500 mt-4">
            💡 Vous pouvez ajouter d&apos;autres soins ci-dessus
          </p>
        </div>
      )}

      {/* Modal pour les détails */}
      <AnimatePresence>
        {isModalOpen && currentSoin && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-4xl sm:w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a]">
                  {currentSoin.titre}
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                  title="Fermer"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form
                onSubmit={handleSubmitDetails}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
              >
                {currentSoin.questions?.map((question) => {
                  // Vérifier si la question a une condition
                  if (question.conditionalOn && question.conditionalValue) {
                    const conditionValue = formData[question.conditionalOn];
                    if (conditionValue !== question.conditionalValue) {
                      return null; // Ne pas afficher la question si la condition n'est pas remplie
                    }
                  }

                  return (
                    <div key={question.id} className="space-y-2">
                      <label className="block text-sm sm:text-base font-medium text-[#1a1a1a]">
                        {question.label}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {question.type === "text" && (
                        <input
                          type="text"
                          title={question.label}
                          placeholder={question.label}
                          required={question.required}
                          value={(formData[question.id] as string) || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [question.id]: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
                        />
                      )}

                      {(question.type === "select" ||
                        question.type === "checkbox") && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {question.options?.map((option) => {
                            const isSelected = (
                              (formData[question.id] as string[]) || []
                            ).includes(option);
                            return (
                              <div
                                key={option}
                                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  isSelected
                                    ? "border-[#927950] bg-[#927950]/10"
                                    : "border-gray-200 hover:border-[#927950]"
                                }`}
                                onClick={() =>
                                  handleCheckboxGroupChange(
                                    question.id,
                                    option,
                                    !isSelected
                                  )
                                }
                              >
                                <div
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "border-[#927950] bg-[#927950]"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <svg
                                      className="w-2.5 h-2.5 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span className="ml-3 text-sm text-[#1a1a1a]">
                                  {option}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {question.type === "radio" && (
                        <div
                          className={`grid grid-cols-1 sm:grid-cols-2 gap-2`}
                        >
                          {question.options?.map((option) => {
                            const isSelected = formData[question.id] === option;
                            return (
                              <div
                                key={option}
                                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  isSelected
                                    ? "border-[#927950] bg-[#927950]/10"
                                    : "border-gray-200 hover:border-[#927950]"
                                }`}
                                onClick={() => {
                                  // Réinitialiser les champs conditionnels qui dépendent de ce champ
                                  const newFormData = {
                                    ...formData,
                                    [question.id]: option,
                                  };

                                  // Trouver les questions qui dépendent de celle-ci et les réinitialiser si la valeur change
                                  currentSoin.questions?.forEach((q) => {
                                    if (
                                      q.conditionalOn === question.id &&
                                      option !== q.conditionalValue
                                    ) {
                                      delete newFormData[q.id];
                                    }
                                  });

                                  setFormData(newFormData);
                                }}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "border-[#927950]"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-[#927950]" />
                                  )}
                                </div>
                                <span className="ml-3 text-sm text-[#1a1a1a]">
                                  {option}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {question.type === "slider" && (
                        <select
                          title={question.label}
                          required={question.required}
                          value={(formData[question.id] as string) || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [question.id]: e.target.value,
                            })
                          }
                          className="w-full sm:w-2/3 md:w-1/2 p-2 sm:p-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-[#927950] focus:ring-2 focus:ring-[#927950]/20 outline-none transition-all bg-white text-gray-700 cursor-pointer"
                        >
                          <option value="">Sélectionnez la durée</option>
                          {Array.from(
                            {
                              length:
                                (question.max || 15) - (question.min || 1) + 1,
                            },
                            (_, i) => (question.min || 1) + i
                          ).map((day) => (
                            <option key={day} value={String(day)}>
                              {day} {question.unit}
                            </option>
                          ))}
                        </select>
                      )}

                      {question.type === "textarea" && (
                        <textarea
                          title={question.label}
                          placeholder={question.label}
                          required={question.required}
                          rows={3}
                          value={(formData[question.id] as string) || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [question.id]: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a] resize-none text-sm sm:text-base"
                        />
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Fermer
                  </Button>
                  <Button type="submit" variant="primary">
                    Valider
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
