import React from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { Ordonnance, Patient } from '../types/clinic';
import { CLINIC_INFO } from '../data/mockClinicData';

interface PrintableOrdonnanceProps {
  ordonnance: Ordonnance;
  patient?: Patient;
  onClose: () => void;
}

export const PrintableOrdonnance: React.FC<PrintableOrdonnanceProps> = ({
  ordonnance,
  patient,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[94vh] shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden">
        
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 shrink-0 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-teal-400 font-mono font-bold block uppercase tracking-wider">
                Ordonnance Sécurisée · {ordonnance.codeOrdonnance}
              </span>
              <h2 className="text-base font-bold text-white">
                Aperçu & Impression de l'Ordonnance
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer l'Ordonnance</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              title="Fermer la fenêtre"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL PRESCRIPTION AREA (Scrollable in modal, pristine in print) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex justify-center">
          <div className="border border-slate-300 p-8 sm:p-10 rounded-xl bg-white space-y-6 shadow-md max-w-2xl w-full print-break-inside-avoid">
            
            {/* Clinic Header */}
            <div className="flex items-start justify-between border-b-2 border-teal-800 pb-5">
              <div>
                <div className="text-xl font-black tracking-tight text-teal-900 uppercase">
                  {CLINIC_INFO.nom}
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">
                  {CLINIC_INFO.adresse} · Ouagadougou, Burkina Faso
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Tél: {CLINIC_INFO.telephone} / Urgences: {CLINIC_INFO.urgences}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Agrément MS: {CLINIC_INFO.agrementMinistere} · IFU: <strong>{CLINIC_INFO.numeroIfu}</strong>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">
                  {ordonnance.praticienNom}
                </div>
                <div className="text-xs text-teal-800 font-bold">
                  {ordonnance.praticienSpecialite}
                </div>
                <div className="text-xs text-slate-600 font-mono mt-1 font-semibold">
                  Ouagadougou, le {ordonnance.date}
                </div>
              </div>
            </div>

            {/* Title and Patient Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Patient :</span>
                <span className="text-base font-bold text-slate-900">{ordonnance.patientNom}</span>
                {patient && (
                  <div className="text-xs text-slate-600 mt-0.5 font-medium">
                    Sexe: {patient.sexe === 'M' ? 'Masculin' : 'Féminin'} · Né(e) le {patient.dateNaissance} · Résidence: {patient.quartier}
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Réf. Ordonnance :</span>
                <span className="text-xs font-mono font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 inline-block">
                  {ordonnance.codeOrdonnance}
                </span>
              </div>
            </div>

            {/* Prescription Body */}
            <div className="space-y-5 py-2">
              <h3 className="text-center font-serif text-lg font-bold text-slate-900 underline underline-offset-4 tracking-wide uppercase">
                Ordonnance Médicale
              </h3>

              <div className="space-y-4 pt-2">
                {ordonnance.medicaments.map((med, idx) => (
                  <div key={idx} className="border-b border-slate-200 pb-3.5 space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-slate-900 text-sm">
                        {idx + 1}. {med.nom} ({med.dosage})
                      </span>
                      <span className="text-slate-600 font-semibold">{med.forme}</span>
                    </div>
                    <div className="text-xs font-bold text-teal-950 font-mono">
                      Posologie : {med.posologie} · Durée : {med.duree}
                    </div>
                    {med.instructions && (
                      <div className="text-xs text-slate-600 italic">
                        Instructions : {med.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {ordonnance.instructionsGenerales && (
                <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 italic border border-slate-200">
                  <strong className="text-slate-900">Recommandations hygiéno-diététiques :</strong> {ordonnance.instructionsGenerales}
                </div>
              )}
            </div>

            {/* Signature and Verification Footer */}
            <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between">
              
              {/* QR Code Validation */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center text-slate-700 font-mono text-[9px] text-center p-1">
                  [QR CODE CERTIFIÉ]
                </div>
                <div className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
                  Ordonnance scellée numériquement par la Clinique Wend-Panga Ouagadougou. Authenticité vérifiable en pharmacie.
                </div>
              </div>

              {/* Doctor Signature & Clinic Stamp */}
              <div className="text-center">
                <div className="text-xs font-bold text-slate-800">Cachet & Signature du Médecin</div>
                <div className="w-44 h-24 border border-dashed border-slate-300 rounded-xl mt-1 flex flex-col items-center justify-center p-2 bg-slate-50/50">
                  <span className="text-[11px] font-bold text-teal-900 uppercase">Clinique Wend-Panga</span>
                  <span className="text-[10px] text-slate-600 font-semibold">{ordonnance.praticienNom}</span>
                  <span className="text-[9px] text-emerald-700 font-mono font-bold mt-1">Approuvé & Signé</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="no-print px-6 py-3.5 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-2xs"
          >
            Fermer la Fenêtre
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
        </div>

      </div>
    </div>
  );
};
