import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UserPlus, 
  Filter, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  HeartPulse, 
  Calendar, 
  Phone, 
  MapPin, 
  ChevronRight,
  Download,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Patient } from '../types/clinic';

interface PatientsViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onOpenNewPatient: () => void;
  onOpenNewRdvWithPatient?: (patient: Patient) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  onSelectPatient,
  onOpenNewPatient,
  onOpenNewRdvWithPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'assure' | 'non_assure' | 'pediatrie'>('all');

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Search matching
      const query = searchTerm.toLowerCase();
      const matchSearch = 
        patient.nom.toLowerCase().includes(query) ||
        patient.prenom.toLowerCase().includes(query) ||
        patient.codePatient.toLowerCase().includes(query) ||
        patient.telephone.includes(query) ||
        patient.quartier.toLowerCase().includes(query);

      if (!matchSearch) return false;

      // Filter tabs
      if (filterType === 'assure') return patient.priseEnCharge.assure;
      if (filterType === 'non_assure') return !patient.priseEnCharge.assure;
      if (filterType === 'pediatrie') {
        const birthYear = parseInt(patient.dateNaissance.split('-')[0], 10);
        return 2026 - birthYear <= 15;
      }

      return true;
    });
  }, [patients, searchTerm, filterType]);

  const calculateAge = (dateNaissance: string) => {
    const annee = parseInt(dateNaissance.split('-')[0], 10);
    const age = 2026 - annee;
    if (age <= 2) return `${age * 12} mois`;
    return `${age} ans`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Dossiers Médicaux des Patients (DMI)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi complet des antécédents, constantes vitales, consultations et ordonnances conformes CIL/RGPD
          </p>
        </div>

        <button
          onClick={onOpenNewPatient}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nouveau Dossier Patient</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, N° dossier (WP-OUA-...), téléphone ou quartier (Ouaga 2000, Gounghin...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Filter Segmented Control (allowed by frontend constitution for interactive filter) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-start md:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({patients.length})
            </button>
            <button
              onClick={() => setFilterType('assure')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'assure' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assurés (CNSS / Mutuelle)
            </button>
            <button
              onClick={() => setFilterType('non_assure')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'non_assure' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Non Assurés
            </button>
            <button
              onClick={() => setFilterType('pediatrie')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'pediatrie' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pédiatrie (≤ 15 ans)
            </button>
          </div>

        </div>

        {/* Filter summary line without pills */}
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
          <span>{filteredPatients.length} patient(s) trouvé(s)</span>
          <span aria-hidden="true">·</span>
          <span>Stockage sécurisé CIL / RGPD avec chiffrement AES-256</span>
          <span aria-hidden="true">·</span>
          <span>Clinique Wend-Panga Ouagadougou</span>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Code Patient</th>
                <th className="py-3 px-4">Identité & Âge</th>
                <th className="py-3 px-4">Groupe Sanguin</th>
                <th className="py-3 px-4">Téléphone & Quartier</th>
                <th className="py-3 px-4">Couverture / Assurance</th>
                <th className="py-3 px-4">Allergies Signalées</th>
                <th className="py-3 px-4 text-center">Sécurité MFA</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Aucun dossier patient ne correspond à votre recherche "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onSelectPatient(patient.id)}
                  >
                    
                    {/* Code Patient */}
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                      {patient.codePatient}
                    </td>

                    {/* Patient Name & Age */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {patient.nom} {patient.prenom}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {patient.sexe === 'M' ? 'Homme' : 'Femme'} · {calculateAge(patient.dateNaissance)} ({patient.dateNaissance})
                      </div>
                    </td>

                    {/* Blood Type */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-bold">
                        {patient.groupeSanguin}
                      </span>
                    </td>

                    {/* Contact & Neighborhood */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-800 font-medium">
                        {patient.telephone}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{patient.quartier}, Ouaga</span>
                      </div>
                    </td>

                    {/* Insurance */}
                    <td className="py-3.5 px-4">
                      {patient.priseEnCharge.assure ? (
                        <div>
                          <span className="font-semibold text-slate-800">
                            {patient.priseEnCharge.compagnie}
                          </span>
                          <span className="text-teal-700 font-mono font-bold ml-1">
                            ({patient.priseEnCharge.taux}%)
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {patient.priseEnCharge.matricule}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">
                          Plein Tarif (Non assuré)
                        </span>
                      )}
                    </td>

                    {/* Allergies with high visual warning */}
                    <td className="py-3.5 px-4">
                      {patient.allergies.length > 0 ? (
                        <div className="flex items-center gap-1 text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200 w-fit">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span className="truncate max-w-[140px]" title={patient.allergies.join(', ')}>
                            {patient.allergies.join(', ')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Aucune connue
                        </span>
                      )}
                    </td>

                    {/* MFA Status */}
                    <td className="py-3.5 px-4 text-center">
                      {patient.mfaActif ? (
                        <div className="inline-flex items-center gap-1 text-emerald-700 text-[11px]" title="Authentification 2FA active pour le portail patient">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span className="hidden sm:inline">2FA OK</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-[11px]">
                          Désactivé
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectPatient(patient.id)}
                          className="px-2.5 py-1 text-xs font-medium text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded transition-colors"
                        >
                          Consulter
                        </button>
                        <button
                          onClick={() => onOpenNewRdvWithPatient?.(patient)}
                          className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                          title="Planifier un rendez-vous"
                        >
                          + RDV
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
