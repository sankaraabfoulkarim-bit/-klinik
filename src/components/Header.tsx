import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Plus, 
  CalendarPlus, 
  Lock,
  PhoneCall
} from 'lucide-react';
import { CLINIC_INFO } from '../data/mockClinicData';
import { RoleUtilisateur } from '../types/clinic';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: {
    nom: string;
    role: RoleUtilisateur;
    mfaActif: boolean;
  };
  onSwitchUser: (role: RoleUtilisateur) => void;
  onOpenNewPatient: () => void;
  onOpenNewRdv: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  currentUser,
  onSwitchUser,
  onOpenNewPatient,
  onOpenNewRdv
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand wordmark & Clinic identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold shadow-sm">
              <Building2 className="w-5 h-5 text-teal-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                Clinique Wend-Panga
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Ouagadougou · Burkina Faso
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (single line, no pills) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'dashboard' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 pb-1' : 'hover:text-slate-900'
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => onTabChange('patients')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'patients' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 pb-1' : 'hover:text-slate-900'
              }`}
            >
              Dossiers Patients
            </button>
            <button
              onClick={() => onTabChange('appointments')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'appointments' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 pb-1' : 'hover:text-slate-900'
              }`}
            >
              Agenda Médical
            </button>
            <button
              onClick={() => onTabChange('billing')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'billing' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 pb-1' : 'hover:text-slate-900'
              }`}
            >
              Caisse & Facturation
            </button>
            <button
              onClick={() => onTabChange('sms')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'sms' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 pb-1' : 'hover:text-slate-900'
              }`}
            >
              Rappels SMS
            </button>
            <button
              onClick={() => onTabChange('rgpd')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'rgpd' ? 'text-teal-700 font-semibold border-b-2 border-teal-700 pb-1' : 'hover:text-slate-900'
              }`}
            >
              Conformité RGPD/CIL
            </button>
          </nav>

          {/* Zone 3: Security & Primary Actions */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* MFA Security Indicator */}
            <div 
              onClick={() => onTabChange('mfa')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-md border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
              title="Authentification Double Facteur CIL/RGPD active"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>MFA Actif</span>
            </div>

            {/* Role / User Switcher */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="text-right hidden md:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.nom}
                </div>
                <div className="text-[11px] text-slate-500 capitalize">
                  {currentUser.role === 'medecin' ? 'Médecin Chef' : currentUser.role}
                </div>
              </div>

              {/* Selector to test different staff roles */}
              <select
                aria-label="Changer de rôle pour tester"
                value={currentUser.role}
                onChange={(e) => onSwitchUser(e.target.value as RoleUtilisateur)}
                className="text-xs bg-slate-100 text-slate-700 py-1.5 px-2 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                <option value="medecin">Dr. Ouédraogo (Médecin)</option>
                <option value="infirmier">Inf. Zongo (Soins)</option>
                <option value="secretaire">F. Sankara (Accueil/RDV)</option>
                <option value="comptable">R. Ilboudo (Caisse)</option>
                <option value="admin">Administrateur SI</option>
              </select>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenNewRdv}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Nouveau RDV</span>
              </button>

              <button
                onClick={onOpenNewPatient}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau Patient</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
