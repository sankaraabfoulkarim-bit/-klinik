import { 
  Patient, 
  ConstanteVitale, 
  Consultation, 
  Ordonnance, 
  DocumentMedical, 
  RendezVous, 
  RappelSMS, 
  NotificationSuivi, 
  Facture, 
  AuditLogRGPD, 
  PlateformeSanteSync,
  StatutRDV,
  ModePaiement,
  RoleUtilisateur
} from '../types/clinic';
import { 
  PATIENTS_INITIAUX, 
  CONSTANTES_INITIALES, 
  CONSULTATIONS_INITIALES, 
  ORDONNANCES_INITIALES, 
  DOCUMENTS_MEDICAUX_INITIAUX, 
  RENDEZ_VOUS_INITIAUX, 
  RAPPELS_SMS_INITIAUX, 
  NOTIFICATIONS_SUIVI_INITIALES, 
  FACTURES_INITIALES, 
  AUDIT_LOGS_RGPD_INITIAUX, 
  PLATEFORMES_SANTE_INITIALES 
} from '../data/mockClinicData';

const STORAGE_KEYS = {
  PATIENTS: 'cwp_patients',
  CONSTANTES: 'cwp_constantes',
  CONSULTATIONS: 'cwp_consultations',
  ORDONNANCES: 'cwp_ordonnances',
  DOCUMENTS: 'cwp_documents',
  RENDEZ_VOUS: 'cwp_rdv',
  SMS: 'cwp_sms',
  SUIVIS: 'cwp_suivis',
  FACTURES: 'cwp_factures',
  AUDIT_LOGS: 'cwp_audit_logs',
  PLATEFORMES: 'cwp_plateformes',
  CURRENT_USER: 'cwp_current_user'
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Erreur d'écriture localStorage (${key}):`, err);
  }
}

export class ClinicStorageService {
  // --- Patients ---
  static getPatients(): Patient[] {
    return getFromStorage<Patient[]>(STORAGE_KEYS.PATIENTS, PATIENTS_INITIAUX);
  }

  static getPatientById(id: string): Patient | undefined {
    return this.getPatients().find(p => p.id === id);
  }

  static savePatient(patient: Patient, userNom = 'Dr. Salimata Ouédraogo', role: RoleUtilisateur = 'medecin'): Patient {
    const patients = this.getPatients();
    const existingIndex = patients.findIndex(p => p.id === patient.id);
    let updated: Patient[];

    if (existingIndex >= 0) {
      patients[existingIndex] = patient;
      updated = [...patients];
      this.logAudit({
        action: 'MODIFICATION_DOSSIER',
        patientId: patient.id,
        patientNom: `${patient.nom} ${patient.prenom}`,
        details: `Mise à jour du dossier patient et prise en charge`,
        utilisateurNom: userNom,
        roleUtilisateur: role
      });
    } else {
      updated = [patient, ...patients];
      this.logAudit({
        action: 'CONSENTEMENT_ENREGISTRE',
        patientId: patient.id,
        patientNom: `${patient.nom} ${patient.prenom}`,
        details: `Création du dossier médical et recueil consentement RGPD/CIL`,
        utilisateurNom: userNom,
        roleUtilisateur: role
      });
    }

    saveToStorage(STORAGE_KEYS.PATIENTS, updated);
    return patient;
  }

