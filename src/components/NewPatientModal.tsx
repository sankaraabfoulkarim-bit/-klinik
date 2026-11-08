import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck } from 'lucide-react';
import { Patient, Sexe, GroupeSanguin } from '../types/clinic';
import { ClinicStorageService } from '../services/clinicStorage';

interface NewPatientModalProps {
  onClose: () => void;
  onPatientCreated: (patient: Patient) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  onClose,
  onPatientCreated
}) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('1990-01-01');
  const [sexe, setSexe] = useState<Sexe>('M');
  const [groupeSanguin, setGroupeSanguin] = useState<GroupeSanguin>('O+');
  const [telephone, setTelephone] = useState('+226 ');
  const [email, setEmail] = useState('');
  const [quartier, setQuartier] = useState('Ouaga 2000');
  const [profession, setProfession] = useState('');
  const [contactUrgenceNom, setContactUrgenceNom] = useState('');
  const [contactUrgenceTel, setContactUrgenceTel] = useState('+226 ');
  const [contactUrgenceLien, setContactUrgenceLien] = useState('Conjoint');
  const [allergiesText, setAllergiesText] = useState('');
  const [antecedentsText, setAntecedentsText] = useState('');

  // Insurance
  const [assure, setAssure] = useState(true);
  const [compagnie, setCompagnie] = useState<'CNSS' | 'Sonar' | 'Saham / Sanlam' | 'UAB' | 'Coris Assurances' | 'Sunu Assurances'>('Coris Assurances');
  const [taux, setTaux] = useState(80);
  const [matricule, setMatricule] = useState('');

  // RGPD Consent
  const [rgpdConsent, setRgpdConsent] = useState(true);
  const [mfaActif, setMfaActif] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim()) return;

    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newPatient: Patient = {
      id: `PAT-${Date.now().toString().slice(-6)}`,
      codePatient: `WP-OUA-2026-${codeNum}`,
      nom: nom.toUpperCase().trim(),
      prenom: prenom.trim(),
      dateNaissance,
      sexe,
      groupeSanguin,
      telephone: telephone.trim() || '+226 70 00 00 00',
      email: email.trim() || undefined,
      ville: 'Ouagadougou',
      quartier,
      profession: profession.trim() || undefined,
      contactUrgenceNom: contactUrgenceNom.trim() || 'Non spécifié',
      contactUrgenceTel: contactUrgenceTel.trim() || '+226',
      contactUrgenceLien,
      allergies: allergiesText ? allergiesText.split(',').map(s => s.trim()).filter(Boolean) : [],
      antecedentsMedicaux: antecedentsText ? antecedentsText.split(',').map(s => s.trim()).filter(Boolean) : [],
      antecedentsChirurgicaux: [],
      priseEnCharge: {
        assure,
        compagnie: assure ? compagnie : undefined,
        taux: assure ? Number(taux) : undefined,
        matricule: assure ? matricule : undefined
      },
      dateCreation: new Date().toISOString().substring(0, 10),
      mfaActif,
      mfaMethode: 'sms_otp',
      statutDossier: 'actif'
    };

    ClinicStorageService.savePatient(newPatient);
    onPatientCreated(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden">
        
        {/* Sticky Header with high contrast */}
        <div className="bg-slate-900 text-white px-6 py-4 shrink-0 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Création d'un Nouveau Dossier Patient
              </h2>
              <p className="text-xs text-slate-300">
                Enregistrement médical conforme CIL Burkina Faso · Clinique Wend-Panga Ouagadougou
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
        <form id="new-patient-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-800">
          
          {/* Section 1: État Civil */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[11px]">1</span>
              <span>État Civil & Identité du Patient</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Nom de famille *</label>
                <input
                  type="text"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Ex: OUÉDRAOGO, CONGO, SAWADOGO"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Prénom(s) *</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={e => setPrenom(e.target.value)}
                  placeholder="Ex: Fatimata, Idrissa"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-2xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Date de Naissance *</label>
                <input
                  type="date"
                  value={dateNaissance}
                  onChange={e => setDateNaissance(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Sexe biologique *</label>
                <select
                  value={sexe}
                  onChange={e => setSexe(e.target.value as Sexe)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-2xs"
                >
                  <option value="M">Masculin (Homme)</option>
                  <option value="F">Féminin (Femme)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Groupe Sanguin & Rhésus *</label>
                <select
                  value={groupeSanguin}
                  onChange={e => setGroupeSanguin(e.target.value as GroupeSanguin)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-2xs"
                >
                  <option value="O+">O Rhésus Positif (O+)</option>
                  <option value="O-">O Rhésus Négatif (O-)</option>
                  <option value="A+">A Rhésus Positif (A+)</option>
                  <option value="A-">A Rhésus Négatif (A-)</option>
                  <option value="B+">B Rhésus Positif (B+)</option>
                  <option value="B-">B Rhésus Négatif (B-)</option>
                  <option value="AB+">AB Rhésus Positif (AB+)</option>
                  <option value="AB-">AB Rhésus Négatif (AB-)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Coordonnées */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[11px]">2</span>
              <span>Coordonnées & Quartier de Résidence (Ouagadougou)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Téléphone Mobile (+226) *</label>
                <input
                  type="text"
                  value={telephone}
                  onChange={e => setTelephone(e.target.value)}
                  placeholder="+226 70 XX XX XX"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Quartier (Ouagadougou) *</label>
                <select
                  value={quartier}
                  onChange={e => setQuartier(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-2xs"
                >
                  <option value="Ouaga 2000">Ouaga 2000 (Secteur 15)</option>
                  <option value="Somgandé">Somgandé</option>
                  <option value="Gounghin">Gounghin</option>
                  <option value="Koulouba">Koulouba (Centre-ville)</option>
                  <option value="Pissy">Pissy</option>
                  <option value="Cissin">Cissin</option>
                  <option value="Patte d'Oie">Patte d'Oie</option>
                  <option value="Karpala">Karpala</option>
                  <option value="Dassasgho">Dassasgho</option>
                  <option value="Wemtenga">Wemtenga</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Profession</label>
                <input
                  type="text"
                  value={profession}
                  onChange={e => setProfession(e.target.value)}
                  placeholder="Ex: Enseignant, Commerçant"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-2xs"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Personne à Prévenir</label>
                <input
                  type="text"
                  value={contactUrgenceNom}
                  onChange={e => setContactUrgenceNom(e.target.value)}
                  placeholder="Nom & Prénom"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tél. Urgence (+226)</label>
                <input
                  type="text"
                  value={contactUrgenceTel}
                  onChange={e => setContactUrgenceTel(e.target.value)}
                  placeholder="+226 76 XX XX XX"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Lien de Parenté</label>
                <input
                  type="text"
                  value={contactUrgenceLien}
                  onChange={e => setContactUrgenceLien(e.target.value)}
                  placeholder="Époux, Frère, Mère"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Assurance & Santé */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[11px]">3</span>
              <span>Assurance Maladie & Antécédents Médicaux</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="flex items-center gap-2.5 font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assure}
                  onChange={e => setAssure(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-700"
                />
                <span>Le patient bénéficie d'une assurance maladie ou mutuelle (Tiers-Payant)</span>
              </label>

              {assure && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Compagnie / Organisme</label>
                    <select
                      value={compagnie}
                      onChange={e => setCompagnie(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold"
                    >
                      <option value="CNSS">CNSS Burkina</option>
                      <option value="Coris Assurances">Coris Assurances</option>
                      <option value="Sonar">Sonar Assurances</option>
                      <option value="Saham / Sanlam">Saham / Sanlam</option>
                      <option value="UAB">UAB Assurances</option>
                      <option value="Sunu Assurances">Sunu Assurances</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Taux Prise en Charge (%)</label>
                    <input
                      type="number"
                      value={taux}
                      onChange={e => setTaux(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">N° Matricule / Carte Assuré</label>
                    <input
                      type="text"
                      value={matricule}
                      onChange={e => setMatricule(e.target.value)}
                      placeholder="Ex: CORIS-SANTE-89421"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-rose-800 font-bold mb-1">Allergies Médicamenteuses Signalées (séparées par virgules)</label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={e => setAllergiesText(e.target.value)}
                  placeholder="Ex: Pénicilline, AINS, Sulfamides"
                  className="w-full bg-rose-50 border-2 border-rose-300 rounded-lg p-2.5 text-rose-900 font-bold shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-slate-800 font-bold mb-1">Antécédents Médicaux Notables</label>
                <input
                  type="text"
                  value={antecedentsText}
                  onChange={e => setAntecedentsText(e.target.value)}
                  placeholder="Ex: HTA essentielle, Diabète, Asthme"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Consentement CIL & Sécurité MFA */}
          <div className="p-4 rounded-xl bg-teal-50 border-2 border-teal-200 space-y-2.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rgpdConsent}
                onChange={e => setRgpdConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-teal-700"
                required
              />
              <span className="text-slate-900 text-xs leading-relaxed">
                <strong>Consentement RGPD & CIL Burkina Faso :</strong> Le patient a été informé et consent au traitement informatisé de ses données de santé pour le parcours de soins et les rappels médicaux par SMS (Loi 001-2021/AN).
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer pt-1 border-t border-teal-200/70">
              <input
                type="checkbox"
                checked={mfaActif}
                onChange={e => setMfaActif(e.target.checked)}
                className="w-4 h-4 rounded text-teal-700"
              />
              <span className="text-slate-900 text-xs font-medium">
                Activer l'Authentification Multifacteur (MFA / 2FA) par SMS OTP pour la consultation sécurisée de ses résultats.
              </span>
            </label>
          </div>

        </form>

        {/* Sticky Footer Action Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <span className="text-xs text-slate-500 hidden sm:inline">
            * Champs obligatoires · Chiffrement des données AES-256
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-2xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="new-patient-form"
              className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors"
            >
              Créer le Dossier Médical
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
