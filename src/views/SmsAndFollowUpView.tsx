import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Smartphone, 
  Sparkles, 
  Calendar, 
  UserCheck, 
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import { RappelSMS, NotificationSuivi, Patient } from '../types/clinic';
import { ClinicStorageService } from '../services/clinicStorage';
import { CLINIC_INFO } from '../data/mockClinicData';

interface SmsAndFollowUpViewProps {
  smsLogs: RappelSMS[];
  suivis: NotificationSuivi[];
  patients: Patient[];
  onRefreshData: () => void;
  onSelectPatient: (patientId: string) => void;
}

export const SmsAndFollowUpView: React.FC<SmsAndFollowUpViewProps> = ({
  smsLogs,
  suivis,
  patients,
  onRefreshData,
  onSelectPatient
}) => {
  const [activeTab, setActiveTab] = useState<'moteur' | 'composer' | 'suivis_auto'>('suivis_auto');

  // Composer states
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('rdv_j1');
  const [customMessage, setCustomMessage] = useState<string>('Clinique Wend-Panga: Bonjour M. CONGO, rappel de votre consultation avec Dr. Ouédraogo demain 08 Nov à 08h30. Pour modifier, appelez le 25374040.');
  const [sentSuccessNotice, setSentSuccessNotice] = useState(false);

  // New follow-up protocol modal state
  const [showNewSuiviModal, setShowNewSuiviModal] = useState(false);
  const [newSuiviPatientId, setNewSuiviPatientId] = useState(patients[0]?.id || '');
  const [newSuiviType, setNewSuiviType] = useState<NotificationSuivi['typeSuivi']>('chronique_hta');
  const [newSuiviTitre, setNewSuiviTitre] = useState('Contrôle trimestriel tensionnel et fonction rénale');
  const [newSuiviDate, setNewSuiviDate] = useState('2026-11-20');
  const [newSuiviReco, setNewSuiviReco] = useState('Surveillance de la pression artérielle et bilan créatininémie sous IEC');

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // When changing template, adapt message text
  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    const pNom = selectedPatient ? selectedPatient.nom : 'PATIENT';
    const pPrenom = selectedPatient ? selectedPatient.prenom : '';

    if (templateKey === 'rdv_j1') {
      setCustomMessage(`Clinique Wend-Panga: Bonjour ${pPrenom} ${pNom}, rappel de votre consultation médicale demain à 09h00. Munissez-vous de votre carnet et carte d'assurance. Infos: 25374040.`);
    } else if (templateKey === 'rdv_h2') {
      setCustomMessage(`Clinique Wend-Panga: Rappel immédiat - Votre rendez-vous médical débute dans 2 heures. Merci de vous présenter à l'accueil pour votre admission.`);
    } else if (templateKey === 'labo_pret') {
      setCustomMessage(`Clinique Wend-Panga: Bonjour ${pNom}, vos résultats d'analyses biologiques sont prêts au laboratoire de la clinique ou consultables sur votre espace patient.`);
    } else if (templateKey === 'suivi_hta') {
      setCustomMessage(`Clinique Wend-Panga: Suivi HTA - N'oubliez pas votre prise quotidienne d'antihypertenseur et votre contrôle de tension ce mois-ci.`);
    } else if (templateKey === 'suivi_diabete') {
      setCustomMessage(`Clinique Wend-Panga: Suivi Diabète - Votre bilan trimestriel HbA1c est à programmer cette semaine à jeun dès 07h30.`);
    } else if (templateKey === 'vaccin_enfant') {
      setCustomMessage(`Clinique Wend-Panga: Rappel Pédiatrie - Le rappel vaccinal pour votre enfant arrive à échéance. Contactez le secrétariat pour le créneau.`);
    }
  };

  // Trigger manual SMS send
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    ClinicStorageService.sendSms({
      patientId: selectedPatient.id,
      patientNom: `${selectedPatient.nom} ${selectedPatient.prenom}`,
      telephone: selectedPatient.telephone,
      typeRappel: selectedTemplate as any,
      message: customMessage,
      dateProgrammee: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operateur: selectedPatient.telephone.startsWith('+226 70') ? 'Orange Burkina' : 'Moov Africa Burkina',
      coutFcfa: 25
    });

    setSentSuccessNotice(true);
    setTimeout(() => setSentSuccessNotice(false), 3500);
    onRefreshData();
  };

  // Add new follow-up protocol
  const handleSaveNewSuivi = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find(pat => pat.id === newSuiviPatientId);
    if (!p) return;

    const nouveau: NotificationSuivi = {
      id: `SUIVI-${Date.now().toString().slice(-6)}`,
      patientId: p.id,
      patientNom: `${p.nom} ${p.prenom}`,
      patientTel: p.telephone,
      typeSuivi: newSuiviType,
      titre: newSuiviTitre,
      dateEcheance: newSuiviDate,
      intervalleJours: 30,
      recommandation: newSuiviReco,
      statut: 'active',
      priorite: 'haute',
      actionPrevue: 'Notification automatique par SMS sur réseau burkinabè'
    };

    ClinicStorageService.addSuivi(nouveau);
    setShowNewSuiviModal(false);
    onRefreshData();
  };

  // Send automated SMS from follow-up row
  const handleTriggerFollowUpSms = (suivi: NotificationSuivi) => {
    ClinicStorageService.sendSms({
      patientId: suivi.patientId,
      patientNom: suivi.patientNom,
      telephone: suivi.patientTel,
      typeRappel: 'renouvellement_ttt',
      message: `Clinique Wend-Panga: Rappel de suivi médical - ${suivi.titre}. Merci de contacter la clinique au 25374040 pour votre visite.`,
      dateProgrammee: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operateur: suivi.patientTel.startsWith('+226 70') ? 'Orange Burkina' : 'Moov Africa Burkina',
      coutFcfa: 25
    });

    ClinicStorageService.updateSuiviStatut(suivi.id, 'terminee');
    onRefreshData();
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Système Automatisé de Rappels SMS & Suivis Médicaux
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interconnexion directe avec les passerelles télécoms Orange Burkina et Moov Africa pour la réduction des absences et le suivi des chroniques
          </p>
        </div>

        <button
          onClick={() => setShowNewSuiviModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Protocole de Suivi</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Taux de Délivrance SMS</div>
          <div className="mt-2 text-2xl font-bold font-mono text-teal-800">98.4%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Orange BF & Moov Africa</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">SMS Envoyés ce Mois</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">{smsLogs.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Coût total: {(smsLogs.length * 25).toLocaleString('fr-FR')} FCFA</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Réduction No-Show</div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700">- 78%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Grâce aux rappels J-1 et H-2</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Suivis Actifs</div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-700">{suivis.filter(s => s.statut === 'active').length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Protocoles de vigilance clinique</div>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
        <button
          onClick={() => setActiveTab('suivis_auto')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'suivis_auto' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Notifications de Suivi Médical ({suivis.length})
        </button>
        <button
          onClick={() => setActiveTab('composer')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'composer' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Simulateur & Envoi SMS Direct
        </button>
        <button
          onClick={() => setActiveTab('moteur')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'moteur' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Journal Passerelle Télécom ({smsLogs.length})
        </button>
      </div>

      {/* TAB 1: NOTIFICATIONS DE SUIVI MÉDICAL */}
      {activeTab === 'suivis_auto' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Protocoles Automatisés de Suivi et Vigilance Thérapeutique
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Surveillance active des patients chroniques et post-interventions à Ouagadougou
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {suivis.map((suivi) => (
                <div key={suivi.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => onSelectPatient(suivi.patientId)}
                        className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors"
                      >
                        {suivi.patientNom}
                      </button>
                      
                      <span className="text-xs text-slate-400 font-mono">
                        {suivi.patientTel}
                      </span>

                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        suivi.statut === 'en_retard' ? 'bg-rose-100 text-rose-800' :
                        suivi.statut === 'terminee' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {suivi.statut === 'en_retard' ? 'Échéance Dépassée' :
                         suivi.statut === 'terminee' ? 'Suivi Traité' : 'À Relancer'}
                      </span>

                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {suivi.typeSuivi.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-800">
                      {suivi.titre}
                    </div>

                    <div className="text-xs text-slate-600">
                      {suivi.recommandation}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Échéance clinique prévue : <strong className="text-slate-700">{suivi.dateEcheance}</strong></span>
                    </div>
                  </div>

                  {/* Operational Action */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {suivi.statut !== 'terminee' && (
                      <button
                        onClick={() => handleTriggerFollowUpSms(suivi)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Déclencher SMS de Relance</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectPatient(suivi.patientId)}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      Dossier Médical
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPOSER & SMARTPHONE SIMULATOR */}
      {activeTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SMS Formulation Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Formulaire de Transmission SMS
            </h3>
            
            <form onSubmit={handleSendSms} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Sélectionner le Patient Destinataire
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => {
                    setSelectedPatientId(e.target.value);
                    handleTemplateChange(selectedTemplate);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nom} {p.prenom} ({p.telephone} - {p.quartier})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Modèle de Message Prédéfini
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium"
                >
                  <option value="rdv_j1">Rappel de Rendez-vous (Veille J-1)</option>
                  <option value="rdv_h2">Rappel Immédiat (2h avant consultation)</option>
                  <option value="labo_pret">Résultats d'Analyses Biologiques Prêts</option>
                  <option value="suivi_hta">Suivi Médical HTA & Pression Artérielle</option>
                  <option value="suivi_diabete">Suivi Diabète & Bilan Hémoglobine HbA1c</option>
                  <option value="vaccin_enfant">Rappel Vaccinal Pédiatrique (PEV)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Contenu du SMS ({customMessage.length} caractères / 1 segment)
                </label>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900">Passerelle Télécom : </span>
                  <span className="text-teal-800 font-bold">
                    {selectedPatient?.telephone.startsWith('+226 70') ? 'Orange Burkina' : 'Moov Africa Burkina'}
                  </span>
                </div>
                <div className="font-mono text-slate-700">Coût: 25 FCFA</div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le SMS au Patient</span>
              </button>

              {sentSuccessNotice && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>SMS transmis et délivré avec succès à l'abonné (+226).</span>
                </div>
              )}

            </form>
          </div>

          {/* Realistic Burkinabè Smartphone Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>Aperçu Réception Mobile Patient (Burkina Faso)</span>
            </div>

            {/* Smartphone Mockup Frame */}
            <div className="w-[300px] h-[480px] bg-slate-900 rounded-[36px] p-3 shadow-xl border-4 border-slate-800 flex flex-col">
              
              {/* Phone Speaker & Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 shrink-0"></div>

              {/* Screen Area */}
              <div className="flex-1 bg-slate-100 rounded-[24px] overflow-hidden flex flex-col p-3">
                
                {/* Status Bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-2 shrink-0">
                  <span>08:30</span>
                  <span className="font-semibold text-slate-700">Orange BF 4G</span>
                  <span>100%</span>
                </div>

                {/* Message Header */}
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center mb-3 shadow-2xs shrink-0">
                  <div className="text-[11px] font-bold text-teal-800">CLINIQUE WEND-PANGA</div>
                  <div className="text-[9px] text-slate-400">Émetteur officiel vérifié</div>
                </div>

                {/* Message Bubble */}
                <div className="flex-1 flex flex-col justify-end">
                  <div className="bg-teal-700 text-white p-3 rounded-2xl rounded-bl-xs text-xs shadow-sm max-w-[90%] leading-relaxed">
                    {customMessage}
                    <div className="text-[9px] text-teal-200 text-right mt-1 font-mono">
                      Maintenant · Délivré
                    </div>
                  </div>
                </div>

                {/* Phone Bottom bar */}
                <div className="mt-3 py-1 text-center text-[10px] text-slate-400">
                  Répondre STOP pour refuser
                </div>

              </div>

              {/* Home indicator bar */}
              <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2 shrink-0"></div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 3: JOURNAL TÉLÉCOM */}
      {activeTab === 'moteur' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Journal des Émissions SMS (Passerelles Orange & Moov)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Preuves d'envoi certifiées avec horodatage et identifiants d'accusés de réception
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Date & Heure</th>
                  <th className="py-3 px-4">Patient & Numéro</th>
                  <th className="py-3 px-4">Opérateur BF</th>
                  <th className="py-3 px-4">Message Transmis</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Réf. Accusé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {smsLogs.map((sms) => (
                  <tr key={sms.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {sms.dateEnvoiEffectif || sms.dateProgrammee}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{sms.patientNom}</div>
                      <div className="font-mono text-slate-500 text-[11px]">{sms.telephone}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {sms.operateur}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-sm truncate" title={sms.message}>
                      {sms.message}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Délivré</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-right text-[11px]">
                      {sms.accusereceptionId || 'ACK_AUTO'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal to create a new follow-up protocol */}
      {showNewSuiviModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden">
            
            {/* Modal Sticky Header */}
            <div className="bg-slate-900 text-white px-6 py-4 shrink-0 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Nouveau Protocole de Suivi Médical
                  </h3>
                  <p className="text-xs text-slate-300">
                    Vigilance thérapeutique et relances SMS automatiques
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowNewSuiviModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                title="Fermer la fenêtre"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="new-suivi-form" onSubmit={handleSaveNewSuivi} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-800">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Patient Suivi *</label>
                <select
                  value={newSuiviPatientId}
                  onChange={e => setNewSuiviPatientId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.nom} {p.prenom} ({p.quartier})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Type de Vigilance Thérapeutique *</label>
                <select
                  value={newSuiviType}
                  onChange={e => setNewSuiviType(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  <option value="chronique_hta">Hypertension Artérielle (HTA)</option>
                  <option value="chronique_diabete">Diabète & Glycémie</option>
                  <option value="post_operatoire">Surveillance Post-Opératoire</option>
                  <option value="grossesse_cpon">Grossesse & Santé de la Mère</option>
                  <option value="vaccination_nourrisson">Vaccination Nourrisson (PEV)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Intitulé de la Surveillance *</label>
                <input
                  type="text"
                  value={newSuiviTitre}
                  onChange={e => setNewSuiviTitre(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Date d'Échéance Prévue *</label>
                <input
                  type="date"
                  value={newSuiviDate}
                  onChange={e => setNewSuiviDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Consignes Médicales & Actions</label>
                <textarea
                  rows={3}
                  value={newSuiviReco}
                  onChange={e => setNewSuiviReco(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 shadow-2xs"
                />
              </div>
            </form>

            {/* Modal Sticky Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowNewSuiviModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-2xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="new-suivi-form"
                className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
              >
                Activer le Protocole
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
