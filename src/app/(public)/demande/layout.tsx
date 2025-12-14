"use client";

import { RecapSidebar } from "@/components/demande/RecapSidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useDemandeStore } from "@/stores/demandeStore";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DemandeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentStep, resetForm, prevStep, goToStep, isStepValid, formData } =
    useDemandeStore();

  // Calculer le nombre d'étapes validées
  // Correspondance store vs routes :
  // - Étape 1 (Soins) = isStepValid(1) dans le store
  // - Étape 2 (Ordonnance) = seulement si l'utilisateur est passé par cette étape (currentStep >= 3) ou l'a remplie
  // - Étape 3 (Disponibilités) = isStepValid(4) dans le store
  // - Étape 4 (Patient) = isStepValid(2) dans le store
  const getCompletedStepsCount = (): number => {
    let count = 0;
    if (isStepValid(1)) count++; // Soins (étape 1)

    // Ordonnance (étape 2) - seulement si l'utilisateur est passé par cette étape ou l'a remplie
    // L'ordonnance est optionnelle, donc on la compte seulement si currentStep >= 3 (passé par cette étape)
    // ou si l'utilisateur a rempli quelque chose dans l'ordonnance
    const hasVisitedOrdonnance = currentStep >= 3;
    const hasFilledOrdonnance =
      formData.ordonnance &&
      (formData.ordonnance.choice !== undefined ||
        formData.ordonnance.url !== undefined ||
        formData.ordonnance.nom !== undefined);
    if (hasVisitedOrdonnance || hasFilledOrdonnance) count++;

    if (isStepValid(4)) count++; // Disponibilités (étape 3)
    if (isStepValid(2)) count++; // Patient (étape 4)
    return count;
  };

  const completedSteps = getCompletedStepsCount();

  // Fonction pour obtenir la route de l'étape précédente
  const getPreviousStepRoute = (step: number): string => {
    const stepRoutes: Record<number, string> = {
      1: "/demande/soins",
      2: "/demande/soins",
      3: "/demande/ordonnance",
      4: "/demande/disponibilites",
      5: "/demande/patient",
    };
    return stepRoutes[step] || "/demande/soins";
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      prevStep();
      const previousStep = currentStep - 1;
      goToStep(previousStep);
      router.push(getPreviousStepRoute(currentStep));
    }
  };

  const handleResetForm = () => {
    resetForm();
    goToStep(1);
    router.push("/demande/soins");
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1a1a1a]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-12 py-8 pt-24 md:pt-28">
        {/* Steps info avec barre de progression */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-[#1a1a1a]/70 font-medium">
              {completedSteps > 0 ? (
                <>
                  {completedSteps} étape{completedSteps > 1 ? "s" : ""} complète
                  {completedSteps > 1 ? "s" : ""}
                </>
              ) : (
                "Début de la demande"
              )}
            </p>
            <p className="text-sm text-[#1a1a1a]/70 font-medium">
              Étape {currentStep} sur 4
            </p>
          </div>
          {/* Barre de progression */}
          <div className="w-full h-2 bg-[#E8E0D0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#927950] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${(completedSteps / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Contenu principal */}
          <div className="w-full lg:flex-[2] min-w-0">{children}</div>

          {/* Sidebar récapitulative - cachée sur mobile, visible sur desktop */}
          <div className="hidden lg:block lg:flex-[1] lg:sticky lg:top-24 max-w-md">
            {/* Bouton retour à l'étape précédente */}
            {currentStep > 1 && (
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                className="w-full mb-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à l&apos;étape précédente
              </Button>
            )}
            {/* Reset button */}
            <Button
              onClick={handleResetForm}
              variant="primary"
              className="w-full mb-4"
            >
              <RefreshCw className="w-4 h-4" />
              Recommencer la demande
            </Button>
            <RecapSidebar />
          </div>
        </div>

        {/* Sidebar récapitulative mobile - en bas sur mobile */}
        <div className="lg:hidden mt-6">
          {/* Bouton retour à l'étape précédente */}
          {currentStep > 1 && (
            <Button
              onClick={handlePreviousStep}
              variant="outline"
              className="w-full mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l&apos;étape précédente
            </Button>
          )}
          {/* Reset button */}
          <Button
            onClick={handleResetForm}
            variant="primary"
            className="w-full mb-4"
          >
            <RefreshCw className="w-4 h-4" />
            Recommencer la demande
          </Button>
          <RecapSidebar />
        </div>
      </div>
    </div>
  );
}
