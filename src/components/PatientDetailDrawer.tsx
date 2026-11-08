import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  Stethoscope, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Printer, 
  ShieldCheck, 
  Send, 
  Download, 
  Calendar,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { 
  Patient, 
  ConstanteVitale, 
  Consultation, 
  Ordonnance, 
  DocumentMedical, 
  NotificationSuivi, 
  RappelSMS,
  MedicamentPrescription
} from '../types/clinic';
import { ClinicStorageService } from '../services/clinicStorage';
import { CLINIC_INFO } from '../data/mockClinicData';

interface PatientDetailDrawerProps {
  patient: Patient;
  onClose: () => void;
  onPrintOrdonnance: (ordonnance: Ordonnance) => void;
  onOpenNewRdv: (patient: Patient) => void;
  onRefreshData: () => void;
}

export const PatientDetailDrawer: React.FC<PatientDetailDrawerProps> = ({
  patient,
  onClose,
  onPrintOrdonnance,
  onOpenNewRdv,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'synthese' | 'constantes' | 'consultations' | 'ordonnances' | 'documents' | 'suivis' | 'rgpd'>('synthese');

  // Local data fetching for this patient
  const constantes = ClinicStorageService.getConstantes(patient.id);
  const consultations = ClinicStorageService.getConsultations(patient.id);
  const ordonnances = ClinicStorageService.getOrdonnances(patient.id);
  const documents = ClinicStorageService.getDocuments(patient.id);
  const suivis = ClinicStorageService.getSuivis().filter(s => s.patientId === patient.id);
  const smsList = ClinicStorageService.getSmsLogs().filter(s => s.patientId === patient.id);

  // Form states for new entry
  const [showAddConstante, setShowAddConstante] = useState(false);
  const [newTA, setNewTA] = useState('12/8');
  const [newPouls, setNewPouls] = useState(75);
  const [newTemp, setNewTemp] = useState(37.0);
  const [newPoids, setNewPoids] = useState(70);
  const [newTaille, setNewTaille] = useState(175);
  const [newSpo2, setNewSpo2] = useState(98);
  const [newGlycemie, setNewGlycemie] = useState(1.0);

  // Form state for new consultation
  const [showAddConsultation, setShowAddConsultation] = useState(false);
  const [consMotif, setConsMotif] = useState('');
  const [consExamen, setConsExamen] = useState('');
  const [consDiag, setConsDiag] = useState('B50.9 - Paludisme simple');
  const [consConduite, setConsConduite] = useState('');

  // Form state for quick SMS
  const [smsMessage, setSmsMessage] = useState(`Clinique Wend-Panga: Bonjour ${patient.prenom}, votre médecin vous rappelle de faire votre bilan de contrôle.`);
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  // Handle saving new vitals
  const handleSaveConstante = (e: React.FormEvent) => {
    e.preventDefault();
    const imcVal = +(newPoids / ((newTaille / 100) * (newTaille / 100))).toFixed(1);
    const nouvelleConstante: ConstanteVitale = {
      id: `CONST-${Date.now().toString().slice(-6)}`,
      patientId: patient.id,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tensionArterielle: newTA,
      frequenceCardiaque: Number(newPouls),
      temperature: Number(newTemp),
      saturationO2: Number(newSpo2),
      glycemie: Number(newGlycemie),
      poids: Number(newPoids),
      taille: Number(newTaille),
      imc: imcVal,
      agentNom: 'Infirmière K. Zongo'
    };

    ClinicStorageService.addConstante(nouvelleConstante);
    setShowAddConstante(false);
    onRefreshData();
  };

  // Handle saving new consultation
  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consMotif.trim()) return;

    const nouvelleConsultation: Consultation = {
      id: `CONS-${Date.now().toString().slice(-6)}`,
      patientId: patient.id,
      patientNom: `${patient.nom} ${patient.prenom}`,
      praticienId: 'PRAT-01',
      praticienNom: 'Dr. Salimata Ouédraogo',
      specialite: 'Médecine Interne / Cardiologie',
      date: new Date().toISOString().substring(0, 10),
      heure: new Date().toTimeString().substring(0, 5),
      motif: consMotif,
      symptomes: 'Rapportés lors de la consultation clinique',
      examenClinique: consExamen || 'Examen physique standard sans anomalie majeure.',
      diagnosticPrincipal: consDiag,
      diagnosticsSecondaires: [],
      conduiteATenir: consConduite || 'Traitement symptomatique et surveillance.',
      statut: 'cloturee'
    };

    ClinicStorageService.addConsultation(nouvelleConsultation);
    setShowAddConsultation(false);
    setConsMotif('');
    setConsExamen('');
    setConsConduite('');
    onRefreshData();
  };

  // Handle send quick SMS
  const handleSendQuickSms = () => {
    ClinicStorageService.sendSms({
      patientId: patient.id,
      patientNom: `${patient.nom} ${patient.prenom}`,
      telephone: patient.telephone,
      typeRappel: 'suivi_j3',
      message: smsMessage,
      dateProgrammee: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operateur: patient.telephone.startsWith('+226 70') ? 'Orange Burkina' : 'Moov Africa Burkina',
      coutFcfa: 25
    });

    setSmsSentNotice(true);
    setTimeout(() => setSmsSentNotice(false), 3000);
    onRefreshData();
  };

  // Handle export RGPD data
  const handleExportPatientData = () => {
    const exportBundle = {
      dossier: patient,
      constantes,
      consultations,
      ordonnances,
      documents,
      suivis,
      conformite: {
        norme: 'CIL Burkina Faso - Loi 001-2021/AN & RGPD',
        dateExport: new Date().toISOString(),
        etablissement: CLINIC_INFO.nom,
        numeroIfu: CLINIC_INFO.numeroIfu
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Dossier_Medical_${patient.codePatient}_${patient.nom}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    ClinicStorageService.logAudit({
      action: 'EXPORT_DONNEES',
      patientId: patient.id,
      patientNom: `${patient.nom} ${patient.prenom}`,
      details: 'Exportation complète du dossier médical au format JSON sécurisé (Portabilité RGPD/CIL)',
      utilisateurNom: 'Dr. Salimata Ouédraogo',
      roleUtilisateur: 'medecin'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-5xl max-h-[94vh] bg-white rounded-2xl shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden">
        
        {/* Drawer Header with Patient Summary */}
        <div className="bg-slate-900 text-white p-5 shrink-0 flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-teal-400 font-bold text-xs">
                {patient.codePatient}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                Groupe {patient.groupeSanguin}
              </span>
              {patient.priseEnCharge.assure && (
                <span className="text-xs bg-teal-900/80 text-teal-200 px-2 py-0.5 rounded font-medium">
                  {patient.priseEnCharge.compagnie} ({patient.priseEnCharge.taux}%)
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              {patient.nom} {patient.prenom}
            </h2>

            <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
              <span>{patient.sexe === 'M' ? 'Homme' : 'Femme'}</span>
              <span>·</span>
              <span>Né(e) le {patient.dateNaissance}</span>
              <span>·</span>
              <span>{patient.quartier}, Ouagadougou</span>
              <span>·</span>
              <span className="font-mono text-teal-300 font-semibold">{patient.telephone}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenNewRdv(patient)}
              className="px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-md transition-colors flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Fixer RDV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Allergy Alert Banner if any */}
        {patient.allergies.length > 0 && (
          <div className="bg-rose-50 border-b border-rose-200 px-5 py-2.5 flex items-center gap-2 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-bold">ALLERGIES MÉDICALES DÉCLARÉES :</span>
            <span className="font-semibold underline decoration-rose-400">
              {patient.allergies.join(', ')}
            </span>
            <span className="text-rose-600 ml-auto italic">Vérifier avant toute prescription</span>
          </div>
        )}

        {/* Drawer Tabs Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('synthese')}
            className={`py-3 px-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'synthese' ? 'text-teal-800 border-b-2 border-teal-700 font-bold bg-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fiche & Antécédents
          </button>
          <button
            onClick={() => setActiveTab('constantes')}
            className={`py-3 px-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'constantes' ? 'text-teal-800 border-b-2 border-teal-700 font-bold bg-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Constantes Vitales ({constantes.length})
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`py-3 px-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'consultations' ? 'text-teal-800 border-b-2 border-teal-700 font-bold bg-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Consultations ({consultations.length})
          </button>
          <button
            onClick={() => setActiveTab('ordonnances')}
            className={`py-3 px-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'ordonnances' ? 'text-teal-800 border-b-2 border-teal-700 font-bold bg-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ordonnances ({ordonnances.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'documents' ? 'text-teal-800 border-b-2 border-teal-700 font-bold bg-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Examens & Imagerie ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('suivis')}
            className={`py-3 px-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'suivis' ? 'text-teal-800 border-b-2 border-teal-700 font-bold bg-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Suivis & SMS ({suivis.length})
          </button>
          <button
            onClick={() => setActiveTab('rgpd')}
            className={`py-3 px-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'rgpd' ? 'text-teal-800 border-b-2 border-teal-700 font-bold bg-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RGPD & Droits CIL
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: SYNTHÈSE */}
          {activeTab === 'synthese' && (
            <div className="space-y-6">
              
              {/* Emergency Contact & Neighborhood */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Contact d'Urgence (Ouagadougou)
                  </h3>
                  <div className="text-sm font-bold text-slate-900">
                    {patient.contactUrgenceNom} ({patient.contactUrgenceLien})
                  </div>
                  <div className="text-xs font-mono font-medium text-teal-800 mt-1">
                    {patient.contactUrgenceTel}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Adresse: {patient.quartier}, Ouagadougou
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Prise en Charge & Tiers-Payant
                  </h3>
                  {patient.priseEnCharge.assure ? (
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {patient.priseEnCharge.compagnie} · Couverture {patient.priseEnCharge.taux}%
                      </div>
                      <div className="text-xs font-mono text-slate-600 mt-1">
                        Matricule Assuré: {patient.priseEnCharge.matricule}
                      </div>
                      <div className="text-xs text-emerald-700 font-medium mt-1">
                        Télétransmission FHIR R4 active
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic">
                      Patient en paiement direct à la caisse (Pas de prise en charge mutuelle enregistrée).
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Histories */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Antécédents Médicaux Notés
                  </h3>
                  {patient.antecedentsMedicaux.length === 0 ? (
                    <p className="text-xs text-slate-400">Aucun antécédent médical signalé.</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-800">
                      {patient.antecedentsMedicaux.map((item, idx) => (
                        <li key={idx} className="font-medium">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Antécédents Chirurgicaux
                  </h3>
                  {patient.antecedentsChirurgicaux.length === 0 ? (
                    <p className="text-xs text-slate-400">Aucune intervention chirurgicale antérieure signalée.</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-800">
                      {patient.antecedentsChirurgicaux.map((item, idx) => (
                        <li key={idx} className="font-medium">{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Latest Vitals Snapshot */}
              {constantes.length > 0 && (
                <div className="p-4 rounded-xl border border-slate-200 bg-teal-50/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700">Dernières Constantes Vitales</span>
                    <span className="text-[11px] text-slate-500 font-mono">{constantes[0].date}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[10px]">Tension Artérielle</div>
                      <div className="text-base font-bold font-mono text-slate-900">{constantes[0].tensionArterielle} cmHg</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[10px]">Température</div>
                      <div className="text-base font-bold font-mono text-slate-900">{constantes[0].temperature} °C</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[10px]">Fréq. Cardiaque</div>
                      <div className="text-base font-bold font-mono text-slate-900">{constantes[0].frequenceCardiaque} bpm</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[10px]">Poids & IMC</div>
                      <div className="text-base font-bold font-mono text-slate-900">{constantes[0].poids} kg ({constantes[0].imc})</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CONSTANTES VITALES */}
          {activeTab === 'constantes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Suivi des Constantes Physiologiques</h3>
                  <p className="text-xs text-slate-500">Mesures de tension, pouls, température et glycémie</p>
                </div>

                <button
                  onClick={() => setShowAddConstante(!showAddConstante)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Saisir Constantes</span>
                </button>
              </div>

              {/* Form to add new vitals */}
              {showAddConstante && (
                <form onSubmit={handleSaveConstante} className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-4">
                  <div className="text-xs font-bold text-teal-900">Nouvelle Prise de Constantes</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 mb-1">Tension (cmHg)</label>
                      <input 
                        type="text" 
                        value={newTA} 
                        onChange={e => setNewTA(e.target.value)} 
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                        placeholder="12/8"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Pouls (bpm)</label>
                      <input 
                        type="number" 
                        value={newPouls} 
                        onChange={e => setNewPouls(Number(e.target.value))} 
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Température (°C)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={newTemp} 
                        onChange={e => setNewTemp(Number(e.target.value))} 
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">SpO2 (%)</label>
                      <input 
                        type="number" 
                        value={newSpo2} 
                        onChange={e => setNewSpo2(Number(e.target.value))} 
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Poids (kg)</label>
                      <input 
                        type="number" 
                        step="0.5" 
                        value={newPoids} 
                        onChange={e => setNewPoids(Number(e.target.value))} 
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Taille (cm)</label>
                      <input 
                        type="number" 
                        value={newTaille} 
                        onChange={e => setNewTaille(Number(e.target.value))} 
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Glycémie (g/L)</label>
                      <input 
                        type="number" 
                        step="0.05" 
                        value={newGlycemie} 
                        onChange={e => setNewGlycemie(Number(e.target.value))} 
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddConstante(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 rounded"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {/* Table of historic vitals */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                      <th className="py-2.5 px-3">Date & Heure</th>
                      <th className="py-2.5 px-3">Tension</th>
                      <th className="py-2.5 px-3">Pouls</th>
                      <th className="py-2.5 px-3">Temp.</th>
                      <th className="py-2.5 px-3">SpO2</th>
                      <th className="py-2.5 px-3">Glycémie</th>
                      <th className="py-2.5 px-3">Poids / IMC</th>
                      <th className="py-2.5 px-3">Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {constantes.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-slate-900 font-bold">{c.date}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{c.tensionArterielle}</td>
                        <td className="py-3 px-3">{c.frequenceCardiaque} bpm</td>
                        <td className="py-3 px-3">
                          <span className={c.temperature >= 38.0 ? 'text-rose-700 font-bold' : 'text-slate-800'}>
                            {c.temperature} °C
                          </span>
                        </td>
                        <td className="py-3 px-3">{c.saturationO2}%</td>
                        <td className="py-3 px-3">{c.glycemie ? `${c.glycemie} g/L` : '-'}</td>
                        <td className="py-3 px-3">{c.poids} kg ({c.imc})</td>
                        <td className="py-3 px-3 text-slate-500 font-sans">{c.agentNom}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: CONSULTATIONS */}
          {activeTab === 'consultations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Historique Médical & Consultations</h3>
                  <p className="text-xs text-slate-500">Examens cliniques, diagnostics CIM-10 et conduites à tenir</p>
                </div>

                <button
                  onClick={() => setShowAddConsultation(!showAddConsultation)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouvelle Consultation</span>
                </button>
              </div>

              {/* Form to record new consultation */}
              {showAddConsultation && (
                <form onSubmit={handleSaveConsultation} className="p-4 rounded-xl border border-teal-200 bg-slate-50 space-y-3 text-xs">
                  <div className="font-bold text-slate-900 text-sm">Saisie d'une Consultation Médicale</div>
                  
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Motif de consultation *</label>
                    <input
                      type="text"
                      value={consMotif}
                      onChange={e => setConsMotif(e.target.value)}
                      placeholder="Ex: Douleurs abdominales fébriles, Bilan tensionnel..."
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Diagnostic Principal (CIM-10)</label>
                    <select
                      value={consDiag}
                      onChange={e => setConsDiag(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs"
                    >
                      <option value="B50.0 - Paludisme grave à Plasmodium falciparum">B50.0 - Paludisme grave à Plasmodium falciparum</option>
                      <option value="B50.9 - Paludisme à Plasmodium falciparum sans complication">B50.9 - Paludisme simple</option>
                      <option value="I10 - Hypertension artérielle essentielle">I10 - Hypertension artérielle essentielle</option>
                      <option value="E11.9 - Diabète de type 2 sans complication">E11.9 - Diabète de type 2</option>
                      <option value="J20.9 - Bronchite aiguë">J20.9 - Bronchite aiguë</option>
                      <option value="K29.7 - Gastrite non précisée">K29.7 - Gastrite non précisée</option>
                      <option value="Z34.0 - Surveillance de première grossesse normale">Z34.0 - Surveillance grossesse (CPN)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Examen Clinique & Observations</label>
                    <textarea
                      rows={3}
                      value={consExamen}
                      onChange={e => setConsExamen(e.target.value)}
                      placeholder="Constatations physiques, auscultation cardio-pulmonaire, palpation..."
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Conduite à tenir & Prescriptions</label>
                    <textarea
                      rows={2}
                      value={consConduite}
                      onChange={e => setConsConduite(e.target.value)}
                      placeholder="Mesures hygiéno-diététiques, ordonnance médicamenteuse, examens complémentaires..."
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddConsultation(false)}
                      className="px-3 py-1.5 text-slate-600 bg-white border border-slate-300 rounded"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 font-semibold text-white bg-teal-700 rounded"
                    >
                      Enregistrer la consultation
                    </button>
                  </div>
                </form>
              )}

              {/* Consultation cards */}
              <div className="space-y-4">
                {consultations.map(cons => (
                  <div key={cons.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{cons.motif}</span>
                        <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-semibold">
                          {cons.diagnosticPrincipal}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{cons.date} à {cons.heure}</span>
                    </div>

                    <div className="text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">Examen clinique : </span>
                      {cons.examenClinique}
                    </div>

                    <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                      <span className="font-semibold text-slate-900">Conduite à tenir : </span>
                      {cons.conduiteATenir}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Praticien : {cons.praticienNom} ({cons.specialite})</span>
                      <span className="text-emerald-700 font-medium">Consultation clôturée & signée</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: ORDONNANCES */}
          {activeTab === 'ordonnances' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ordonnances Médicales Sécurisées</h3>
                  <p className="text-xs text-slate-500">Validées avec QR code numérique et cachet officiel de la clinique</p>
                </div>
              </div>

              <div className="space-y-4">
                {ordonnances.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Aucune ordonnance émise pour ce dossier.
                  </div>
                ) : (
                  ordonnances.map(ord => (
                    <div key={ord.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-teal-800 text-xs">{ord.codeOrdonnance}</span>
                          <span className="text-xs text-slate-500 ml-2">Émise le {ord.date} par {ord.praticienNom}</span>
                        </div>

                        <button
                          onClick={() => onPrintOrdonnance(ord)}
                          className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Imprimer Ordonnance</span>
                        </button>
                      </div>

                      <div className="space-y-2 border-t border-slate-100 pt-2 text-xs">
                        {ord.medicaments.map((med, idx) => (
                          <div key={idx} className="flex items-start justify-between p-2 rounded bg-slate-50/70">
                            <div>
                              <div className="font-bold text-slate-900">{med.nom}</div>
                              <div className="text-slate-600 font-mono text-[11px]">{med.posologie} · {med.duree}</div>
                              {med.instructions && <div className="text-slate-500 text-[11px] italic">{med.instructions}</div>}
                            </div>
                            <span className="text-slate-400 text-[11px]">{med.forme}</span>
                          </div>
                        ))}
                      </div>

                      {ord.instructionsGenerales && (
                        <div className="text-xs text-slate-600 italic">
                          Recommandations : {ord.instructionsGenerales}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Signature électronique certifiée
                        </span>
                        <span className="font-mono text-slate-400">QR Code Hash: {ord.qrCodeValidation.slice(-10)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS & EXAMENS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Documents Médicaux & Laboratoire</h3>
                  <p className="text-xs text-slate-500">Résultats de biologie, ECG, échographies et comptes-rendus</p>
                </div>
              </div>

              <div className="space-y-3">
                {documents.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Aucun document rattaché à ce dossier.
                  </div>
                ) : (
                  documents.map(doc => (
                    <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-700" />
                          <span className="font-bold text-slate-900 text-xs">{doc.titre}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {doc.type}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">{doc.date}</span>
                      </div>

                      <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded">
                        <div className="font-semibold text-slate-900 mb-0.5">Conclusion médicale :</div>
                        {doc.conclusion}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Origine : {doc.laboratoireOuService}</span>
                        <span className="font-mono text-slate-400">{doc.nomFichier} ({doc.tailleFichier})</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SUIVIS ET SMS */}
          {activeTab === 'suivis' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Suivi Thérapeutique & Alertes SMS</h3>
                  <p className="text-xs text-slate-500">Notifications automatiques envoyées sur le réseau burkinabè</p>
                </div>
              </div>

              {/* Quick SMS Box */}
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-900">Envoyer un SMS Médical Direct</span>
                  <span className="text-[11px] font-mono text-slate-600">Destinataire : {patient.telephone}</span>
                </div>

                <textarea
                  rows={2}
                  value={smsMessage}
                  onChange={e => setSmsMessage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Coût: 25 FCFA · Passerelle Orange / Moov</span>
                  <button
                    onClick={handleSendQuickSms}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Transmettre SMS Immédiat</span>
                  </button>
                </div>

                {smsSentNotice && (
                  <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SMS délivré avec succès sur le numéro {patient.telephone}</span>
                  </div>
                )}
              </div>

              {/* Patient's SMS History */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Journal des SMS envoyés à ce patient</div>
                {smsList.map(sms => (
                  <div key={sms.id} className="p-3 rounded-lg border border-slate-200 bg-white text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{sms.message}</span>
                      <span className="text-[10px] text-emerald-800 font-medium px-1.5 py-0.5 rounded bg-emerald-50">
                        {sms.statut} ({sms.operateur})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Envoyé le {sms.dateEnvoiEffectif} · ID: {sms.accusereceptionId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: RGPD & CIL */}
          {activeTab === 'rgpd' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Droits du Patient & Conformité CIL Burkina</h3>
                  <p className="text-xs text-slate-500">Application de la Loi 001-2021/AN sur la protection des données de santé</p>
                </div>

                <button
                  onClick={handleExportPatientData}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter Dossier Complet (JSON)</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                <div className="font-semibold text-slate-900">Consentements Éclairés Enregistrés</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                    <span>Traitement et conservation des données de santé</span>
                    <span className="text-emerald-700 font-medium">Accordé à l'admission</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                    <span>Envoi de rappels médicaux par SMS sur réseau burkinabè</span>
                    <span className="text-emerald-700 font-medium">Accordé</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                    <span>Télétransmission feuille de soins assurance / tiers-payant</span>
                    <span className="text-emerald-700 font-medium">{patient.priseEnCharge.assure ? 'Accordé' : 'Sans objet'}</span>
                  </div>
                </div>

                <div className="pt-2 text-slate-500 text-[11px]">
                  Rétention légale : 20 ans d'archivage médical réglementaire à la Clinique Wend-Panga.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Window Sticky Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-slate-700">{patient.nom} {patient.prenom}</span>
            <span>·</span>
            <span className="font-mono text-teal-800 font-bold">{patient.codePatient}</span>
            <span>·</span>
            <span>Clinique Wend-Panga Ouagadougou</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenNewRdv(patient)}
              className="px-4 py-2 text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Programmer un RDV</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-2xs"
            >
              Fermer la Fenêtre
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
