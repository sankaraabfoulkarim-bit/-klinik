import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  Receipt, 
  BarChart3, 
  ShieldCheck, 
  Network, 
  KeyRound,
  PhoneCall,
  Clock,
  Sparkles
} from 'lucide-react';
import { CLINIC_INFO } from '../data/mockClinicData';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  waitingCount: number;
  unpaidCount: number;
  dueFollowUpCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  waitingCount,
  unpaidCount,
  dueFollowUpCount
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'patients',
      label: 'Dossiers Patients',
      icon: Users,
      badge: null
    },
    {
      id: 'appointments',
      label: 'Agenda & Rendez-vous',
      icon: Calendar,
      badge: waitingCount > 0 ? `${waitingCount} en attente` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'sms',
      label: 'Rappels SMS & Suivis',
      icon: MessageSquare,
      badge: dueFollowUpCount > 0 ? `${dueFollowUpCount} à relancer` : null,
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'billing',
      label: 'Caisse & Facturation',
      icon: Receipt,
      badge: unpaidCount > 0 ? `${unpaidCount} impayée` : null,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'analytics',
      label: 'Statistiques & Rapports',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'rgpd',
      label: 'Conformité RGPD & CIL',
      icon: ShieldCheck,
      badge: 'CIL BF'
    },
    {
      id: 'mfa',
      label: 'Sécurité & Accès MFA',
      icon: KeyRound,
      badge: null
    },
    {
      id: 'sync',
      label: 'Synchronisation Santé',
      icon: Network,
      badge: 'FHIR/HL7'
    }
  ];

  return (
    <aside className="no-print w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Navigation menu */}
      <div className="p-4 flex-1 space-y-1">
        <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-2">
          Gestion Clinique
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-teal-50 text-teal-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1.5 ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Localized Clinic Card at Bottom */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs font-semibold text-slate-800">
          Urgences Médicales Ouaga
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs font-mono font-bold text-teal-800">
          <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
          <span>{CLINIC_INFO.urgences}</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 leading-tight">
          Ouaga 2000, Secteur 15<br />
          IFU: <span className="font-mono text-slate-700">{CLINIC_INFO.numeroIfu}</span>
        </div>
        <div className="mt-2 text-[10px] text-emerald-800 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Données chiffrées CIL / RGPD</span>
        </div>
      </div>

    </aside>
  );
};