  // --- Constantes vitales ---
  static getConstantes(patientId?: string): ConstanteVitale[] {
    const list = getFromStorage<ConstanteVitale[]>(STORAGE_KEYS.CONSTANTES, CONSTANTES_INITIALES);
    if (!patientId) return list;
    return list.filter(c => c.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date));
  }

  static addConstante(constante: ConstanteVitale, userNom = 'Infirmière K. Zongo'): ConstanteVitale {
    const list = this.getConstantes();
    const updated = [constante, ...list];
    saveToStorage(STORAGE_KEYS.CONSTANTES, updated);
    return constante;
  }

  // --- Consultations ---
  static getConsultations(patientId?: string): Consultation[] {
    const list = getFromStorage<Consultation[]>(STORAGE_KEYS.CONSULTATIONS, CONSULTATIONS_INITIALES);
    if (!patientId) return list;
    return list.filter(c => c.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date));
  }

  static addConsultation(consultation: Consultation): Consultation {
    const list = this.getConsultations();
    const updated = [consultation, ...list];
    saveToStorage(STORAGE_KEYS.CONSULTATIONS, updated);
    this.logAudit({
      action: 'MODIFICATION_DOSSIER',
      patientId: consultation.patientId,
      patientNom: consultation.patientNom,
      details: `Nouvelle consultation enregistrée par ${consultation.praticienNom} (Diagnostic: ${consultation.diagnosticPrincipal})`,
      utilisateurNom: consultation.praticienNom,
      roleUtilisateur: 'medecin'
    });
    return consultation;
  }

  // --- Ordonnances ---
  static getOrdonnances(patientId?: string): Ordonnance[] {
    const list = getFromStorage<Ordonnance[]>(STORAGE_KEYS.ORDONNANCES, ORDONNANCES_INITIALES);
    if (!patientId) return list;
    return list.filter(o => o.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date));
  }

  static addOrdonnance(ordonnance: Ordonnance): Ordonnance {
    const list = this.getOrdonnances();
    const updated = [ordonnance, ...list];
    saveToStorage(STORAGE_KEYS.ORDONNANCES, updated);
    this.logAudit({
      action: 'GENERATION_ORDONNANCE',
      patientId: ordonnance.patientId,
      patientNom: ordonnance.patientNom,
      details: `Ordonnance numérique scellée avec QR Code (${ordonnance.medicaments.length} prescriptions)`,
      utilisateurNom: ordonnance.praticienNom,
      roleUtilisateur: 'medecin'
    });
    return ordonnance;
  }

  // --- Documents Médicaux ---
  static getDocuments(patientId?: string): DocumentMedical[] {
    const list = getFromStorage<DocumentMedical[]>(STORAGE_KEYS.DOCUMENTS, DOCUMENTS_MEDICAUX_INITIAUX);
    if (!patientId) return list;
    return list.filter(d => d.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date));
  }

  static addDocument(document: DocumentMedical): DocumentMedical {
    const list = this.getDocuments();
    const updated = [document, ...list];
    saveToStorage(STORAGE_KEYS.DOCUMENTS, updated);
    return document;
  }

  // --- Rendez-vous ---
  static getRendezVous(): RendezVous[] {
    return getFromStorage<RendezVous[]>(STORAGE_KEYS.RENDEZ_VOUS, RENDEZ_VOUS_INITIAUX);
  }

  static saveRendezVous(rdv: RendezVous): RendezVous {
    const list = this.getRendezVous();
    const index = list.findIndex(r => r.id === rdv.id);
    let updated: RendezVous[];
    if (index >= 0) {
      list[index] = rdv;
      updated = [...list];
    } else {
      updated = [rdv, ...list];
    }
    saveToStorage(STORAGE_KEYS.RENDEZ_VOUS, updated);
    return rdv;
  }

  static updateRdvStatut(rdvId: string, nouveauStatut: StatutRDV): RendezVous | null {
    const list = this.getRendezVous();
    const rdv = list.find(r => r.id === rdvId);
    if (!rdv) return null;
    rdv.statut = nouveauStatut;
    saveToStorage(STORAGE_KEYS.RENDEZ_VOUS, [...list]);
    return rdv;
  }

  // --- Rappels SMS ---
  static getSmsLogs(): RappelSMS[] {
    return getFromStorage<RappelSMS[]>(STORAGE_KEYS.SMS, RAPPELS_SMS_INITIAUX);
  }

  static sendSms(smsData: Omit<RappelSMS, 'id' | 'dateEnvoiEffectif' | 'statut' | 'accusereceptionId'>): RappelSMS {
    const list = this.getSmsLogs();
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newSms: RappelSMS = {
      ...smsData,
      id: `SMS-${Date.now().toString().slice(-6)}`,
      dateEnvoiEffectif: nowStr,
      statut: 'delivre',
      accusereceptionId: `DELIV_${smsData.operateur.startsWith('Orange') ? 'ORA' : 'MOOV'}_${Math.floor(100000 + Math.random() * 900000)}`
    };
    const updated = [newSms, ...list];
    saveToStorage(STORAGE_KEYS.SMS, updated);
    return newSms;
  }

  // --- Notifications de Suivi ---
  static getSuivis(): NotificationSuivi[] {
    return getFromStorage<NotificationSuivi[]>(STORAGE_KEYS.SUIVIS, NOTIFICATIONS_SUIVI_INITIALES);
  }

  static updateSuiviStatut(id: string, statut: 'active' | 'terminee' | 'en_retard'): void {
    const list = this.getSuivis();
    const suivi = list.find(s => s.id === id);
    if (suivi) {
      suivi.statut = statut;
      saveToStorage(STORAGE_KEYS.SUIVIS, [...list]);
    }
  }

  static addSuivi(suivi: NotificationSuivi): void {
    const list = this.getSuivis();
    saveToStorage(STORAGE_KEYS.SUIVIS, [suivi, ...list]);
  }

  // --- Factures & Paiements ---
  static getFactures(): Facture[] {
    return getFromStorage<Facture[]>(STORAGE_KEYS.FACTURES, FACTURES_INITIALES);
  }

  static saveFacture(facture: Facture): Facture {
    const list = this.getFactures();
    const index = list.findIndex(f => f.id === facture.id);
    let updated: Facture[];
    if (index >= 0) {
      list[index] = facture;
      updated = [...list];
    } else {
      updated = [facture, ...list];
    }
    saveToStorage(STORAGE_KEYS.FACTURES, updated);
    return facture;
  }

  static reglerFacture(factureId: string, mode: ModePaiement, referencePaiement: string, caissierNom: string): Facture | null {
    const list = this.getFactures();
    const facture = list.find(f => f.id === factureId);
    if (!facture) return null;
    facture.statut = 'payee';
    facture.montantRegleFcfa = facture.resteAPayerFcfa;
    facture.resteAPayerFcfa = 0;
    facture.modePaiement = mode;
    facture.referencePaiement = referencePaiement;
    facture.dateReglement = new Date().toISOString().replace('T', ' ').substring(0, 16);
    facture.caissierNom = caissierNom;
    saveToStorage(STORAGE_KEYS.FACTURES, [...list]);
    return facture;
  }

  // --- Audit Logs RGPD & CIL ---
  static getAuditLogs(): AuditLogRGPD[] {
    return getFromStorage<AuditLogRGPD[]>(STORAGE_KEYS.AUDIT_LOGS, AUDIT_LOGS_RGPD_INITIAUX);
  }

  static logAudit(params: {
    action: AuditLogRGPD['action'];
    details: string;
    patientId?: string;
    patientNom?: string;
    utilisateurNom: string;
    roleUtilisateur: RoleUtilisateur;
  }): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLogRGPD = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      dateHeure: new Date().toISOString().replace('T', ' ').substring(0, 19),
      utilisateurNom: params.utilisateurNom,
      roleUtilisateur: params.roleUtilisateur,
      action: params.action,
      patientId: params.patientId,
      patientNom: params.patientNom,
      details: params.details,
      adresseIP: '192.168.10.42 (Réseau Local Clinique Wend-Panga)',
      statutConformite: 'CONFORME_CIL_BF'
    };
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  }

  // --- Synchronisation Plateformes de Santé ---
  static getPlateformes(): PlateformeSanteSync[] {
    return getFromStorage<PlateformeSanteSync[]>(STORAGE_KEYS.PLATEFORMES, PLATEFORMES_SANTE_INITIALES);
  }

  static syncPlateforme(plateformeId: string): PlateformeSanteSync | null {
    const list = this.getPlateformes();
    const plat = list.find(p => p.id === plateformeId);
    if (!plat) return null;

    plat.statut = 'synchronisation';
    saveToStorage(STORAGE_KEYS.PLATEFORMES, [...list]);

    // Update with timestamp and success log
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    plat.statut = 'operationnel';
    plat.derniereSynchronisation = nowStr;
    plat.paquetsTransmis += Math.floor(10 + Math.random() * 25);
    plat.logsRecents = [
      `[${nowStr.slice(11)}] Synchronisation en temps réel déclenchée avec succès. Flux ${plat.standard} chiffré TLS 1.3`,
      ...plat.logsRecents.slice(0, 3)
    ];

    saveToStorage(STORAGE_KEYS.PLATEFORMES, [...list]);
    return plat;
  }
}
