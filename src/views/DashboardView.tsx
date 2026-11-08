import React from 'react';
import { 
  Users, 
  Calendar, 
  Receipt, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  ArrowUpRight, 
  Activity, 
  UserPlus, 
  CalendarPlus,
  Send,
  Building2,
  Stethoscope
} from 'lucide-react';
import { CLINIC_INFO } from '../data/mockClinicData';
import { Patient, RendezVous, Facture, NotificationSuivi, RappelSMS, StatutRDV } from '../types/clinic';

interface DashboardViewProps {
  patients: Patient[];
  rendezVous: RendezVous[];
  factures: Facture[];
  suivis: NotificationSuivi[];
  smsLogs: RappelSMS[];
  onSelectPatient: (patientId: string) => void;
  onUpdateRdvStatut: (rdvId: string, nouveauStatut: StatutRDV) => void;
  onOpenNewPatient: () => void;
  onOpenNewRdv: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  rendezVous,
  factures,
  suivis,
  smsLogs,
  onSelectPatient,
  onUpdateRdvStatut,
  onOpenNewPatient,
  onOpenNewRdv,
  onNavigateToTab
}) => {
  // Calculations
  const rdvAujourdhui = rendezVous.filter(r => r.date === '2026-11-08');
  const enSalleAttente = rdvAujourdhui.filter(r => r.statut === 'salle_attente');
  const enConsultation = rdvAujourdhui.filter(r => r.statut === 'en_consultation');
  const termines = rdvAujourdhui.filter(r => r.statut === 'termine');

  const totalEncaisseAujourdhui = factures
    .filter(f => f.statut === 'payee')
    .reduce((sum, f) => sum + f.montantRegleFcfa, 0);

  const suivisUrgents = suivis.filter(s => s.statut === 'en_retard' || (s.statut === 'active' && s.priorite === 'haute'));
  const smsDelivres = smsLogs.filter(s => s.statut === 'delivre').length;
  const tauxDelivrance = smsLogs.length > 0 ? ((smsDelivres / smsLogs.length) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-6">
      
      {/* Clinic Welcome & Presentation Banner */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden">
          <img 
            src={CLINIC_INFO.imageFacade} 
            alt="Façade Clinique Wend-Panga Ouagadougou" 
            className="w-full h-full object-cover brightness-95"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent flex items-end">
            <div className="p-6 text-white max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300">
                <span>Ouagadougou · Secteur 15 Ouaga 2000</span>
                <span>·</span>
                <span>Agrément MS/SG/DGS N° 2018-042</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                {CLINIC_INFO.nom}
              </h1>
              <p className="text-sm text-slate-200 mt-1 line-clamp-1">
                Plateforme médicale intégrée : Dossiers patients informatisés, rappels SMS télécoms, caisse sécurisée et télédéclarations SNIS.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Strip */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-600">
            <span className="font-medium text-slate-900">Dr. Salimata Ouédraogo</span>
            <span>·</span>
            <span>Dimanche, 08 Novembre 2026</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Clinique ouverte (24h/24 Soins & Urgences)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewPatient}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-700" />
              <span>Enregistrer Patient</span>
            </button>
            <button
              onClick={onOpenNewRdv}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Programmer RDV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: RDV du jour */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Consultations du Jour
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {rdvAujourdhui.length}
            </span>
            <span className="text-xs text-slate-500">
              patients programmés
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-2">
            <span className="text-teal-700 font-medium font-mono">{enConsultation.length} en cours</span>
            <span>·</span>
            <span className="text-slate-500 font-mono">{termines.length} terminés</span>
          </div>
        </div>

        {/* Metric 2: Salle d'attente */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Salle d'Attente Direct
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-900">
              {enSalleAttente.length}
            </span>
            <span className="text-xs text-amber-700 font-medium">
              en attente de consultation
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Temps d'attente moyen : <span className="font-mono font-medium text-slate-700">14 min</span>
          </div>
        </div>

        {/* Metric 3: Recettes du jour */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Encaissements Caisse
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalEncaisseAujourdhui.toLocaleString('fr-FR')}
            </span>
            <span className="text-xs font-bold text-slate-500">
              FCFA
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Orange / Moov / Wave / Cash</span>
          </div>
        </div>

        {/* Metric 4: Moteur SMS & Alertes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rappels Automatiques SMS
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-900">
              {tauxDelivrance}%
            </span>
            <span className="text-xs text-blue-700 font-medium">
              taux de délivrance
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span className="font-mono text-slate-700">{smsLogs.length}</span> SMS envoyés via réseaux BF
          </div>
        </div>

      </div>

      {/* Main Split Grid: Live Waiting Room & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Salle d'Attente & Workflow */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Virtual Waiting Room Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-700" />
                  <span>File d'Attente en Temps Réel</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gestion dynamique du flux patient à l'accueil de la clinique
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab('appointments')}
                className="text-xs font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>Voir l'agenda complet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {rdvAujourdhui.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Aucun patient enregistré en salle d'attente pour le moment.
                </div>
              ) : (
                rdvAujourdhui.map((rdv) => (
                  <div key={rdv.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    <div className="flex items-start gap-3">
                      <div className="w-12 text-center shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {rdv.heure}
                        </span>
                        <div className="text-[10px] text-slate-500">
                          {rdv.dureeMinutes} min
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectPatient(rdv.patientId)}
                            className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors text-left"
                          >
                            {rdv.patientNom}
                          </button>
                          
                          {/* Status Pill */}
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            rdv.statut === 'en_consultation'
                              ? 'bg-purple-100 text-purple-800'
                              : rdv.statut === 'salle_attente'
                              ? 'bg-amber-100 text-amber-800'
                              : rdv.statut === 'confirme'
                              ? 'bg-blue-100 text-blue-800'
                              : rdv.statut === 'termine'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {rdv.statut === 'en_consultation' ? 'En Consultation' :
                             rdv.statut === 'salle_attente' ? 'En Salle d\'Attente' :
                             rdv.statut === 'confirme' ? 'Arrivée Confirmée' :
                             rdv.statut === 'termine' ? 'Consultation Clôturée' : rdv.statut}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                          <span className="text-teal-800 font-medium">{rdv.praticienNom}</span>
                          <span aria-hidden="true">·</span>
                          <span>{rdv.motif}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-600">{rdv.patientTel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {rdv.statut === 'salle_attente' && (
                        <button
                          onClick={() => onUpdateRdvStatut(rdv.id, 'en_consultation')}
                          className="px-2.5 py-1 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded transition-colors"
                        >
                          Faire Entrer
                        </button>
                      )}

                      {rdv.statut === 'en_consultation' && (
                        <button
                          onClick={() => onUpdateRdvStatut(rdv.id, 'termine')}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors"
                        >
                          Terminer Consultation
                        </button>
                      )}

                      {rdv.statut === 'planifie' && (
                        <button
                          onClick={() => onUpdateRdvStatut(rdv.id, 'salle_attente')}
                          className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 rounded transition-colors"
                        >
                          Signaler Arrivée
                        </button>
                      )}

                      <button
                        onClick={() => onSelectPatient(rdv.patientId)}
                        className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        title="Ouvrir le dossier médical"
                      >
                        Ouvrir Dossier
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* Medical Follow-up Notifications Center */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Suivis Médicaux Automatisés & Vigilance Chronique</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rappels programmés pour diabète, HTA, vaccination pédiatrique et post-opératoire
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab('sms')}
                className="text-xs font-medium text-teal-700 hover:text-teal-800"
              >
                Gérer tous les suivis
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {suivisUrgents.map((suivi) => (
                <div key={suivi.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {suivi.patientNom}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {suivi.patientTel}
                      </span>
                      {suivi.statut === 'en_retard' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-medium">
                          Échéance dépassée
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                          Priorité haute
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      {suivi.titre}
                    </div>
                    <div className="text-xs text-slate-500">
                      {suivi.recommandation}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-xs font-mono font-medium text-slate-600">
                      Échéance: {suivi.dateEcheance}
                    </div>
                    <button
                      onClick={() => onNavigateToTab('sms')}
                      className="mt-1.5 px-2.5 py-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Envoyer Rappel SMS</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Doctor Team & Health Synchronizer Status */}
        <div className="space-y-6">
          
          {/* Medical Doctor On-Duty Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Équipe Médicale en Service
            </h3>
            
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <img 
                src={CLINIC_INFO.imageDocteur} 
                alt="Dr. Salimata Ouédraogo" 
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Dr. Salimata Ouédraogo
                </div>
                <div className="text-xs text-teal-700 font-medium">
                  Médecin-Chef · Cardiologue
                </div>
                <div className="text-[11px] text-slate-500">
                  Consultations et explorations
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">Dr. Boureima Sawadogo (Chirurgie)</span>
                <span className="text-emerald-700 font-medium">Disponible</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">Dr. Aminata Traoré (Pédiatrie)</span>
                <span className="text-emerald-700 font-medium">Disponible</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700">Dr. J-B. Kaboré (Gynécologie)</span>
                <span className="text-slate-400">Garde nuit</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Standard Clinique :</span>
              <span className="font-mono font-bold text-slate-800">{CLINIC_INFO.telephone}</span>
            </div>
          </div>

          {/* Synchronizer Status Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Interopérabilité Santé
              </h3>
              <button
                onClick={() => onNavigateToTab('sync')}
                className="text-xs text-teal-700 hover:text-teal-800 font-medium"
              >
                Gérer
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900">SNIS Burkina Faso (DHIS2)</div>
                  <div className="text-slate-500 text-[11px]">Dernière télétransmission : 06h00 (28 fiches transmises)</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900">PACS Imagerie DICOM 3.0</div>
                  <div className="text-slate-500 text-[11px]">Liaison directe échographie & radio active</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900">Tiers-Payant Assurances (FHIR R4)</div>
                  <div className="text-slate-500 text-[11px]">CNSS, Sonar, Coris Assurances connectés</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Sécurité & Chiffrement :</span>
              <span className="font-mono text-emerald-800 font-medium">AES-256 / TLS 1.3</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
