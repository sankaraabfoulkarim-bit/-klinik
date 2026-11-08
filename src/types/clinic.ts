export type Sexe = 'M' | 'F';

export type GroupeSanguin = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type RoleUtilisateur = 'medecin' | 'infirmier' | 'secretaire' | 'comptable' | 'admin';

export interface PriseEnChargeAssurance {
  assure: boolean;
  compagnie?: 'CNSS' | 'Sonar' | 'Saham / Sanlam' | 'UAB' | 'Coris Assurances' | 'Sunu Assurances' | 'Gras Savoye' | 'Autre';
  taux?: number; // e.g. 80 pour 80%
  matricule?: string;
  plafondFcfa?: number;
}

export interface Patient {
  id: string;
  codePatient: string; // Ex: WP-OUA-2026-0421
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: Sexe;
  groupeSanguin: GroupeSanguin;
  telephone: string; // +226 XX XX XX XX
  email?: string;
  ville: string; // Ouagadougou
  quartier: string; // Ouaga 2000, Somgandé, Gounghin, Koulouba, Pissy, etc.
  profession?: string;
  contactUrgenceNom: string;
  contactUrgenceTel: string;
  contactUrgenceLien: string;
  allergies: string[];
  antecedentsMedicaux: string[];
  antecedentsChirurgicaux: string[];
  priseEnCharge: PriseEnChargeAssurance;
  dateCreation: string;
  mfaActif: boolean;
  mfaMethode?: 'sms_otp' | 'authenticator_app';
  statutDossier: 'actif' | 'archive';
}

export interface ConstanteVitale {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD HH:mm
  tensionArterielle: string; // ex: "12/8"
  frequenceCardiaque: number; // bpm
  temperature: number; // °C
  glycemie?: number; // g/L
  saturationO2: number; // %
  poids: number; // kg
  taille: number; // cm
  imc: number;
  agentNom: string;
  notes?: string;
}

export interface MedicamentPrescription {
  nom: string;
  dosage: string;
  forme: string; // Comprimé, Sirop, Injectable, Gélule
  posologie: string; // ex: 1 cp matin et soir
  duree: string; // ex: 5 jours
  instructions?: string; // ex: au milieu des repas
}

export interface Ordonnance {
  id: string;
  codeOrdonnance: string;
  consultationId?: string;
  patientId: string;
  patientNom: string;
  praticienNom: string;
  praticienSpecialite: string;
  date: string;
  medicaments: MedicamentPrescription[];
  instructionsGenerales?: string;
  qrCodeValidation: string;
  signee: boolean;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientNom: string;
  praticienId: string;
  praticienNom: string;
  specialite: string;
  date: string;
  heure: string;
  motif: string;
  symptomes: string;
  examenClinique: string;
  diagnosticPrincipal: string; // ex: B50.0 - Paludisme grave à Plasmodium falciparum
  codeCim10?: string;
  diagnosticsSecondaires: string[];
  conduiteATenir: string;
  ordonnanceId?: string;
  statut: 'en_cours' | 'cloturee';
}

export interface DocumentMedical {
  id: string;
  patientId: string;
  titre: string;
  type: 'analyse_labo' | 'radiographie' | 'echographie' | 'compte_rendu' | 'certificat' | 'ordonnance';
  date: string;
  praticien: string;
  laboratoireOuService: string;
  conclusion: string;
  tailleFichier: string;
  nomFichier: string;
  contenuTexte?: string;
}

export type StatutRDV = 'planifie' | 'confirme' | 'salle_attente' | 'en_consultation' | 'termine' | 'annule' | 'no_show';

export interface RendezVous {
  id: string;
  patientId: string;
  patientNom: string;
  patientTel: string;
  praticienId: string;
  praticienNom: string;
  specialite: string;
  date: string; // YYYY-MM-DD
  heure: string; // HH:mm
  dureeMinutes: number;
  motif: string;
  type: 'consultation' | 'suivi' | 'urgence' | 'bilan' | 'examen' | 'teleconsultation';
  statut: StatutRDV;
  rappelSmsEnvoye: boolean;
  rappelSmsDate?: string;
  notes?: string;
  montantEstimeFcfa: number;
}

