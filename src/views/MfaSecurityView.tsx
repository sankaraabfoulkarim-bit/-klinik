import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  QrCode, 
  ArrowRight,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { Patient } from '../types/clinic';
import { ClinicStorageService } from '../services/clinicStorage';

interface MfaSecurityViewProps {
  patients: Patient[];
  onRefreshData: () => void;
}

export const MfaSecurityView: React.FC<MfaSecurityViewProps> = ({
  patients,
  onRefreshData
}) => {
  // Test simulator states
  const [testMethod, setTestMethod] = useState<'sms_otp' | 'authenticator'>('sms_otp');
  const [testPhone, setTestPhone] = useState('+226 70 82 14 30');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [authStep, setAuthStep] = useState<'idle' | 'waiting_code' | 'verified' | 'failed'>('idle');
  const [totpCountdown, setTotpCountdown] = useState(24);
  const [currentTotpCode, setCurrentTotpCode] = useState('841 902');

  // TOTP countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTotpCountdown((prev) => {
        if (prev <= 1) {
          setCurrentTotpCode(`${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setAuthStep('waiting_code');
    setEnteredOtp('');

    // Log the MFA event in RGPD audit
    ClinicStorageService.logAudit({
      action: 'CONNEXION_MFA',
      details: `Envoi d'un code SMS OTP à 6 chiffres vers ${testPhone} pour sécurisation d'accès patient`,
      utilisateurNom: 'Système Auth Wend-Panga',
      roleUtilisateur: 'admin'
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (testMethod === 'sms_otp') {
      if (enteredOtp.trim() === generatedOtp) {
        setAuthStep('verified');
      } else {
        setAuthStep('failed');
      }
    } else {
      // Authenticator app
      if (enteredOtp.replace(/\s+/g, '') === currentTotpCode.replace(/\s+/g, '')) {
        setAuthStep('verified');
      } else {
        setAuthStep('failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-teal-700" />
            <span>Sécurité & Authentification Multifacteur (MFA / 2FA)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Protection renforcée des dossiers médicaux et du portail d'accès patient par SMS OTP (+226) ou TOTP
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>MFA Obligatoire sur tous les accès</span>
        </div>
      </div>

      {/* MFA Method Selection & Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Method 1: SMS OTP */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">SMS OTP Télécom (+226)</div>
              <div className="text-xs text-slate-500">Pour les patients au Burkina Faso</div>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            À chaque connexion sur l'espace patient ou demande d'accès aux résultats d'examens, un code temporaire à usage unique à 6 chiffres est instantanément transmis par SMS via Orange Burkina ou Moov Africa.
          </p>
          <div className="text-[11px] text-teal-800 font-medium flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Compatible avec tous les téléphones (smartphones et téléphones basiques)</span>
          </div>
        </div>

        {/* Method 2: TOTP Authenticator */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Applications d'Authentification (TOTP)</div>
              <div className="text-xs text-slate-500">Pour le personnel soignant et médecins</div>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard universel RFC 6238 compatible Google Authenticator, Microsoft Authenticator et FreeOTP. Génération locale d'un jeton tournant toutes les 30 secondes sans dépendre du réseau cellulaire.
          </p>
          <div className="text-[11px] text-purple-800 font-medium flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Sécurité maximale contre le phishing et le SIM-swapping</span>
          </div>
        </div>

      </div>

      {/* Interactive 2FA / MFA Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Simulateur Interactif de Contrôle d'Accès Sécurisé</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Testez en direct le flux d'authentification double facteur tel qu'il est présenté à un patient ou soignant
          </p>
        </div>

        <div className="max-w-md mx-auto bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
          
          {/* Method toggle */}
          <div className="flex items-center p-1 bg-slate-200/70 rounded-lg text-xs font-semibold">
            <button
              onClick={() => { setTestMethod('sms_otp'); setAuthStep('idle'); }}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                testMethod === 'sms_otp' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Test SMS OTP (+226)
            </button>
            <button
              onClick={() => { setTestMethod('authenticator'); setAuthStep('waiting_code'); }}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                testMethod === 'authenticator' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Test Authenticator App
            </button>
          </div>

          {/* Test step: SMS */}
          {testMethod === 'sms_otp' && authStep === 'idle' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Numéro de téléphone du patient :
                </label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 font-mono font-bold"
                  placeholder="+226 70 XX XX XX"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Envoyer le Code OTP par SMS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Waiting for OTP code input */}
          {authStep === 'waiting_code' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              
              {testMethod === 'sms_otp' && generatedOtp && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900">
                  <div className="font-semibold text-[11px] uppercase tracking-wider">SMS Reçu sur {testPhone} :</div>
                  <div className="text-xs mt-1">
                    "Clinique Wend-Panga: Votre code de sécurité 2FA est : <strong className="text-teal-950 font-mono text-sm tracking-widest">{generatedOtp}</strong> (Valide 10 min)"
                  </div>
                </div>
              )}

              {testMethod === 'authenticator' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 text-center">
                  <div className="font-semibold text-[11px] uppercase tracking-wider">Jeton Actuel Google Authenticator :</div>
                  <div className="text-xl font-bold font-mono tracking-widest text-purple-950 mt-1">
                    {currentTotpCode}
                  </div>
                  <div className="text-[10px] text-purple-700 mt-1 font-mono">
                    Renouvellement automatique dans {totpCountdown}s
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-center">
                  Entrez le code de vérification à 6 chiffres :
                </label>
                <input
                  type="text"
                  maxLength={7}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-full text-center text-lg font-mono font-bold tracking-widest bg-white border border-slate-300 rounded p-2"
                  placeholder={testMethod === 'sms_otp' ? generatedOtp || '123456' : currentTotpCode}
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthStep('idle')}
                  className="px-3 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
                >
                  Valider le Code 2FA
                </button>
              </div>
            </form>
          )}

          {/* Verified Result */}
          {authStep === 'verified' && (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="font-bold text-slate-900 text-sm">
                Authentification Multifacteur Réussie !
              </div>
              <p className="text-xs text-slate-600">
                Identité confirmée. Accès sécurisé au dossier médical ouvert pour une session chiffrée.
              </p>
              <button
                type="button"
                onClick={() => setAuthStep('idle')}
                className="px-4 py-1.5 text-xs text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg font-medium"
              >
                Recommencer le test
              </button>
            </div>
          )}

          {/* Failed Result */}
          {authStep === 'failed' && (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="font-bold text-rose-900 text-sm">
                Code de Vérification Invalide
              </div>
              <p className="text-xs text-rose-700">
                Le code saisi ne correspond pas. Veuillez vérifier votre SMS ou l'heure de votre téléphone.
              </p>
              <button
                type="button"
                onClick={() => setAuthStep('waiting_code')}
                className="px-4 py-1.5 text-xs text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg font-medium"
              >
                Réessayer la saisie
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Security Policies Matrix */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Politiques de Sécurité des Accès Clinique
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>Délai d'Inactivité Session</span>
            </div>
            <div className="text-slate-600 text-[11px] mt-1">
              Déconnexion automatique après 15 minutes d'inactivité sur les postes de consultation.
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Blocage Anti Brute-Force</span>
            </div>
            <div className="text-slate-600 text-[11px] mt-1">
              Verrouillage immédiat du compte après 3 échecs consécutifs et alerte à l'administrateur.
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Révocation des Accès</span>
            </div>
            <div className="text-slate-600 text-[11px] mt-1">
              Révocation instantanée des accès en cas de perte de téléphone ou changement d'affectation.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
