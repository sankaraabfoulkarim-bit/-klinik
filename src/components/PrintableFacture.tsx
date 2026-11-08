import React from 'react';
import { X, Printer, Receipt } from 'lucide-react';
import { Facture } from '../types/clinic';
import { CLINIC_INFO } from '../data/mockClinicData';

interface PrintableFactureProps {
  facture: Facture;
  onClose: () => void;
}

export const PrintableFacture: React.FC<PrintableFactureProps> = ({
  facture,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[94vh] shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden">
        
        {/* Controls Header (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 shrink-0 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-teal-400 font-mono font-bold block uppercase tracking-wider">
                Quittance Officielle · {facture.numeroFacture}
              </span>
              <h2 className="text-base font-bold text-white">
                Reçu de Caisse & Facture Médicale
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le Reçu</span>
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

        {/* PRINTABLE OFFICIAL RECEIPT AREA (Scrollable in modal, pristine in print) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex justify-center">
          <div className="border border-slate-300 p-8 sm:p-10 rounded-xl bg-white space-y-6 shadow-md max-w-2xl w-full print-break-inside-avoid">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-teal-800 pb-5">
              <div>
                <div className="text-xl font-black tracking-tight text-teal-900 uppercase">
                  {CLINIC_INFO.nom}
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">
                  {CLINIC_INFO.adresse} · Ouagadougou, Burkina Faso
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Standard Caisse: {CLINIC_INFO.telephone}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  IFU: <strong>{CLINIC_INFO.numeroIfu}</strong> · RCCM: <strong>{CLINIC_INFO.rccm}</strong>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-teal-800 uppercase">
                  Facture / Quittance N°
                </div>
                <div className="text-base font-bold font-mono text-slate-900">
                  {facture.numeroFacture}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-mono font-semibold">
                  Date: {facture.dateEmission}
                </div>
              </div>
            </div>

            {/* Patient and Settlement details */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Patient :</span>
                <span className="text-base font-bold text-slate-900">{facture.patientNom}</span>
                <div className="text-xs text-slate-600 mt-1 font-medium">
                  Prise en charge : <strong className="text-slate-800">{facture.nomCompagnieAssurance || 'Plein Tarif'}</strong> {facture.tauxAssurancePourcentage > 0 ? `(${facture.tauxAssurancePourcentage}%)` : ''}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">État du Paiement :</span>
                <span className={`inline-block font-bold px-3 py-1 rounded text-xs ${
                  facture.statut === 'payee' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {facture.statut === 'payee' ? 'ACQUITTÉ / PAYÉ' : 'EN ATTENTE DE RÈGLEMENT'}
                </span>
                {facture.modePaiement && (
                  <div className="text-xs text-slate-700 mt-1.5 font-mono font-semibold">
                    Mode: {facture.modePaiement.toUpperCase()} {facture.referencePaiement ? `(${facture.referencePaiement})` : ''}
                  </div>
                )}
              </div>
            </div>

            {/* Acts Table */}
            <div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
                    <th className="py-2.5">Désignation de l'acte / Prestation</th>
                    <th className="py-2.5 text-center">Qté</th>
                    <th className="py-2.5 text-right">Prix Unitaire</th>
                    <th className="py-2.5 text-right">Montant Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-xs">
                  {facture.actes.map((acte, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-sans font-semibold text-slate-900">
                        {acte.designation} <span className="text-slate-400 text-[10px]">({acte.codeActe})</span>
                      </td>
                      <td className="py-3 text-center text-slate-800 font-bold">{acte.quantite}</td>
                      <td className="py-3 text-right text-slate-700">{acte.prixUnitaireFcfa.toLocaleString('fr-FR')} F</td>
                      <td className="py-3 text-right font-black text-slate-900">{acte.totalFcfa.toLocaleString('fr-FR')} F</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="border-t-2 border-slate-300 pt-4 flex justify-end">
              <div className="w-72 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Montant Brut Total :</span>
                  <span className="font-bold">{facture.montantTotalFcfa.toLocaleString('fr-FR')} FCFA</span>
                </div>
                
                {facture.partAssuranceFcfa > 0 && (
                  <div className="flex justify-between text-teal-800 font-bold">
                    <span>Part Mutuelle ({facture.tauxAssurancePourcentage}%) :</span>
                    <span>- {facture.partAssuranceFcfa.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t-2 border-slate-300">
                  <span>Net Payé par le Patient :</span>
                  <span className="text-teal-950 font-black">{facture.montantRegleFcfa.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>

            {/* Cashier stamp and legal mention */}
            <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between">
              <div className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
                Quittance officielle délivrée par la Caisse de la Clinique Wend-Panga Ouagadougou. Valable pour remboursement auprès des assurances santé partenaires.
              </div>

              <div className="text-center">
                <div className="text-xs font-bold text-slate-800">Cachet de Caisse & Signature</div>
                <div className="w-44 h-24 border border-dashed border-slate-300 rounded-xl mt-1 flex flex-col items-center justify-center p-2 bg-slate-50/50">
                  <span className="text-[11px] font-bold text-teal-900 uppercase">Caisse Wend-Panga</span>
                  <span className="text-[10px] text-slate-600 font-semibold">{facture.caissierNom}</span>
                  <span className="text-[9px] text-emerald-700 font-mono font-bold mt-1">MONTANT ENCAISSÉ</span>
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