export type StatutSMS = 'programme' | 'envoye' | 'delivre' | 'echec';
export type OperateurTelecom = 'Orange Burkina' | 'Moov Africa Burkina' | 'Telecel Faso';

export interface RappelSMS {
  id: string;
  patientId: string;
  patientNom: string;
  telephone: string;
  typeRappel: 'rdv_j1' | 'rdv_h2' | 'suivi_j3' | 'renouvellement_ttt' | 'resultat_labo' | 'rappel_vaccin';
  message: string;
  dateProgrammee: string;
  dateEnvoiEffectif?: string;
  statut: StatutSMS;
  operateur: OperateurTelecom;
  coutFcfa: number; // ex: 25 FCFA
  accusereceptionId?: string;
}

export interface NotificationSuivi {
  id: string;
  patientId: string;
  patientNom: string;
  patientTel: string;
  typeSuivi: 'post_operatoire' | 'chronique_hta' | 'chronique_diabete' | 'vaccination_nourrisson' | 'grossesse_cpon' | 'arret_traitement';
  titre: string;
  dateEcheance: string;
  intervalleJours: number;
  recommandation: string;
  statut: 'active' | 'terminee' | 'en_retard';
  priorite: 'haute' | 'moyenne' | 'standard';
  actionPrevue: string;
}

export interface ActeFacture {
  id: string;
  codeActe: string;
  designation: string;
  quantite: number;
  prixUnitaireFcfa: number;
  totalFcfa: number;
}

export type ModePaiement = 'orange_money' | 'moov_money' | 'wave' | 'carte_bancaire' | 'especes';
export type StatutFacture = 'payee' | 'partielle' | 'en_attente' | 'annulee';

export interface Facture {
  id: string;
  numeroFacture: string; // FAC-2026-0814
  patientId: string;
  patientNom: string;
  dateEmission: string;
  actes: ActeFacture[];
  montantTotalFcfa: number;
  partAssuranceFcfa: number;
  tauxAssurancePourcentage: number;
  nomCompagnieAssurance?: string;
  partPatientFcfa: number;
  montantRegleFcfa: number;
  resteAPayerFcfa: number;
  statut: StatutFacture;
  modePaiement?: ModePaiement;
  referencePaiement?: string;
  dateReglement?: string;
  caissierNom: string;
  notes?: string;
}

export interface AuditLogRGPD {
  id: string;
  dateHeure: string;
  utilisateurNom: string;
  roleUtilisateur: RoleUtilisateur;
  action: 'CONSULTATION_DOSSIER' | 'MODIFICATION_DOSSIER' | 'EXPORT_DONNEES' | 'SUPPRESSION_DONNEES' | 'CONSENTEMENT_ENREGISTRE' | 'CONNEXION_MFA' | 'ECHEC_CONNEXION' | 'GENERATION_ORDONNANCE';
  patientId?: string;
  patientNom?: string;
  details: string;
  adresseIP: string;
  statutConformite: 'CONFORME_CIL_BF';
}

export interface ConsentementRGPD {
  patientId: string;
  patientNom: string;
  dateConsentement: string;
  typeConsentement: 'traitement_donnees_medicales' | 'partage_assurance' | 'rappels_sms' | 'recherche_epidemiologique';
  accorde: boolean;
  signataireNom: string;
  canal: 'numerique_sur_tablette' | 'formulaire_papier_scanne';
}

export interface PlateformeSanteSync {
  id: string;
  nom: string;
  standard: 'FHIR R4' | 'HL7 v2.5' | 'DICOM 3.0' | 'API REST SNIS (DHIS2)' | 'Norme CIL Burkina';
  description: string;
  statut: 'operationnel' | 'synchronisation' | 'hors_ligne' | 'avertissement';
  derniereSynchronisation: string;
  paquetsTransmis: number;
  tauxReussite: number;
  prochaineSync: string;
  logsRecents: string[];
}

export interface Praticien {
  id: string;
  nom: string;
  titre: string;
  specialite: string;
  telephone: string;
  email: string;
  horaires: string;
  avatarUrl?: string;
  disponibleAujourdhui: boolean;
}
