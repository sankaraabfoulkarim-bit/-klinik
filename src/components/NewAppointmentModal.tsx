import React, { useState } from 'react';
import { X, CalendarPlus, Stethoscope, Send } from 'lucide-react';
import { RendezVous, Patient, Praticien } from '../types/clinic';
import { PRATICIENS_INITIAUX } from '../data/mockClinicData';
import { ClinicStorageService } from '../services/clinicStorage';

interface NewAppointmentModalProps {
  patients: Patient[];
  preselectedPatient?: Patient | null;
  onClose: () => void;
  onRdvCreated: (rdv: RendezVous) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  patients,
  preselectedPatient,
  onClose,
  onRdvCreated
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(preselectedPatient?.id || patients[0]?.id || '');
  const [selectedPraticienId, setSelectedPraticienId] = useState<string>('PRAT-01');
  const [date, setDate] = useState('2026-11-08');
  const [heure, setHeure] = useState('11:30');
  const [duree, setDuree] = useState(30);
  const [motif, setMotif] = useState('Consultation de cardiologie et contrôle tensionnel');
  const [type, setType] = useState<RendezVous['type']>('consultation');
  const [sendSmsConfirm, setSendSmsConfirm] = useState(true);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const selectedPraticien = PRATICIENS_INITIAUX.find(p => p.id === selectedPraticienId) || PRATICIENS_INITIAUX[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    let montant = 10000;
    if (selectedPraticien.specialite.includes('Cardio') || selectedPraticien.specialite.includes('Chirurgie') || selectedPraticien.specialite.includes('Gynéco')) {
      montant = 25000;
    } else if (selectedPraticien.specialite.includes('Pédiatrie')) {
      montant = 15000;
    }

    const newRdv: RendezVous = {
      id: `RDV-${Date.now().toString().slice(-6)}`,
      patientId: selectedPatient.id,
      patientNom: `${selectedPatient.nom} ${selectedPatient.prenom}`,
      patientTel: selectedPatient.telephone,
      praticienId: selectedPraticien.id,
      praticienNom: selectedPraticien.nom,
      specialite: selectedPraticien.specialite,
      date,
      heure,
      dureeMinutes: Number(duree),
      motif,
      type,
      statut: 'confirme',
      rappelSmsEnvoye: sendSmsConfirm,
      rappelSmsDate: sendSmsConfirm ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
      montantEstimeFcfa: montant
    };

    ClinicStorageService.saveRendezVous(newRdv);

    // If instant SMS confirmation was requested
    if (sendSmsConfirm) {
      ClinicStorageService.sendSms({
        patientId: selectedPatient.id,
        patientNom: `${selectedPatient.nom} ${selectedPatient.prenom}`,
        telephone: selectedPatient.telephone,
        typeRappel: 'rdv_j1',
        message: `Clinique Wend-Panga: Confirmation de votre RDV le ${date} à ${heure} avec ${selectedPraticien.nom} (${selectedPraticien.specialite}). Merci de venir 10 min avant. Tél: 25374040.`,
        dateProgrammee: new Date().toISOString().replace('T', ' ').substring(0, 16),
        operateur: selectedPatient.telephone.startsWith('+226 70') ? 'Orange Burkina' : 'Moov Africa Burkina',
        coutFcfa: 25
      });
    }

    onRdvCreated(newRdv);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden">
        
        {/* Sticky Header with high contrast */}
        <div className="bg-slate-900 text-white px-6 py-4 shrink-0 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Programmer un Rendez-vous Médical
              </h2>
              <p className="text-xs text-slate-300">
                Affectation praticien et notification SMS automatique au patient (+226)
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
        <form id="new-rdv-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-800">
          
          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Patient Concerné *
            </label>
            <select
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
              required
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nom} {p.prenom} ({p.telephone} - {p.quartier})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Praticien / Spécialiste Assigné *
            </label>
            <select
              value={selectedPraticienId}
              onChange={e => setSelectedPraticienId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
              required
            >
              {PRATICIENS_INITIAUX.map(prat => (
                <option key={prat.id} value={prat.id}>
                  {prat.nom} — {prat.specialite} ({prat.horaires})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 font-bold mb-1">Date de Consultation *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono font-medium text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                required
              />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Heure du RDV *</label>
              <input
                type="time"
                value={heure}
                onChange={e => setHeure(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 font-bold mb-1">Type de Visite</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-900 shadow-2xs"
              >
                <option value="consultation">Consultation Standard</option>
                <option value="suivi">Suivi & Contrôle Thérapeutique</option>
                <option value="urgence">Urgence Médicale</option>
                <option value="bilan">Bilan Médical Complet</option>
                <option value="examen">Examen / Exploration</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">Durée Prévue</label>
              <select
                value={duree}
                onChange={e => setDuree(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 shadow-2xs"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 heure</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">Motif de Consultation *</label>
            <input
              type="text"
              value={motif}
              onChange={e => setMotif(e.target.value)}
              placeholder="Ex: Douleurs thoraciques, Suivi de grossesse 28 SA..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-700"
              required
            />
          </div>

          {/* SMS Notification Banner */}
          <div className="p-3.5 bg-teal-50 rounded-xl border-2 border-teal-200 space-y-1">
            <label className="flex items-center gap-2.5 cursor-pointer font-bold text-teal-950">
              <input
                type="checkbox"
                checked={sendSmsConfirm}
                onChange={e => setSendSmsConfirm(e.target.checked)}
                className="w-4 h-4 rounded text-teal-700"
              />
              <span>Transmettre un SMS de confirmation immédiat au patient (+226)</span>
            </label>
            <p className="text-[11px] text-teal-800 ml-6">
              Rappels automatiques programmés à J-1 et H-2 sur le réseau Orange ou Moov Burkina.
            </p>
          </div>

        </form>

        {/* Sticky Footer Action Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-2xs"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="new-rdv-form"
            className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors"
          >
            Enregistrer le Rendez-vous
          </button>
        </div>

      </div>
    </div>
  );
};
