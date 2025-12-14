"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Home } from "lucide-react";
import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
      >
        <CheckCircle className="w-14 h-14 text-green-600" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] mb-4">
          Demande envoyée !
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Votre demande de soins a été enregistrée avec succès. Nous vous
          contacterons rapidement pour confirmer votre rendez-vous.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 max-w-md mx-auto mb-8 border border-gray-200 shadow-sm"
      >
        <h2 className="font-semibold text-[#1a1a1a] mb-4">Prochaines étapes</h2>
        <ul className="text-left space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#927950]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#927950]">1</span>
            </div>
            <p className="text-sm text-gray-600">
              Vous recevrez un email de confirmation avec les détails de votre
              demande
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#927950]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#927950]">2</span>
            </div>
            <p className="text-sm text-gray-600">
              Une infirmière vous contactera pour confirmer le rendez-vous
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#927950]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-[#927950]">3</span>
            </div>
            <p className="text-sm text-gray-600">
              Préparez votre ordonnance et carte vitale pour le jour du
              rendez-vous
            </p>
          </li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-[#1a1a1a]"
        >
          <Home className="w-5 h-5" />
          Retour à l'accueil
        </Link>
        <Link
          href="/demande/soins"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#927950] text-white rounded-xl hover:bg-[#927950]/90 transition-colors"
        >
          Nouvelle demande
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
}
