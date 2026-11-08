import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  UserCheck, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Eye, 
  Database,
  Building,
  KeyRound
} from 'lucide-react';
import { AuditLogRGPD, Patient } from '../types/clinic';
import { CLINIC_INFO } from '../data/mockClinicData';
import { ClinicStorageService } from '../services/clinicStorage';

interface RgpdViewProps {
  auditLogs: AuditLogRGPD[];
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export const RgpdView: React.FC<RgpdViewProps> = ({
  auditLogs,
  patients,
  onSelectPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = 
        log.utilisateurNom.toLowerCase().includes(q) ||
        (log.patientNom && log.patientNom.toLowerCase().includes(q)) ||
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleExportAuditLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Registre_Audit_CIL_BF_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadNotice("Registre légal d'audit CIL téléchargé avec succès.");
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Conformité RGPD & Protection des Données (CIL Burkina Faso)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Application stricte de la Loi N° 001-2021/AN relative à la protection des données de santé et traçabilité immuable
          </p>
        </div>

        <button
          onClick={handleExportAuditLogs}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span>Exporter le Registre d'Audit (JSON)</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* CIL Burkina Faso Official Registry Certificate Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 uppercase font-mono font-bold">
                Commission de l'Informatique et des Libertés (CIL) · Burkina Faso
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Récépissé de Conformité Sanitaire N° {CLINIC_INFO.registreCil}
              </h2>
              <div className="text-xs text-slate-300">
                Établissement titulaire : {CLINIC_INFO.nom} (Ouaga 2000)
              </div>
            </div>
          </div>

          <div className="text-right text-xs shrink-0 font-mono">
            <div className="text-emerald-400 font-bold">STATUT : AUDITÉ ET HOMOLOGUÉ</div>
            <div className="text-slate-400">Référent DPO : Dr. Salimata Ouédraogo</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Chiffrement au Repos</div>
            <div className="font-bold text-white font-mono mt-0.5">AES-256 bits GCM</div>
            <div className="text-slate-400 text-[10px] mt-1">Clés gérées par HSM souverain</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Durée de Conservation</div>
            <div className="font-bold text-white font-mono mt-0.5">20 Ans (Code Santé BF)</div>
            <div className="text-slate-400 text-[10px] mt-1">Archivage médical légal garanti</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-slate-400 text-[11px]">Contrôle d'Accès</div>
            <div className="font-bold text-white font-mono mt-0.5">MFA / 2FA Obligatoire</div>
            <div className="text-slate-400 text-[10px] mt-1">Séparation des privilèges RBAC</div>
          </div>
        </div>
      </div>

      {/* Patient Data Rights Center */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Exercice des Droits des Personnes Concernées (Droits RGPD / CIL)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Accès instantané aux dossiers, téléchargement du paquet de données de santé et gestion des consentements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-teal-700" />
              <span>Droit d'Accès & Rectification</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Tout patient de la Clinique Wend-Panga peut demander la consultation intégrale de son historique médical et la mise à jour de ses données administratives.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-teal-700" />
              <span>Droit à la Portabilité</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Export sécurisé du dossier patient complet sous format standardisé (JSON structuré conforme FHIR) pour transmission à un autre centre hospitalier.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-teal-700" />
              <span>Confidentialité & Secret Médical</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Toutes les consultations et prescriptions sont protégées par le secret professionnel et le serment d'Hippocrate des praticiens agréés.
            </p>
          </div>
        </div>
      </div>

      {/* Immutable Access & Audit Trail Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-700" />
              <span>Journal d'Audit Immuable des Accès aux Données</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Traçabilité certifiée de chaque consultation de dossier médical, modification et ordonnance émise
            </p>
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filtrer action :</span>
            <select
              aria-label="Filtrer par action"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
            >
              <option value="all">Toutes les actions ({auditLogs.length})</option>
              <option value="CONSULTATION_DOSSIER">Consultation de dossier</option>
              <option value="GENERATION_ORDONNANCE">Génération ordonnance</option>
              <option value="EXPORT_DONNEES">Exportation de données</option>
              <option value="CONNEXION_MFA">Connexion 2FA/MFA</option>
              <option value="CONSENTEMENT_ENREGISTRE">Consentement enregistré</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-3">Horodatage</th>
                <th className="py-2.5 px-3">Agent / Rôle</th>
                <th className="py-2.5 px-3">Action Enregistrée</th>
                <th className="py-2.5 px-3">Patient Concerné</th>
                <th className="py-2.5 px-3">Détails de l'Événement</th>
                <th className="py-2.5 px-3">Adresse IP</th>
                <th className="py-2.5 px-3 text-right">Statut CIL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                    {log.dateHeure}
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <div className="font-bold text-slate-900">{log.utilisateurNom}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{log.roleUtilisateur}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold font-mono bg-teal-50 text-teal-900 border border-teal-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    {log.patientNom ? (
                      <button
                        onClick={() => log.patientId && onSelectPatient(log.patientId)}
                        className="font-bold text-slate-800 hover:text-teal-700 transition-colors text-left"
                      >
                        {log.patientNom}
                      </button>
                    ) : (
                      <span className="text-slate-400 italic">Système global</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-700 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {log.adresseIP}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold font-sans">
                      CONFORME CIL
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
