import React, { useState } from 'react';
import { X, Receipt, Plus, Trash2 } from 'lucide-react';
import { Facture, Patient, ActeFacture } from '../types/clinic';
import { ClinicStorageService } from '../services/clinicStorage';

interface NewInvoiceModalProps {
  patients: Patient[];
  onClose: () => void;
  onInvoiceCreated: (facture: Facture) => void;
}

const CATALOGUE_ACTES = [
  { code: 'CS-GEN', designation: 'Consultation de Médecine Générale', prix: 10000 },
  { code: 'CS-CARDIO', designation: 'Consultation Spécialisée en Cardiologie', prix: 25000 },
  { code: 'CS-PED', designation: 'Consultation Spécialisée en Pédiatrie', prix: 15000 },
  { code: 'CS-GYN', designation: 'Consultation Gynécologique & Prénatale (CPN)', prix: 25000 },
  { code: 'LAB-TDR', designation: 'Test Rapide Paludisme (TDR) + Goutte Épaisse', prix: 5000 },
  { code: 'ECG-REP', designation: 'Électrocardiogramme standard 12 dérivations', prix: 15000 },
  { code: 'ECH-OBST', designation: 'Échographie Obstétricale & Morphologique', prix: 30000 },
  { code: 'LAB-BIO', designation: 'Bilan Biochimique (Glycémie, Créatinine, Urée)', prix: 18000 },
  { code: 'SOIN-PERF', designation: 'Soins Infirmiers & Perfusion antipyrétique', prix: 12000 },
  { code: 'HOSP-NUIT', designation: 'Nuitée d\'hospitalisation avec surveillance', prix: 45000 }
];

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  patients,
  onClose,
  onInvoiceCreated
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [selectedActes, setSelectedActes] = useState<Array<{ code: string, designation: string, quantite: number, prixUnitaire: number }>>([
    { code: CATALOGUE_ACTES[0].code, designation: CATALOGUE_ACTES[0].designation, quantite: 1, prixUnitaire: CATALOGUE_ACTES[0].prix }
  ]);
  const [notes, setNotes] = useState('');

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleAddActe = () => {
    const defaultActe = CATALOGUE_ACTES[0];
    setSelectedActes([...selectedActes, {
      code: defaultActe.code,
      designation: defaultActe.designation,
      quantite: 1,
      prixUnitaire: defaultActe.prix
    }]);
  };

  const handleRemoveActe = (index: number) => {
    setSelectedActes(selectedActes.filter((_, idx) => idx !== index));
  };

  const handleSelectPrestation = (index: number, code: string) => {
    const found = CATALOGUE_ACTES.find(a => a.code === code);
    if (!found) return;

    const updated = [...selectedActes];
    updated[index] = {
      ...updated[index],
      code: found.code,
      designation: found.designation,
      prixUnitaire: found.prix
    };
    setSelectedActes(updated);
  };

  const handleUpdateQty = (index: number, q: number) => {
    const updated = [...selectedActes];
    updated[index].quantite = Math.max(1, q);
    setSelectedActes(updated);
  };

  // Calculations
  const montantBrutTotal = selectedActes.reduce((sum, a) => sum + (a.prixUnitaire * a.quantite), 0);
  const tauxAssurance = (selectedPatient?.priseEnCharge.assure && selectedPatient.priseEnCharge.taux) ? selectedPatient.priseEnCharge.taux : 0;
  const partAssurance = Math.round((montantBrutTotal * tauxAssurance) / 100);
  const partPatient = montantBrutTotal - partAssurance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || selectedActes.length === 0) return;

    const actesFinal: ActeFacture[] = selectedActes.map((a, idx) => ({
      id: `ACT-${idx + 1}`,
      codeActe: a.code,
      designation: a.designation,
      quantite: a.quantite,
      prixUnitaireFcfa: a.prixUnitaire,
      totalFcfa: a.prixUnitaire * a.quantite
    }));

    const numFac = `FAC-WP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newFacture: Facture = {
      id: `FAC-${Date.now().toString().slice(-6)}`,
      numeroFacture: numFac,
      patientId: selectedPatient.id,
      patientNom: `${selectedPatient.nom} ${selectedPatient.prenom}`,
      dateEmission: new Date().toISOString().substring(0, 10),
      actes: actesFinal,
      montantTotalFcfa: montantBrutTotal,
      partAssuranceFcfa: partAssurance,
      tauxAssurancePourcentage: tauxAssurance,
      nomCompagnieAssurance: selectedPatient.priseEnCharge.assure ? selectedPatient.priseEnCharge.compagnie : undefined,
      partPatientFcfa: partPatient,
      montantRegleFcfa: 0,
      resteAPayerFcfa: partPatient,
      statut: 'en_attente',
      caissierNom: 'Rasmata Ilboudo',
      notes: notes || undefined
    };

    ClinicStorageService.saveFacture(newFacture);
    onInvoiceCreated(newFacture);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden">
        
        {/* Sticky Header with high contrast */}
        <div className="bg-slate-900 text-white px-6 py-4 shrink-0 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Émission d'une Facture Médicale
              </h2>
              <p className="text-xs text-slate-300">
                Calcul automatique de la prise en charge assurance et part patient en FCFA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            title="Fermer la fenêtre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="new-invoice-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-800">
          
          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Patient Facturé *
            </label>
            <select
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
              required
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nom} {p.prenom} — {p.priseEnCharge.assure ? `${p.priseEnCharge.compagnie} (${p.priseEnCharge.taux}%)` : 'Non Assuré'} ({p.quartier})
                </option>
              ))}
            </select>
          </div>

          {/* Actes list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <label className="block text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                Actes & Soins Réalisés
              </label>
              <button
                type="button"
                onClick={handleAddActe}
                className="text-xs text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une prestation</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {selectedActes.map((acte, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <select
                    value={acte.code}
                    onChange={e => handleSelectPrestation(idx, e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900"
                  >
                    {CATALOGUE_ACTES.map(cat => (
                      <option key={cat.code} value={cat.code}>
                        {cat.designation} ({cat.prix.toLocaleString('fr-FR')} F)
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-slate-500 font-medium">Qté:</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={acte.quantite}
                      onChange={e => handleUpdateQty(idx, Number(e.target.value))}
                      className="w-12 bg-white border border-slate-300 rounded-lg p-1.5 text-center font-mono font-bold"
                    />
                  </div>

                  <div className="w-24 text-right font-mono font-bold text-slate-900 shrink-0 text-sm">
                    {(acte.prixUnitaire * acte.quantite).toLocaleString('fr-FR')} F
                  </div>

                  {selectedActes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveActe(idx)}
                      className="text-rose-600 hover:text-rose-800 p-1.5 rounded hover:bg-rose-50 transition-colors"
                      title="Supprimer la ligne"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="bg-teal-50 p-4 rounded-xl border-2 border-teal-200 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-700">
              <span>Montant Brut Total des Actes :</span>
              <span className="font-bold">{montantBrutTotal.toLocaleString('fr-FR')} FCFA</span>
            </div>

            {selectedPatient?.priseEnCharge.assure && (
              <div className="flex justify-between text-teal-800 font-bold">
                <span>Part Assurance ({selectedPatient.priseEnCharge.compagnie} - {tauxAssurance}%) :</span>
                <span>- {partAssurance.toLocaleString('fr-FR')} FCFA</span>
              </div>
            )}

            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-teal-200">
              <span>Part Nette Patient à Régler :</span>
              <span className="text-teal-950 font-black">{partPatient.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">Observations / Précisions</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Facturation post-consultation cardiologie"
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 shadow-2xs"
            />
          </div>

        </form>

        {/* Sticky Footer Action Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <div className="text-xs font-mono">
            Net à régler: <strong className="text-sm font-black text-slate-900">{partPatient.toLocaleString('fr-FR')} FCFA</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-2xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="new-invoice-form"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors"
            >
              Émettre la Facture
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
