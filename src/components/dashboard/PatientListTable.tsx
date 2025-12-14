"use client";

import { PatientService } from "@/services/patientService";
import type { Demande, Patient } from "@/types/demande";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

interface PatientListTableProps {
  demandes: Demande[];
  onPatientSelect: (patient: Patient) => void;
}

type SortField = "nom" | "age" | "lastVisit" | "totalVisits";
type SortOrder = "asc" | "desc";

// Composant SortIcon défini en dehors du composant pour éviter les erreurs
function SortIcon({
  field,
  currentSortField,
  currentSortOrder,
}: {
  field: SortField;
  currentSortField: SortField;
  currentSortOrder: SortOrder;
}) {
  if (currentSortField !== field) return null;
  return currentSortOrder === "asc" ? (
    <ChevronUp className="w-4 h-4" />
  ) : (
    <ChevronDown className="w-4 h-4" />
  );
}

export function PatientListTable({
  demandes,
  onPatientSelect,
}: PatientListTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("nom");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Extraire les patients uniques
  const patients = useMemo(() => {
    return PatientService.extractPatientsFromDemandes(demandes);
  }, [demandes]);

  // Calculer les stats par patient
  const patientsWithStats = useMemo(() => {
    return patients.map((patient) => {
      const patientDemandes = demandes.filter(
        (d) => d.patient.id === patient.id
      );
      const lastDemande = patientDemandes.sort((a, b) => {
        const dateA = a.dateRdv ? new Date(a.dateRdv).getTime() : 0;
        const dateB = b.dateRdv ? new Date(b.dateRdv).getTime() : 0;
        return dateB - dateA;
      })[0];

      return {
        ...patient,
        age: PatientService.calculateAge(patient.dateNaissance),
        totalVisits: patientDemandes.length,
        lastVisit: lastDemande?.dateRdv || null,
        lastSoin: lastDemande?.typeSoin || null,
      };
    });
  }, [patients, demandes]);

  // Filtrer et trier
  const filteredPatients = useMemo(() => {
    let result = patientsWithStats;

    // Filtre de recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nom.toLowerCase().includes(query) ||
          p.prenom.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query) ||
          p.telephone.includes(query)
      );
    }

    // Tri
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "nom":
          comparison = `${a.nom} ${a.prenom}`.localeCompare(
            `${b.nom} ${b.prenom}`
          );
          break;
        case "age":
          comparison = a.age - b.age;
          break;
        case "lastVisit":
          const dateA = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
          const dateB = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case "totalVisits":
          comparison = a.totalVisits - b.totalVisits;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [patientsWithStats, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    onPatientSelect(patient);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#1E211E] mb-2">
            Patients
          </h1>
          <p className="text-base text-[#6b6b6b]">
            {filteredPatients.length} patient
            {filteredPatients.length > 1 ? "s" : ""} enregistré
            {filteredPatients.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#d5ccc0]/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#927950] focus:border-[#927950] text-[#1E211E] placeholder:text-[#6b6b6b] transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#d5ccc0]/30 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#F4E6CD]/50 border-b border-[#d5ccc0]/50 text-sm font-semibold text-[#1E211E]">
          <button
            type="button"
            onClick={() => handleSort("nom")}
            className="col-span-3 flex items-center gap-1 hover:text-[#927950] transition-colors text-left"
          >
            Patient{" "}
            <SortIcon
              field="nom"
              currentSortField={sortField}
              currentSortOrder={sortOrder}
            />
          </button>
          <button
            type="button"
            onClick={() => handleSort("age")}
            className="col-span-1 flex items-center gap-1 hover:text-[#927950] transition-colors"
          >
            Âge{" "}
            <SortIcon
              field="age"
              currentSortField={sortField}
              currentSortOrder={sortOrder}
            />
          </button>
          <div className="col-span-3">Contact</div>
          <button
            type="button"
            onClick={() => handleSort("lastVisit")}
            className="col-span-2 flex items-center gap-1 hover:text-[#927950] transition-colors"
          >
            Dernière visite{" "}
            <SortIcon
              field="lastVisit"
              currentSortField={sortField}
              currentSortOrder={sortOrder}
            />
          </button>
          <button
            type="button"
            onClick={() => handleSort("totalVisits")}
            className="col-span-2 flex items-center gap-1 hover:text-[#927950] transition-colors"
          >
            Visites{" "}
            <SortIcon
              field="totalVisits"
              currentSortField={sortField}
              currentSortOrder={sortOrder}
            />
          </button>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#d5ccc0]/30">
          <AnimatePresence>
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => handlePatientClick(patient)}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 cursor-pointer transition-all duration-200 hover:bg-[#F4E6CD]/50 ${
                  selectedPatient?.id === patient.id
                    ? "bg-[#927950]/10 border-l-4 border-[#927950]"
                    : ""
                }`}
              >
                {/* Patient Info */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#927950]/10 flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-sm font-bold text-[#927950]">
                      {patient.prenom[0]}
                      {patient.nom[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1E211E] truncate">
                      {patient.prenom} {patient.nom}
                    </p>
                    <p className="text-sm text-[#6b6b6b] md:hidden">
                      {patient.age} ans
                    </p>
                  </div>
                </div>

                {/* Age */}
                <div className="hidden md:flex md:col-span-1 items-center text-[#1E211E]">
                  {patient.age} ans
                </div>

                {/* Contact */}
                <div className="md:col-span-3 space-y-1.5">
                  {patient.telephone && (
                    <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span className="truncate">{patient.telephone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  )}
                </div>

                {/* Last Visit */}
                <div className="hidden md:flex md:col-span-2 items-center text-sm">
                  {patient.lastVisit ? (
                    <div>
                      <p className="text-[#1E211E]">
                        {new Date(patient.lastVisit).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                      <p className="text-[#6b6b6b] text-xs">
                        {patient.lastSoin}
                      </p>
                    </div>
                  ) : (
                    <span className="text-[#6b6b6b]">—</span>
                  )}
                </div>

                {/* Total Visits */}
                <div className="hidden md:flex md:col-span-2 items-center">
                  <span className="px-3 py-1.5 bg-[#927950]/10 text-[#927950] rounded-full text-sm font-semibold border border-[#927950]/20">
                    {patient.totalVisits} visite
                    {patient.totalVisits > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Actions */}
                <div className="hidden md:flex md:col-span-1 items-center justify-end">
                  <button
                    type="button"
                    className="p-2 hover:bg-[#927950]/10 rounded-lg transition-colors text-[#927950] hover:text-[#927950]"
                    aria-label="Voir le patient"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F4E6CD] flex items-center justify-center">
              <User className="w-8 h-8 text-[#927950] opacity-60" />
            </div>
            <p className="font-medium text-[#1E211E] mb-1">
              {searchQuery
                ? "Aucun patient trouvé"
                : "Aucun patient enregistré"}
            </p>
            {searchQuery && (
              <p className="text-sm text-[#6b6b6b] mt-1">
                Essayez avec d&apos;autres mots-clés
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
