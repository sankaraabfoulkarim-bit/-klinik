import React, { useState } from 'react';
import { 
  Network, 
  RefreshCw, 
  CheckCircle2, 
  Server, 
  Activity, 
  FileCode, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { PlateformeSanteSync } from '../types/clinic';
import { ClinicStorageService } from '../services/clinicStorage';

interface HealthSyncViewProps {
  plateformes: PlateformeSanteSync[];
  onRefreshData: () => void;
}

export const HealthSyncView: React.FC<HealthSyncViewProps> = ({
  plateformes,
  onRefreshData
}) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSyncPlatform = (id: string, nom: string) => {
    setSyncingId(id);
    setTimeout(() => {
      ClinicStorageService.syncPlateforme(id);
      setSyncingId(null);
      setSuccessNotice(`Synchronisation réussie avec ${nom}. Paquets de données de santé transmis et acquittés.`);
      setTimeout(() => setSuccessNotice(null), 4000);
      onRefreshData();
    }, 1500);
  };

  const handleSyncAll = () => {
    setSyncingId('all');
    setTimeout(() => {
      plateformes.forEach(p => ClinicStorageService.syncPlateforme(p.id));
      setSyncingId(null);
      setSuccessNotice("Toutes les plateformes de santé partenaires ont été synchronisées en temps réel.");
      setTimeout(() => setSuccessNotice(null), 4000);
      onRefreshData();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-teal-700" />
            <span>Synchronisation en Temps Réel avec les Plateformes de Santé</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interopérabilité biomédicale internationale (FHIR R4, HL7 v2.5, DICOM 3.0) et raccordement au SNIS Burkina Faso
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={syncingId !== null}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${syncingId ? 'animate-spin' : ''}`} />
          <span>Synchroniser Tous les Flux en Direct</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Global Health Interoperability Hub Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-400 flex items-center justify-center shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-teal-400 font-mono font-bold uppercase">
                Passerelle d'Intégration Ouagadougou
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Moteur d'Échange & Bus Sanitaire HL7 / FHIR
              </h2>
              <div className="text-xs text-slate-300">
                Liaisons sécurisées TLS 1.3 bidirectionnelles avec les serveurs du Ministère et du laboratoire
              </div>
            </div>
          </div>

          <div className="text-right text-xs shrink-0 font-mono">
            <div className="text-emerald-400 font-bold">FLUX ACTIFS : 4 CONNECTEURS</div>
            <div className="text-slate-400">Latence moyenne : 18 ms</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Paquets Échangés</div>
            <div className="font-bold text-white font-mono mt-0.5">
              {plateformes.reduce((acc, p) => acc + p.paquetsTransmis, 0).toLocaleString('fr-FR')}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Taux de Réussite</div>
            <div className="font-bold text-emerald-400 font-mono mt-0.5">99.7%</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Standard Principal</div>
            <div className="font-bold text-teal-300 font-mono mt-0.5">FHIR R4 / HL7</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Conformité CIL</div>
            <div className="font-bold text-emerald-400 font-mono mt-0.5">Certifiée</div>
          </div>
        </div>
      </div>

      {/* Connected Platforms Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plateformes.map((plat) => (
          <div key={plat.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 flex flex-col justify-between">
            
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {plat.standard}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                    {plat.nom}
                  </h3>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800 flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Opérationnel</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {plat.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-400 text-[10px] block font-sans">Dernière synchro :</span>
                  <span className="font-semibold text-slate-800">{plat.derniereSynchronisation.slice(11)}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-400 text-[10px] block font-sans">Paquets transmis :</span>
                  <span className="font-semibold text-slate-800">{plat.paquetsTransmis.toLocaleString('fr-FR')}</span>
                </div>
              </div>

              {/* Recent Logs Box */}
              <div className="bg-slate-900 text-teal-300 p-2.5 rounded-lg font-mono text-[11px] space-y-1">
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-sans font-bold">
                  Journal d'échange temps réel :
                </div>
                {plat.logsRecents.map((log, idx) => (
                  <div key={idx} className="truncate text-[10px]" title={log}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Prochaine : {plat.prochaineSync}
              </span>

              <button
                onClick={() => handleSyncPlatform(plat.id, plat.nom)}
                disabled={syncingId !== null}
                className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === plat.id ? 'animate-spin' : ''}`} />
                <span>Synchroniser Flux</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
