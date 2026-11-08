import React, { useState } from 'react';
import { 
  Receipt, 
  CreditCard, 
  Plus, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Wallet, 
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Facture, ModePaiement, Patient } from '../types/clinic';
import { CLINIC_INFO } from '../data/mockClinicData';

interface BillingAndPaymentViewProps {
  factures: Facture[];
  patients: Patient[];
  onOpenPaymentModal: (facture: Facture) => void;
  onPrintFacture: (facture: Facture) => void;
  onOpenNewInvoiceModal: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const BillingAndPaymentView: React.FC<BillingAndPaymentViewProps> = ({
  factures,
  patients,
  onOpenPaymentModal,
  onPrintFacture,
  onOpenNewInvoiceModal,
  onSelectPatient
}) => {
  const [filterStatut, setFilterStatut] = useState<string>('all');

  const filteredFactures = factures.filter(f => {
    if (filterStatut !== 'all' && f.statut !== filterStatut) return false;
    return true;
  });

  const totalEmisFcfa = factures.reduce((sum, f) => sum + f.montantTotalFcfa, 0);
  const totalEncaisseFcfa = factures.filter(f => f.statut === 'payee').reduce((sum, f) => sum + f.montantRegleFcfa, 0);
  const totalEnAttenteFcfa = factures.filter(f => f.statut === 'en_attente').reduce((sum, f) => sum + f.resteAPayerFcfa, 0);
  const partAssuranceTotal = factures.reduce((sum, f) => sum + f.partAssuranceFcfa, 0);

  const getModeLabel = (mode?: ModePaiement) => {
    switch (mode) {
      case 'orange_money': return 'Orange Money BF';
      case 'moov_money': return 'Moov Money BF';
      case 'wave': return 'Wave Burkina';
      case 'carte_bancaire': return 'Carte Bancaire Visa/MC';
      case 'especes': return 'Espèces (Caisse)';
      default: return 'Non spécifié';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Caisse, Facturation & Passerelle de Paiement Sécurisé
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Encaissement immédiat par Mobile Money (Orange Money, Moov, Wave), télétransmission mutuelle et quittances officielles
          </p>
        </div>

        <button
          onClick={onOpenNewInvoiceModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Émettre une Facture</span>
        </button>
      </div>

      {/* Financial KPIs in FCFA */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Recettes Encaissées</div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700">
            {totalEncaisseFcfa.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Mobile Money & Caisse physique</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">En Attente de Règlement</div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-700">
            {totalEnAttenteFcfa.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{factures.filter(f => f.statut === 'en_attente').length} facture(s) en cours</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Tiers-Payant Assurances</div>
          <div className="mt-2 text-2xl font-bold font-mono text-teal-800">
            {partAssuranceTotal.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Télétransmis CNSS, Sonar, Coris</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Facturation Totale</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {totalEmisFcfa.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Volume d'actes cliniques</div>
        </div>
      </div>

      {/* Payment Gateway Badges */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
            Portail de Paiement Certifié CIL & BCEAO
          </div>
          <div className="text-sm font-bold text-white mt-0.5">
            Moyens de paiement acceptés à la Clinique Wend-Panga
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-orange-600/30 border border-orange-500/50 text-orange-200 font-bold flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-orange-400" />
            Orange Money BF (*144#)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-blue-600/30 border border-blue-500/50 text-blue-200 font-bold flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            Moov Money BF (*555#)
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-sky-600/30 border border-sky-500/50 text-sky-200 font-bold flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-sky-400" />
            Wave Burkina
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            Carte Bancaire Visa (3DS)
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setFilterStatut('all')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${filterStatut === 'all' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Toutes les Factures ({factures.length})
        </button>
        <button
          onClick={() => setFilterStatut('payee')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${filterStatut === 'payee' ? 'bg-emerald-100 text-emerald-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Payées ({factures.filter(f => f.statut === 'payee').length})
        </button>
        <button
          onClick={() => setFilterStatut('en_attente')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${filterStatut === 'en_attente' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          En Attente de Paiement ({factures.filter(f => f.statut === 'en_attente').length})
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Réf. Facture</th>
                <th className="py-3 px-4">Date & Patient</th>
                <th className="py-3 px-4">Désignation des Actes</th>
                <th className="py-3 px-4">Montant Total</th>
                <th className="py-3 px-4">Prise en Charge</th>
                <th className="py-3 px-4">Reste Patient</th>
                <th className="py-3 px-4">Statut & Mode</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFactures.map((facture) => (
                <tr key={facture.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Reference */}
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                    {facture.numeroFacture}
                  </td>

                  {/* Date & Patient */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSelectPatient(facture.patientId)}
                      className="font-bold text-slate-900 hover:text-teal-700 transition-colors text-left block"
                    >
                      {facture.patientNom}
                    </button>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Émise le {facture.dateEmission}
                    </div>
                  </td>

                  {/* Acts summary */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 max-w-xs">
                      {facture.actes.map((a, idx) => (
                        <div key={idx} className="text-slate-700 truncate" title={a.designation}>
                          • {a.designation} <span className="font-mono text-slate-400">({a.totalFcfa.toLocaleString('fr-FR')} F)</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {facture.montantTotalFcfa.toLocaleString('fr-FR')} FCFA
                  </td>

                  {/* Insurance coverage */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {facture.partAssuranceFcfa > 0 ? (
                      <div>
                        <div className="font-semibold text-teal-800 font-mono">
                          - {facture.partAssuranceFcfa.toLocaleString('fr-FR')} FCFA
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {facture.nomCompagnieAssurance} ({facture.tauxAssurancePourcentage}%)
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">0% (Sans mutuelle)</span>
                    )}
                  </td>

                  {/* Net to pay */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {facture.resteAPayerFcfa > 0 ? (
                      <span className="text-amber-800 font-bold">
                        {facture.resteAPayerFcfa.toLocaleString('fr-FR')} FCFA
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">
                        Réglé (0 FCFA)
                      </span>
                    )}
                  </td>

                  {/* Status & Payment Mode */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {facture.statut === 'payee' ? (
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Payée
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {getModeLabel(facture.modePaiement)}
                        </div>
                        {facture.referencePaiement && (
                          <div className="text-[9px] font-mono text-slate-400">
                            Réf: {facture.referencePaiement}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-amber-50 text-amber-800 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3 text-amber-600" />
                        En Attente
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {facture.statut === 'en_attente' && (
                        <button
                          onClick={() => onOpenPaymentModal(facture)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors shadow-2xs flex items-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Encaisser</span>
                        </button>
                      )}

                      <button
                        onClick={() => onPrintFacture(facture)}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1"
                        title="Imprimer la quittance ou facture officielle"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Quittance</span>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
