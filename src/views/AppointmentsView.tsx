import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Send, 
  CheckCircle2, 
  Plus, 
  Filter, 
  Phone, 
  Activity, 
  AlertTriangle,
  Stethoscope,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { RendezVous, StatutRDV, Praticien } from '../types/clinic';
import { PRATICIENS_INITIAUX } from '../data/mockClinicData';

interface AppointmentsViewProps {
  rendezVous: RendezVous[];
  onSelectPatient: (patientId: string) => void;
  onUpdateRdvStatut: (rdvId: string, nouveauStatut: StatutRDV) => void;
  onSendSmsReminder: (rdv: RendezVous) => void;
  onOpenNewRdv: () => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  rendezVous,
  onSelectPatient,
  onUpdateRdvStatut,
  onSendSmsReminder,
  onOpenNewRdv
}) => {
  const [selectedPraticienId, setSelectedPraticienId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-08');
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('all');
  const [sentSmsRdvId, setSentSmsRdvId] = useState<string | null>(null);

  const filteredRdv = rendezVous.filter(rdv => {
    if (selectedPraticienId !== 'all' && rdv.praticienId !== selectedPraticienId) return false;
    if (selectedDate && rdv.date !== selectedDate) return false;
    if (activeFilterStatus !== 'all' && rdv.statut !== activeFilterStatus) return false;
    return true;
  }).sort((a, b) => a.heure.localeCompare(b.heure));

  const handleTriggerSms = (rdv: RendezVous) => {
    onSendSmsReminder(rdv);
    setSentSmsRdvId(rdv.id);
    setTimeout(() => setSentSmsRdvId(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Planning & Rendez-vous Médicaux
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organisation des consultations par praticien et automatisation des rappels SMS sur réseaux burkinabè
          </p>
        </div>

        <button
          onClick={onOpenNewRdv}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Programmer un Rendez-vous</span>
        </button>
      </div>

      {/* Date Navigation & Practitioner Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Date Picker Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate('2026-11-07')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                selectedDate === '2026-11-07' ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Hier (07 Nov)
            </button>
            <button
              onClick={() => setSelectedDate('2026-11-08')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                selectedDate === '2026-11-08' ? 'bg-teal-700 border-teal-700 text-white font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Aujourd'hui (08 Nov)
            </button>
            <button
              onClick={() => setSelectedDate('2026-11-09')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                selectedDate === '2026-11-09' ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Demain (09 Nov)
            </button>

            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs text-slate-500 font-mono">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Date sélectionnée : {selectedDate}</span>
            </div>
          </div>

          {/* Practitioner Dropdown Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Praticien :</span>
            <select
              aria-label="Filtrer par praticien"
              value={selectedPraticienId}
              onChange={(e) => setSelectedPraticienId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 font-medium"
            >
              <option value="all">Tous les médecins ({PRATICIENS_INITIAUX.length})</option>
              {PRATICIENS_INITIAUX.map(p => (
                <option key={p.id} value={p.id}>{p.nom} ({p.specialite})</option>
              ))}
            </select>
          </div>

        </div>

        {/* Status Filter Tab strip */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveFilterStatus('all')}
            className={`px-3 py-1 rounded-md transition-colors ${activeFilterStatus === 'all' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Tous les statuts
          </button>
          <button
            onClick={() => setActiveFilterStatus('salle_attente')}
            className={`px-3 py-1 rounded-md transition-colors ${activeFilterStatus === 'salle_attente' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            En salle d'attente
          </button>
          <button
            onClick={() => setActiveFilterStatus('en_consultation')}
            className={`px-3 py-1 rounded-md transition-colors ${activeFilterStatus === 'en_consultation' ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            En consultation
          </button>
          <button
            onClick={() => setActiveFilterStatus('confirme')}
            className={`px-3 py-1 rounded-md transition-colors ${activeFilterStatus === 'confirme' ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Confirmés
          </button>
          <button
            onClick={() => setActiveFilterStatus('termine')}
            className={`px-3 py-1 rounded-md transition-colors ${activeFilterStatus === 'termine' ? 'bg-emerald-100 text-emerald-900 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Terminés
          </button>
        </div>
      </div>

      {/* Appointment Slots Grid */}
      <div className="space-y-3">
        {filteredRdv.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            Aucun rendez-vous trouvé pour la date du {selectedDate} avec les filtres actuels.
          </div>
        ) : (
          filteredRdv.map((rdv) => (
            <div 
              key={rdv.id} 
              className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              
              {/* Left Column: Time & Patient Identity */}
              <div className="flex items-start gap-4">
                
                {/* Time Box */}
                <div className="w-16 h-16 rounded-lg bg-teal-50 border border-teal-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-sm font-mono font-bold text-teal-900">
                    {rdv.heure}
                  </span>
                  <span className="text-[10px] text-teal-700 font-medium">
                    {rdv.dureeMinutes} min
                  </span>
                </div>

                {/* Patient & Consultation Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onSelectPatient(rdv.patientId)}
                      className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors text-left"
                    >
                      {rdv.patientNom}
                    </button>
                    
                    <span className="text-xs text-slate-400 font-mono">
                      {rdv.patientTel}
                    </span>

                    {/* Status Badge */}
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      rdv.statut === 'en_consultation' ? 'bg-purple-100 text-purple-800' :
                      rdv.statut === 'salle_attente' ? 'bg-amber-100 text-amber-800' :
                      rdv.statut === 'confirme' ? 'bg-blue-100 text-blue-800' :
                      rdv.statut === 'termine' ? 'bg-emerald-100 text-emerald-800' :
                      rdv.statut === 'annule' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {rdv.statut === 'en_consultation' ? 'En Consultation' :
                       rdv.statut === 'salle_attente' ? 'En Salle d\'Attente' :
                       rdv.statut === 'confirme' ? 'Confirmé' :
                       rdv.statut === 'termine' ? 'Terminé' :
                       rdv.statut === 'annule' ? 'Annulé' : 'Planifié'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700">
                    <span className="font-semibold">{rdv.motif}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span className="text-teal-800 font-medium flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-teal-600" />
                      {rdv.praticienNom} ({rdv.specialite})
                    </span>
                    <span>·</span>
                    <span className="font-mono">{rdv.montantEstimeFcfa.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>

              </div>

              {/* Right Column: SMS status & Status Workflow Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                
                {/* SMS Reminder Trigger */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTriggerSms(rdv)}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5"
                    title="Envoyer un rappel SMS immédiat sur Orange BF ou Moov BF"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-600" />
                    <span>Rappel SMS</span>
                  </button>

                  {sentSmsRdvId === rdv.id && (
                    <span className="text-xs text-emerald-700 font-semibold animate-pulse">
                      SMS transmis !
                    </span>
                  )}
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-1.5">
                  <select
                    aria-label="Modifier le statut du rendez-vous"
                    value={rdv.statut}
                    onChange={(e) => onUpdateRdvStatut(rdv.id, e.target.value as StatutRDV)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-md py-1.5 px-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
                  >
                    <option value="planifie">Planifié</option>
                    <option value="confirme">Confirmé</option>
                    <option value="salle_attente">En Salle d'Attente</option>
                    <option value="en_consultation">En Consultation</option>
                    <option value="termine">Terminé</option>
                    <option value="no_show">Non Présenté (No-show)</option>
                    <option value="annule">Annulé</option>
                  </select>

                  <button
                    onClick={() => onSelectPatient(rdv.patientId)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                  >
                    Dossier
                  </button>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
