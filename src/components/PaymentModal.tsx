import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  CreditCard, 
  Wallet, 
  Banknote, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { Facture, ModePaiement } from '../types/clinic';
import { ClinicStorageService } from '../services/clinicStorage';
import { CLINIC_INFO } from '../data/mockClinicData';

interface PaymentModalProps {
  facture: Facture;
  onClose: () => void;
  onPaymentSuccess: (updatedFacture: Facture) => void;
  onPrintFacture: (facture: Facture) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  facture,
  onClose,
  onPaymentSuccess,
  onPrintFacture
}) => {
  const [selectedMode, setSelectedMode] = useState<ModePaiement>('orange_money');
  const [telephonePayeur, setTelephonePayeur] = useState('+226 70 82 14 30');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'selection' | 'validation' | 'succes'>('selection');
  const [transactionRef, setTransactionRef] = useState('');
  const [updatedFactureObj, setUpdatedFactureObj] = useState<Facture | null>(null);

  const amountToPay = facture.resteAPayerFcfa > 0 ? facture.resteAPayerFcfa : facture.montantTotalFcfa;

  const handleInitiatePayment = () => {
    setIsProcessing(true);
    setPaymentStep('validation');

    // Simulate real gateway processing
    setTimeout(() => {
      let ref = '';
      if (selectedMode === 'orange_money') ref = `OM-BF-${Math.floor(1000000 + Math.random() * 9000000)}`;
      else if (selectedMode === 'moov_money') ref = `MOOV-BF-${Math.floor(1000000 + Math.random() * 9000000)}`;
      else if (selectedMode === 'wave') ref = `WAVE-BF-${Math.floor(1000000 + Math.random() * 9000000)}`;
      else if (selectedMode === 'carte_bancaire') ref = `VISA-3DS-${Math.floor(100000 + Math.random() * 900000)}`;
      else ref = `CAISSE-ESP-${Math.floor(10000 + Math.random() * 90000)}`;

      setTransactionRef(ref);

      const updated = ClinicStorageService.reglerFacture(
        facture.id,
        selectedMode,
        ref,
        'Rasmata Ilboudo (Caissière Wend-Panga)'
      );

      setIsProcessing(false);
      setPaymentStep('succes');
      if (updated) {
        setUpdatedFactureObj(updated);
        onPaymentSuccess(updated);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] shadow-2xl overflow-hidden border-2 border-slate-300 flex flex-col">
        
        {/* Modal Sticky Header */}
        <div className="bg-slate-900 text-white px-6 py-4 shrink-0 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-teal-400 font-mono font-semibold">
                Règlement Sécurisé · Facture {facture.numeroFacture}
              </div>
              <h2 className="text-base font-bold text-white">
                Portail de Caisse & Paiement
              </h2>
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

        {/* Amount to pay summary banner */}
        <div className="bg-teal-50 px-6 py-3.5 border-b-2 border-teal-200 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs text-teal-900 font-bold block">Patient : {facture.patientNom}</span>
            <span className="text-[11px] text-slate-500">Montant Net à Régler :</span>
          </div>

          <div className="text-2xl font-black font-mono text-teal-950">
            {amountToPay.toLocaleString('fr-FR')} <span className="text-sm font-bold">FCFA</span>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-800">
          
          {paymentStep === 'selection' && (
            <div className="space-y-4">
              <label className="block text-slate-900 font-bold text-sm">
                Sélectionnez le mode de paiement :
              </label>

              {/* Mode choice radio cards */}
              <div className="space-y-2.5">
                
                {/* Orange Money */}
                <div 
                  onClick={() => setSelectedMode('orange_money')}
                  className={`p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    selectedMode === 'orange_money' ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Orange Money Burkina</div>
                      <div className="text-slate-600 text-[11px]">Push USSD instantané (*144*4*6*CodeMarchand#)</div>
                    </div>
                  </div>
                  <input type="radio" checked={selectedMode === 'orange_money'} readOnly className="w-4 h-4 text-orange-600" />
                </div>

                {/* Moov Money */}
                <div 
                  onClick={() => setSelectedMode('moov_money')}
                  className={`p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    selectedMode === 'moov_money' ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Moov Money Burkina</div>
                      <div className="text-slate-600 text-[11px]">Validation par code secret (*555#)</div>
                    </div>
                  </div>
                  <input type="radio" checked={selectedMode === 'moov_money'} readOnly className="w-4 h-4 text-blue-600" />
                </div>

                {/* Wave Burkina */}
                <div 
                  onClick={() => setSelectedMode('wave')}
                  className={`p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    selectedMode === 'wave' ? 'border-sky-500 bg-sky-50/70 ring-2 ring-sky-500/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Wave Burkina Faso</div>
                      <div className="text-slate-600 text-[11px]">Paiement sans frais supplémentaires 1%</div>
                    </div>
                  </div>
                  <input type="radio" checked={selectedMode === 'wave'} readOnly className="w-4 h-4 text-sky-500" />
                </div>

                {/* Carte Bancaire */}
                <div 
                  onClick={() => setSelectedMode('carte_bancaire')}
                  className={`p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    selectedMode === 'carte_bancaire' ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-600/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Carte Bancaire Visa / Mastercard</div>
                      <div className="text-slate-600 text-[11px]">Coris Bank, UBA, Ecobank (3D-Secure)</div>
                    </div>
                  </div>
                  <input type="radio" checked={selectedMode === 'carte_bancaire'} readOnly className="w-4 h-4 text-teal-600" />
                </div>

                {/* Espèces Caisse */}
                <div 
                  onClick={() => setSelectedMode('especes')}
                  className={`p-3.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    selectedMode === 'especes' ? 'border-slate-700 bg-slate-100 ring-2 ring-slate-700/20' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-700 text-white flex items-center justify-center font-bold shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Espèces au Guichet Clinique</div>
                      <div className="text-slate-600 text-[11px]">Émission immédiate du reçu officiel avec cachet</div>
                    </div>
                  </div>
                  <input type="radio" checked={selectedMode === 'especes'} readOnly className="w-4 h-4 text-slate-700" />
                </div>

              </div>

              {/* Telephone input for Mobile Money */}
              {(selectedMode === 'orange_money' || selectedMode === 'moov_money' || selectedMode === 'wave') && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-slate-900 font-bold mb-1">
                    Numéro mobile du payeur (Burkina Faso +226) :
                  </label>
                  <input
                    type="text"
                    value={telephonePayeur}
                    onChange={(e) => setTelephonePayeur(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono text-sm font-bold text-slate-900 shadow-2xs"
                    placeholder="+226 XX XX XX XX"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Une notification Push avec le montant sera transmise sur ce téléphone pour confirmation.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleInitiatePayment}
                className="w-full py-3.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md mt-4"
              >
                <span>Confirmer et Encaisser {amountToPay.toLocaleString('fr-FR')} FCFA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {paymentStep === 'validation' && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-teal-700 animate-spin mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Communication Sécurisée avec la Passerelle {selectedMode === 'orange_money' ? 'Orange Money BF' : selectedMode === 'moov_money' ? 'Moov Money' : selectedMode === 'wave' ? 'Wave' : 'Bancaire'}...
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Envoi de la demande d'autorisation de débit sur le terminal du patient...
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 inline-block font-mono text-xs text-slate-700">
                Protocole TLS 1.3 · Chiffrement AES-256
              </div>
            </div>
          )}

          {paymentStep === 'succes' && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Paiement Confirmé avec Succès !
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  La transaction de {amountToPay.toLocaleString('fr-FR')} FCFA a été enregistrée à la caisse de la Clinique Wend-Panga.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-left font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Référence Transaction :</span>
                  <span className="font-bold text-teal-800">{transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Mode Utilisé :</span>
                  <span className="text-slate-800 font-semibold">{selectedMode.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Date & Heure :</span>
                  <span className="text-slate-800">{new Date().toISOString().replace('T', ' ').substring(0, 19)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Caissier :</span>
                  <span className="text-slate-800 font-sans">Rasmata Ilboudo</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (updatedFactureObj) onPrintFacture(updatedFactureObj);
                  }}
                  className="flex-1 py-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Imprimer le Reçu de Caisse</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-sm"
                >
                  Terminer
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
