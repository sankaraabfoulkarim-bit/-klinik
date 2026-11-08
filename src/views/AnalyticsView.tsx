import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  PieChart,
  Calendar,
  Building
} from 'lucide-react';
import { CLINIC_INFO, STATISTIQUES_INITIAUX } from '../data/mockClinicData';
import { Patient, Facture, RendezVous } from '../types/clinic';
import { ClinicStorageService } from '../services/clinicStorage';

interface AnalyticsViewProps {
  patients: Patient[];
  factures: Facture[];
  rendezVous: RendezVous[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  patients,
  factures,
  rendezVous
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'mois' | 'trimestre' | 'annee'>('mois');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Dynamic calculations
  const totalRecettes = factures.filter(f => f.statut === 'payee').reduce((sum, f) => sum + f.montantRegleFcfa, 0);

  // Export CSV of patients
  const handleExportPatientsCsv = () => {
    const headers = ["ID", "Code Patient", "Nom", "Prenom", "Date Naissance", "Sexe", "Groupe Sanguin", "Telephone", "Quartier", "Assurance", "Taux", "Allergies", "MFA Actif"];
    const rows = patients.map(p => [
      p.id,
      p.codePatient,
      p.nom,
      p.prenom,
      p.dateNaissance,
      p.sexe,
      p.groupeSanguin,
      p.telephone,
      p.quartier,
      p.priseEnCharge.compagnie || 'Non Assure',
      p.priseEnCharge.taux ? `${p.priseEnCharge.taux}%` : '0%',
      `"${p.allergies.join('; ')}"`,
      p.mfaActif ? 'OUI' : 'NON'
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Registre_Patients_${CLINIC_INFO.nom.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    ClinicStorageService.logAudit({
      action: 'EXPORT_DONNEES',
      details: `Export CSV de la liste complète des patients (${patients.length} dossiers)`,
      utilisateurNom: 'Dr. Salimata Ouédraogo',
      roleUtilisateur: 'medecin'
    });

    setExportNotice("Export CSV des dossiers patients téléchargé avec succès.");
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Export SNIS National Health Report
  const handleExportSnisReport = () => {
    const snisText = `
========================================================================
MINISTÈRE DE LA SANTÉ ET DE L'HYGIÈNE PUBLIQUE - BURKINA FASO
SYSTÈME NATIONAL D'INFORMATION SANITAIRE (SNIS) - DHIS2
RAPPORT MENSUEL DE MORBIDITÉ ET D'ACTIVITÉ CLINIQUE PRIVÉE
========================================================================
Établissement : ${CLINIC_INFO.nom}
District Sanitaire : Ouagadougou / Région du Centre
Agrément Ministériel : ${CLINIC_INFO.agrementMinistere}
Période : Novembre 2026
Directeur Médical : ${CLINIC_INFO.directeurMedical}
Date d'extraction : ${new Date().toISOString()}

1. MORBIDITÉ ET CONSULTATIONS MÉDICALES :
- Total Dossiers Patients Enregistrés : ${patients.length}
- Consultations Totales du Mois : ${STATISTIQUES_INITIAUX.consultationsCeMois}
- Paludisme Simple & Grave (B50) : 38% (130 cas confirmés TDR/GE)
- Hypertension Artérielle (I10) : 24% (82 patients sous protocole)
- Infections Respiratoires Aiguës (J20) : 16% (55 cas)
- Diabète de type 1 et 2 (E11) : 12% (41 patients suivis)
- Gastro-entérites et parasitoses : 10% (34 cas)

2. DISPOSITIF VACCINAL ET PRÉVENTIF (PEV) :
- Suivis Pédiatriques Réalisés : 48 enfants
- Consultations Prénatales (CPN 1-4) : 62 femmes enceintes
- Taux de Délivrance des Rappels SMS de Vaccination : 98.4%

3. GOUVERNANCE ET STATUT CIL / RGPD :
- Conformité CIL Burkina Faso : N° ${CLINIC_INFO.registreCil}
- Chiffrement des bases : AES-256
- Télédéclarations DHIS2 : Validées et conformes

Certifié exact par le Médecin-Chef de la Clinique Wend-Panga.
========================================================================
    `;

    const blob = new Blob([snisText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Rapport_SNIS_DHIS2_Clinique_WendPanga_Nov2026.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    ClinicStorageService.logAudit({
      action: 'EXPORT_DONNEES',
      details: 'Export du rapport épidémiologique mensuel pour le SNIS Ministère de la Santé',
      utilisateurNom: 'Dr. Salimata Ouédraogo',
      roleUtilisateur: 'medecin'
    });

    setExportNotice("Rapport officiel SNIS (Ministère de la Santé) exporté avec succès.");
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Export Financial CSV
  const handleExportFinancesCsv = () => {
    const headers = ["Numero Facture", "Date", "Patient", "Montant Brut FCFA", "Part Assurance FCFA", "Taux Mutuelle", "Compagnie", "Part Patient FCFA", "Regle FCFA", "Statut", "Mode Paiement", "Ref Paiement"];
    const rows = factures.map(f => [
      f.numeroFacture,
      f.dateEmission,
      `"${f.patientNom}"`,
      f.montantTotalFcfa,
      f.partAssuranceFcfa,
      `${f.tauxAssurancePourcentage}%`,
      f.nomCompagnieAssurance || 'Non Assure',
      f.partPatientFcfa,
      f.montantRegleFcfa,
      f.statut,
      f.modePaiement || 'En attente',
      f.referencePaiement || 'N/A'
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Journal_Caisse_${CLINIC_INFO.nom.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    ClinicStorageService.logAudit({
      action: 'EXPORT_DONNEES',
      details: 'Export CSV du journal de caisse et de facturation',
      utilisateurNom: 'Rasmata Ilboudo',
      roleUtilisateur: 'comptable'
    });

    setExportNotice("Journal de caisse financier exporté avec succès.");
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Title and Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Statistiques Cliniques & Exportation de Rapports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyses épidémiologiques locales, indicateurs financiers en FCFA et déclarations sanitaires SNIS
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportPatientsCsv}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-700" />
            <span>Export Patients (CSV)</span>
          </button>

          <button
            onClick={handleExportFinancesCsv}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Journal Caisse (CSV)</span>
          </button>

          <button
            onClick={handleExportSnisReport}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Rapport SNIS Burkina</span>
          </button>
        </div>
      </div>

      {/* Export notification alert banner */}
      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Consultations Mensuelles</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">{STATISTIQUES_INITIAUX.consultationsCeMois}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">+14.2% vs mois précédent</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Taux d'Occupation Lits</div>
          <div className="mt-2 text-2xl font-bold font-mono text-teal-800">{STATISTIQUES_INITIAUX.tauxOccupationLits}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Capacité : 24 lits d'hospitalisation</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Chiffre d'Affaires Mensuel</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {STATISTIQUES_INITIAUX.chiffreAffairesMoisFcfa.toLocaleString('fr-FR')} <span className="text-xs">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{STATISTIQUES_INITIAUX.partAssurancePourcent}% couvert par mutuelles</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Patients Suivis Actifs</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">{STATISTIQUES_INITIAUX.totalPatientsActifs}</div>
          <div className="text-[11px] text-slate-500 mt-1">Dossiers conformes CIL/RGPD</div>
        </div>
      </div>

      {/* Two Column Visual Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Epidemiological Distribution (Pathologies à Ouagadougou) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Prévalence des Pathologies (Ouagadougou)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Statistiques sanitaires déclarées pour le Ministère de la Santé
              </p>
            </div>
            <Activity className="w-4 h-4 text-teal-700" />
          </div>

          <div className="space-y-3 pt-2">
            {STATISTIQUES_INITIAUX.pathologiesFrequentes.map((patho, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{patho.nom}</span>
                  <div className="font-mono text-slate-600">
                    <span className="font-bold text-slate-900">{patho.pourcentage}%</span> ({patho.count} cas)
                  </div>
                </div>
                
                {/* Visual progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-rose-500' :
                      idx === 1 ? 'bg-amber-500' :
                      idx === 2 ? 'bg-teal-600' :
                      idx === 3 ? 'bg-blue-600' : 'bg-purple-600'
                    }`}
                    style={{ width: `${patho.pourcentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Source : Registre de morbidité Wend-Panga</span>
            <span>Protocole OMS / MS Burkina</span>
          </div>
        </div>

        {/* Right: Payment modes distribution in Burkina Faso */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Répartition des Règlements de Soins
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ventilation des recettes par canal de paiement local
              </p>
            </div>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="space-y-3 pt-2">
            {STATISTIQUES_INITIAUX.repartitionPaiements.map((pay, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{pay.mode}</span>
                  <div className="font-mono text-slate-600">
                    <span className="font-bold text-slate-900">{pay.part}%</span> · {pay.montant.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-orange-500' :
                      idx === 1 ? 'bg-teal-600' :
                      idx === 2 ? 'bg-blue-500' :
                      idx === 3 ? 'bg-slate-700' : 'bg-sky-500'
                    }`}
                    style={{ width: `${pay.part}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Passerelle Orange / Moov / Wave / GIM-UEMOA</span>
            <span className="text-emerald-700 font-semibold">Zéro rejet bancaire</span>
          </div>
        </div>

      </div>

      {/* SNIS Official Statement Card */}
      <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-teal-700" />
            <span>Interopérabilité SNIS (Système National d'Information Sanitaire)</span>
          </div>
          <p className="text-xs text-slate-700 mt-1 max-w-2xl leading-relaxed">
            La Clinique Médicale Wend-Panga est homologuée pour la transmission mensuelle dématérialisée des fiches épidémiologiques vers la plateforme nationale DHIS2 du Ministère de la Santé du Burkina Faso.
          </p>
        </div>

        <button
          onClick={handleExportSnisReport}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start md:self-auto"
        >
          Générer la Quittance SNIS Officielle
        </button>
      </div>

    </div>
  );
};
