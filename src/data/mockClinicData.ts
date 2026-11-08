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
  ConsentementRGPD, 
  PlateformeSanteSync, 
  Praticien 
} from '../types/clinic';

export const CLINIC_INFO = {
  nom: "Clinique Médicale Privée Wend-Panga",
  slogan: "Excellence Médicale & Soins Humanisés au Cœur de Ouagadougou",
  ville: "Ouagadougou",
  pays: "Burkina Faso",
  adresse: "Avenue Pascal Zagre, Secteur 15, Ouaga 2000",
  telephone: "+226 25 37 40 40",
  urgences: "+226 70 20 11 22",
  email: "contact@clinique-wendpanga.bf",
  agrementMinistere: "N° 2018-042/MS/SG/DGS du 14 Juin 2018",
  numeroIfu: "00098412Z",
  rccm: "BF-OUA-2018-B-4921",
  registreCil: "2024-CIL-BF/0912 (Commission de l'Informatique et des Libertés)",
  directeurMedical: "Dr. Salimata Ouédraogo",
  monnaie: "FCFA",
  imageFacade: "/src/assets/images/clinic_facade_ouaga_1794149781144.jpg",
  imageDocteur: "/src/assets/images/doctor_avatar_ouaga_1794149793722.jpg"
};

export const PRATICIENS_INITIAUX: Praticien[] = [
  {
    id: "PRAT-01",
    nom: "Dr. Salimata Ouédraogo",
    titre: "Médecin-Chef, Cardiologue",
    specialite: "Cardiologie & Médecine Interne",
    telephone: "+226 70 12 34 56",
    email: "s.ouedraogo@clinique-wendpanga.bf",
    horaires: "Lun - Ven: 08h00 - 16h30",
    avatarUrl: "/src/assets/images/doctor_avatar_ouaga_1794149793722.jpg",
    disponibleAujourdhui: true
  },
  {
    id: "PRAT-02",
    nom: "Dr. Boureima Sawadogo",
    titre: "Chirurgien Généraliste",
    specialite: "Chirurgie Viscérale & Traumatologie",
    telephone: "+226 76 54 32 10",
    email: "b.sawadogo@clinique-wendpanga.bf",
    horaires: "Mar, Jeu, Sam: 08h30 - 15h00",
    disponibleAujourdhui: true
  },
  {
    id: "PRAT-03",
    nom: "Dr. Aminata Traoré",
    titre: "Pédiatre Spécialiste",
    specialite: "Pédiatrie & Néonatalogie",
    telephone: "+226 60 45 78 90",
    email: "a.traore@clinique-wendpanga.bf",
    horaires: "Lun, Mer, Ven: 09h00 - 17h00",
    disponibleAujourdhui: true
  },
  {
    id: "PRAT-04",
    nom: "Dr. Jean-Baptiste Kaboré",
    titre: "Gynécologue-Obstétricien",
    specialite: "Gynécologie & Santé de la Mère",
    telephone: "+226 78 89 01 23",
    email: "jb.kabore@clinique-wendpanga.bf",
    horaires: "Lun, Mar, Jeu, Ven: 08h00 - 14h00",
    disponibleAujourdhui: false
  }
];

export const PATIENTS_INITIAUX: Patient[] = [
  {
    id: "PAT-001",
    codePatient: "WP-OUA-2026-0042",
    nom: "CONGO",
    prenom: "Moussa",
    dateNaissance: "1978-04-12",
    sexe: "M",
    groupeSanguin: "O+",
    telephone: "+226 70 82 14 30",
    email: "moussa.congo@gmail.com",
    ville: "Ouagadougou",
    quartier: "Ouaga 2000",
    profession: "Ingénieur en Génie Civil",
    contactUrgenceNom: "Congo Fatimata",
    contactUrgenceTel: "+226 76 11 22 33",
    contactUrgenceLien: "Épouse",
    allergies: ["Pénicilline", "Sulfamides"],
    antecedentsMedicaux: ["Hypertension Artérielle essentielle (dépistée 2021)", "Dyslipidémie modérée"],
    antecedentsChirurgicaux: ["Appendicectomie (2012, CMA Schiphra)"],
    priseEnCharge: {
      assure: true,
      compagnie: "Coris Assurances",
      taux: 80,
      matricule: "CORIS-SANTE-89421",
      plafondFcfa: 1500000
    },
    dateCreation: "2024-01-15",
    mfaActif: true,
    mfaMethode: "sms_otp",
    statutDossier: "actif"
  },
  {
    id: "PAT-002",
    codePatient: "WP-OUA-2026-0118",
    nom: "OUÉDRAOGO",
    prenom: "Aïcha",
    dateNaissance: "1994-09-28",
    sexe: "F",
    groupeSanguin: "B+",
    telephone: "+226 78 45 67 89",
    email: "aicha.ouedraogo@fasomail.bf",
    ville: "Ouagadougou",
    quartier: "Somgandé",
    profession: "Enseignante au Lycée Bogodogo",
    contactUrgenceNom: "Ouédraogo Karim",
    contactUrgenceTel: "+226 70 99 88 77",
    contactUrgenceLien: "Frère",
    allergies: ["Aspirine (AINS)"],
    antecedentsMedicaux: ["Crise palustre récente (accès pernicieux évité en 2025)", "Gastrite chronique"],
    antecedentsChirurgicaux: [],
    priseEnCharge: {
      assure: true,
      compagnie: "CNSS",
      taux: 70,
      matricule: "CNSS-BF-992147-F"
    },
    dateCreation: "2024-06-20",
    mfaActif: true,
    mfaMethode: "authenticator_app",
    statutDossier: "actif"
  },
  {
    id: "PAT-003",
    codePatient: "WP-OUA-2026-0254",
    nom: "TIENDREBEOGO",
    prenom: "Wend-Kuni Éric",
    dateNaissance: "2021-02-14",
    sexe: "M",
    groupeSanguin: "A+",
    telephone: "+226 60 33 22 11",
    email: "tiendrebeogo.parents@yahoo.fr",
    ville: "Ouagadougou",
    quartier: "Gounghin",
    profession: "Enfant (Pédiatrie)",
    contactUrgenceNom: "Tiendrebeogo Salimata",
    contactUrgenceTel: "+226 60 33 22 11",
    contactUrgenceLien: "Mère",
    allergies: [],
    antecedentsMedicaux: ["Bronchiolite à répétition en saison fraîche", "Vaccinations PEV à jour"],
    antecedentsChirurgicaux: [],
    priseEnCharge: {
      assure: true,
      compagnie: "Sonar",
      taux: 80,
      matricule: "SONAR-SAN-55201"
    },
    dateCreation: "2024-11-04",
    mfaActif: false,
    statutDossier: "actif"
  },
  {
    id: "PAT-004",
    codePatient: "WP-OUA-2026-0312",
    nom: "SAWADOGO",
    prenom: "Mariam",
    dateNaissance: "1988-11-03",
    sexe: "F",
    groupeSanguin: "O-",
    telephone: "+226 76 90 12 34",
    email: "mariam.sawadogo@orange.bf",
    ville: "Ouagadougou",
    quartier: "Koulouba",
    profession: "Comptable Banque Commerciale",
    contactUrgenceNom: "Kaboré Paul",
    contactUrgenceTel: "+226 70 44 55 66",
    contactUrgenceLien: "Époux",
    allergies: ["Iode de contraste"],
    antecedentsMedicaux: ["Suivi Grossesse G2P1 (28 SA)", "Hypothyroïdie fruste traitée par Lévothyrox"],
    antecedentsChirurgicaux: ["Césarienne programmée en 2021"],
    priseEnCharge: {
      assure: true,
      compagnie: "Saham / Sanlam",
      taux: 85,
      matricule: "SANLAM-SNT-77401"
    },
    dateCreation: "2025-02-10",
    mfaActif: true,
    mfaMethode: "sms_otp",
    statutDossier: "actif"
  },
  {
    id: "PAT-005",
    codePatient: "WP-OUA-2026-0498",
    nom: "BAMBARA",
    prenom: "Idrissa",
    dateNaissance: "1965-07-19",
    sexe: "M",
    groupeSanguin: "AB+",
    telephone: "+226 70 18 29 40",
    email: "idrissa.bambara@moov.bf",
    ville: "Ouagadougou",
    quartier: "Pissy",
    profession: "Commerçant Import-Export (Grand Marché Rood-Woko)",
    contactUrgenceNom: "Bambara Ousmane",
    contactUrgenceTel: "+226 78 12 34 56",
    contactUrgenceLien: "Fils",
    allergies: [],
    antecedentsMedicaux: ["Diabète de type 2 insulino-dépendant", "Neuropathie diabétique débutante"],
    antecedentsChirurgicaux: ["Cure herniaire inguinale droite (2018)"],
    priseEnCharge: {
      assure: false
    },
    dateCreation: "2025-05-18",
    mfaActif: false,
    statutDossier: "actif"
  }
];

export const CONSTANTES_INITIALES: ConstanteVitale[] = [
  {
    id: "CONST-01",
    patientId: "PAT-001",
    date: "2026-11-06 09:15",
    tensionArterielle: "13/8",
    frequenceCardiaque: 74,
    temperature: 36.8,
    glycemie: 1.05,
    saturationO2: 98,
    poids: 82.5,
    taille: 178,
    imc: 26.0,
    agentNom: "Infirmière K. Zongo",
    notes: "Bonne compliance au traitement antihypertenseur."
  },
  {
    id: "CONST-02",
    patientId: "PAT-001",
    date: "2026-10-02 08:45",
    tensionArterielle: "14/9",
    frequenceCardiaque: 82,
    temperature: 37.1,
    glycemie: 1.12,
    saturationO2: 97,
    poids: 84.0,
    taille: 178,
    imc: 26.5,
    agentNom: "Infirmier P. Diallo",
    notes: "Légère hausse tensionnelle suite à fatigue professionnelle."
  },
  {
    id: "CONST-03",
    patientId: "PAT-002",
    date: "2026-11-07 14:30",
    tensionArterielle: "11/7",
    frequenceCardiaque: 96,
    temperature: 39.2,
    glycemie: 0.95,
    saturationO2: 97,
    poids: 61.0,
    taille: 165,
    imc: 22.4,
    agentNom: "Infirmière K. Zongo",
    notes: "Fébrile avec frissons intenses. TDR Paludisme positif demandé."
  },
  {
    id: "CONST-04",
    patientId: "PAT-003",
    date: "2026-11-05 10:20",
    tensionArterielle: "10/6",
    frequenceCardiaque: 108,
    temperature: 38.4,
    saturationO2: 96,
    poids: 14.2,
    taille: 94,
    imc: 16.1,
    agentNom: "Infirmière M. Compaoré",
    notes: "Toux grasse et encombrement pharyngé."
  },
  {
    id: "CONST-05",
    patientId: "PAT-005",
    date: "2026-11-04 11:00",
    tensionArterielle: "13.5/8.5",
    frequenceCardiaque: 78,
    temperature: 36.9,
    glycemie: 1.68,
    saturationO2: 98,
    poids: 76.0,
    taille: 172,
    imc: 25.7,
    agentNom: "Infirmier P. Diallo",
    notes: "Glycémie à jeun un peu élevée. Ajustement diététique recommandé."
  }
];

export const CONSULTATIONS_INITIALES: Consultation[] = [
  {
    id: "CONS-001",
    patientId: "PAT-001",
    patientNom: "CONGO Moussa",
    praticienId: "PRAT-01",
    praticienNom: "Dr. Salimata Ouédraogo",
    specialite: "Cardiologie",
    date: "2026-11-06",
    heure: "09:30",
    motif: "Contrôle trimestriel HTA et bilan lipidique",
    symptomes: "Pas de céphalée matinale ni phosphènes. Dyspnée d'effort modérée après 3 étages.",
    examenClinique: "Bruits du cœur réguliers sans souffle. Pas d'œdème des membres inférieurs. Pouls périphériques bien perçus. ECG per-critique sans anomalie ischémique aiguë.",
    diagnosticPrincipal: "I10 - Hypertension artérielle essentielle",
    codeCim10: "I10",
    diagnosticsSecondaires: ["E78.0 - Hypercholestérolémie pure"],
    conduiteATenir: "Poursuite Amlodipine 5mg + Ramipril 5mg. Régime hyposodé burkinabè. Contrôle dans 3 mois. Rappel SMS automatisé activé.",
    ordonnanceId: "ORD-001",
    statut: "cloturee"
  },
  {
    id: "CONS-002",
    patientId: "PAT-002",
    patientNom: "OUÉDRAOGO Aïcha",
    praticienId: "PRAT-02",
    praticienNom: "Dr. Boureima Sawadogo",
    specialite: "Médecine Générale",
    date: "2026-11-07",
    heure: "14:45",
    motif: "Syndrome fébrile aigu avec courbatures et sueurs profuses",
    symptomes: "Fièvre à 39.2°C depuis 48h, myalgies diffuses, nausées et asthénie intense.",
    examenClinique: "Abdomen souple dépressible sans hépato-splénomégalie sensible. Pas de signes de gravité neurologique. TDR Paludisme positif (Plasmodium falciparum).",
    diagnosticPrincipal: "B50.9 - Paludisme à Plasmodium falciparum, sans complication",
    codeCim10: "B50.9",
    diagnosticsSecondaires: [],
    conduiteATenir: "Traitement CTA (Artéméther + Luméfantrine) 80/480mg pendant 3 jours. Paracétamol 1g pour la fièvre. Hydratation orale abondante. Repos 72h avec arrêt maladie.",
    ordonnanceId: "ORD-002",
    statut: "cloturee"
  },
  {
    id: "CONS-003",
    patientId: "PAT-003",
    patientNom: "TIENDREBEOGO Wend-Kuni Éric",
    praticienId: "PRAT-03",
    praticienNom: "Dr. Aminata Traoré",
    specialite: "Pédiatrie",
    date: "2026-11-05",
    heure: "10:35",
    motif: "Fièvre et toux fébrile de la petite enfance",
    symptomes: "Toux sèche puis productive depuis 3 jours, rhinorrhée claire.",
    examenClinique: "Auscultation pulmonaire: râles bronchiques bilatéraux sans foyer de condensation. Tympans congestifs non bombés. Goutte épaisse négative.",
    diagnosticPrincipal: "J20.9 - Bronchite aiguë",
    codeCim10: "J20.9",
    diagnosticsSecondaires: [],
    conduiteATenir: "Lavages de nez au sérum physiologique, paracétamol sirop selon le poids (10mg/kg/6h). Surveillance température par les parents.",
    ordonnanceId: "ORD-003",
    statut: "cloturee"
  }
];

export const ORDONNANCES_INITIALES: Ordonnance[] = [
  {
    id: "ORD-001",
    codeOrdonnance: "ORD-WP-2026-0981",
    consultationId: "CONS-001",
    patientId: "PAT-001",
    patientNom: "Moussa CONGO",
    praticienNom: "Dr. Salimata Ouédraogo",
    praticienSpecialite: "Cardiologie",
    date: "2026-11-06",
    medicaments: [
      {
        nom: "RAMIPRIL 5 mg",
        dosage: "5 mg",
        forme: "Comprimé pelliculé",
        posologie: "1 comprimé le matin",
        duree: "3 mois (renouvelable 2 fois)",
        instructions: "À prendre à jeun ou pendant le petit déjeuner"
      },
      {
        nom: "AMLODIPINE 5 mg",
        dosage: "5 mg",
        forme: "Gélule",
        posologie: "1 gélule le soir au coucher",
        duree: "3 mois",
        instructions: "Surveiller œdèmes des chevilles"
      },
      {
        nom: "ATORVASTATINE 20 mg",
        dosage: "20 mg",
        forme: "Comprimé",
        posologie: "1 comprimé le soir",
        duree: "3 mois",
        instructions: "Bilan hépatique de contrôle à M+3"
      }
    ],
    instructionsGenerales: "Maintenir une activité physique régulière (30 min de marche quotidienne à Ouaga 2000). Réduire le sel et les assaisonnements industriels.",
    qrCodeValidation: "https://auth.clinique-wendpanga.bf/verify/ORD-WP-2026-0981?h=c948ef2",
    signee: true
  },
  {
    id: "ORD-002",
    codeOrdonnance: "ORD-WP-2026-0982",
    consultationId: "CONS-002",
    patientId: "PAT-002",
    patientNom: "Aïcha OUÉDRAOGO",
    praticienNom: "Dr. Boureima Sawadogo",
    praticienSpecialite: "Médecine Générale",
    date: "2026-11-07",
    medicaments: [
      {
        nom: "COARTEM (Artéméther 20mg / Luméfantrine 120mg)",
        dosage: "Comprimés 4x6",
        forme: "Comprimé",
        posologie: "4 comprimés à H0, H8, H24, H36, H48, H60",
        duree: "3 jours stricts",
        instructions: "Prendre impérativement avec un aliment gras ou du lait pour une absorption optimale"
      },
      {
        nom: "PARACÉTAMOL 1000 mg",
        dosage: "1000 mg",
        forme: "Comprimé effervescent",
        posologie: "1 comprimé toutes les 6h en cas de fièvre > 38.5°C",
        duree: "3 jours",
        instructions: "Ne pas dépasser 4 grammes par 24h"
      }
    ],
    instructionsGenerales: "Dormir impérativement sous Moustiquaire Imprégnée d'Insecticide à Longue Durée d'Action (MILDA). Consulter sans délai si vomissements répétés ou somnolence.",
    qrCodeValidation: "https://auth.clinique-wendpanga.bf/verify/ORD-WP-2026-0982?h=7a31b01",
    signee: true
  }
];

export const DOCUMENTS_MEDICAUX_INITIAUX: DocumentMedical[] = [
  {
    id: "DOC-001",
    patientId: "PAT-001",
    titre: "Électrocardiogramme de repos 12 dérivations",
    type: "compte_rendu",
    date: "2026-11-06",
    praticien: "Dr. Salimata Ouédraogo",
    laboratoireOuService: "Unité d'Explorations Fonctionnelles Cardiovasculaires",
    conclusion: "Rythme sinusal régulier à 74 bpm. Absence de trouble de la conduction auriculo-ventriculaire. Pas de signes d'hypertrophie ventriculaire gauche majeure.",
    tailleFichier: "1.4 Mo",
    nomFichier: "ECG_Repos_CongoM_20261106.pdf"
  },
  {
    id: "DOC-002",
    patientId: "PAT-002",
    titre: "Bilan Hématologique & Goutte Épaisse / TDR",
    type: "analyse_labo",
    date: "2026-11-07",
    praticien: "Dr. A. Compaoré (Biologiste)",
    laboratoireOuService: "Laboratoire d'Analyses Médicales Wend-Panga",
    conclusion: "TDR Paludisme positif à Plasmodium falciparum. Densité parasitaire: 12 500 trophozoïtes/µL de sang. Hémoglobine: 11.8 g/dL. Plaquettes: 165 000/mm³.",
    tailleFichier: "840 Ko",
    nomFichier: "Labo_Parasito_OuedraogoA_20261107.pdf"
  },
  {
    id: "DOC-003",
    patientId: "PAT-004",
    titre: "Échographie Obstétricale T2 Morphologique",
    type: "echographie",
    date: "2026-10-24",
    praticien: "Dr. Jean-Baptiste Kaboré",
    laboratoireOuService: "Centre d'Imagerie de la Femme",
    conclusion: "Grossesse intra-utérine évolutive monofœtale de 26 SA + 3 jours. Biométrie harmonieuse au 50ème percentile. Doppler utérin sans notch. Liquide amniotique en quantité normale.",
    tailleFichier: "3.2 Mo",
    nomFichier: "Echo_Obstetricale_SawadogoM_20261024.pdf"
  }
];

export const RENDEZ_VOUS_INITIAUX: RendezVous[] = [
  {
    id: "RDV-101",
    patientId: "PAT-001",
    patientNom: "Moussa CONGO",
    patientTel: "+226 70 82 14 30",
    praticienId: "PRAT-01",
    praticienNom: "Dr. Salimata Ouédraogo",
    specialite: "Cardiologie",
    date: "2026-11-08",
    heure: "08:30",
    dureeMinutes: 30,
    motif: "Bilan d'évaluation tensionnelle sous bithérapie",
    type: "suivi",
    statut: "en_consultation",
    rappelSmsEnvoye: true,
    rappelSmsDate: "2026-11-07 18:00",
    montantEstimeFcfa: 25000
  },
  {
    id: "RDV-102",
    patientId: "PAT-002",
    patientNom: "Aïcha OUÉDRAOGO",
    patientTel: "+226 78 45 67 89",
    praticienId: "PRAT-02",
    praticienNom: "Dr. Boureima Sawadogo",
    specialite: "Médecine Générale",
    date: "2026-11-08",
    heure: "09:15",
    dureeMinutes: 20,
    motif: "Contrôle post-traitement CTA Paludisme",
    type: "suivi",
    statut: "salle_attente",
    rappelSmsEnvoye: true,
    rappelSmsDate: "2026-11-07 18:00",
    montantEstimeFcfa: 10000
  },
  {
    id: "RDV-103",
    patientId: "PAT-003",
    patientNom: "Wend-Kuni Éric TIENDREBEOGO",
    patientTel: "+226 60 33 22 11",
    praticienId: "PRAT-03",
    praticienNom: "Dr. Aminata Traoré",
    specialite: "Pédiatrie",
    date: "2026-11-08",
    heure: "10:00",
    dureeMinutes: 30,
    motif: "Contrôle respiratoire bronchite infantile",
    type: "consultation",
    statut: "confirme",
    rappelSmsEnvoye: true,
    rappelSmsDate: "2026-11-07 18:00",
    montantEstimeFcfa: 15000
  },
  {
    id: "RDV-104",
    patientId: "PAT-004",
    patientNom: "Mariam SAWADOGO",
    patientTel: "+226 76 90 12 34",
    praticienId: "PRAT-04",
    praticienNom: "Dr. Jean-Baptiste Kaboré",
    specialite: "Gynécologie-Obstétrique",
    date: "2026-11-08",
    heure: "11:00",
    dureeMinutes: 40,
    motif: "Consultation prénatale CPON 28 SA & prescription fer",
    type: "suivi",
    statut: "planifie",
    rappelSmsEnvoye: false,
    montantEstimeFcfa: 30000
  },
  {
    id: "RDV-105",
    patientId: "PAT-005",
    patientNom: "Idrissa BAMBARA",
    patientTel: "+226 70 18 29 40",
    praticienId: "PRAT-01",
    praticienNom: "Dr. Salimata Ouédraogo",
    specialite: "Cardiologie & Médecine Interne",
    date: "2026-11-08",
    heure: "14:30",
    dureeMinutes: 30,
    motif: "Bilan diabétologie et prescription hémoglobine glyquée HbA1c",
    type: "bilan",
    statut: "planifie",
    rappelSmsEnvoye: false,
    montantEstimeFcfa: 25000
  },
  {
    id: "RDV-106",
    patientId: "PAT-001",
    patientNom: "Moussa CONGO",
    patientTel: "+226 70 82 14 30",
    praticienId: "PRAT-01",
    praticienNom: "Dr. Salimata Ouédraogo",
    specialite: "Cardiologie",
    date: "2026-11-09",
    heure: "09:00",
    dureeMinutes: 30,
    motif: "Échocardiographie de contrôle",
    type: "examen",
    statut: "confirme",
    rappelSmsEnvoye: true,
    montantEstimeFcfa: 35000
  }
];

export const RAPPELS_SMS_INITIAUX: RappelSMS[] = [
  {
    id: "SMS-2026-0811",
    patientId: "PAT-001",
    patientNom: "Moussa CONGO",
    telephone: "+226 70 82 14 30",
    typeRappel: "rdv_j1",
    message: "Clinique Wend-Panga: Bonjour M. CONGO, rappel de votre consultation avec Dr. Ouédraogo demain 08 Nov à 08h30. Pour modifier, appelez le 25374040.",
    dateProgrammee: "2026-11-07 18:00",
    dateEnvoiEffectif: "2026-11-07 18:00:14",
    statut: "delivre",
    operateur: "Orange Burkina",
    coutFcfa: 25,
    accusereceptionId: "DELIV_ORA_894120"
  },
  {
    id: "SMS-2026-0812",
    patientId: "PAT-002",
    patientNom: "Aïcha OUÉDRAOGO",
    telephone: "+226 78 45 67 89",
    typeRappel: "rdv_j1",
    message: "Clinique Wend-Panga: Mme OUÉDRAOGO, votre RDV de contrôle paludisme est prévu le 08 Nov à 09h15 avec Dr. Sawadogo. Merci de vous munir de votre carte CNSS.",
    dateProgrammee: "2026-11-07 18:00",
    dateEnvoiEffectif: "2026-11-07 18:00:22",
    statut: "delivre",
    operateur: "Orange Burkina",
    coutFcfa: 25,
    accusereceptionId: "DELIV_ORA_894125"
  },
  {
    id: "SMS-2026-0813",
    patientId: "PAT-003",
    patientNom: "Parent Wend-Kuni TIENDREBEOGO",
    telephone: "+226 60 33 22 11",
    typeRappel: "rdv_j1",
    message: "Clinique Wend-Panga: Rappel pédiatrique pour le petit Wend-Kuni le 08 Nov à 10h00 avec Dr. Traoré. Carnet de santé requis.",
    dateProgrammee: "2026-11-07 18:00",
    dateEnvoiEffectif: "2026-11-07 18:00:45",
    statut: "delivre",
    operateur: "Moov Africa Burkina",
    coutFcfa: 25,
    accusereceptionId: "DELIV_MOOV_45129"
  },
  {
    id: "SMS-2026-0814",
    patientId: "PAT-005",
    patientNom: "Idrissa BAMBARA",
    telephone: "+226 70 18 29 40",
    typeRappel: "renouvellement_ttt",
    message: "Clinique Wend-Panga: Rappel médical - Vos analyses de glycémie et HbA1c sont attendues avant votre visite du 08 Nov. À jeun dès 07h30 au laboratoire.",
    dateProgrammee: "2026-11-07 07:00",
    dateEnvoiEffectif: "2026-11-07 07:00:08",
    statut: "delivre",
    operateur: "Orange Burkina",
    coutFcfa: 25
  }
];

export const NOTIFICATIONS_SUIVI_INITIALES: NotificationSuivi[] = [
  {
    id: "SUIVI-01",
    patientId: "PAT-001",
    patientNom: "Moussa CONGO",
    patientTel: "+226 70 82 14 30",
    typeSuivi: "chronique_hta",
    titre: "Évaluation trimestrielle de la pression artérielle et tolérance rénale",
    dateEcheance: "2026-11-15",
    intervalleJours: 90,
    recommandation: "Dosage de la créatinine sanguine et ionogramme sous inhibiteur de l'enzyme de conversion (Ramipril).",
    statut: "active",
    priorite: "haute",
    actionPrevue: "SMS automatique de rappel bilan sanguin + convocation"
  },
  {
    id: "SUIVI-02",
    patientId: "PAT-002",
    patientNom: "Aïcha OUÉDRAOGO",
    patientTel: "+226 78 45 67 89",
    typeSuivi: "post_operatoire",
    titre: "Surveillance de guérison post-accès palustre aigu",
    dateEcheance: "2026-11-10",
    intervalleJours: 3,
    recommandation: "Contrôle de l'apyrexie, disparition des nausées et reprise de l'activité.",
    statut: "active",
    priorite: "moyenne",
    actionPrevue: "Appel de courtoisie infirmerie ou SMS de vérification"
  },
  {
    id: "SUIVI-03",
    patientId: "PAT-004",
    patientNom: "Mariam SAWADOGO",
    patientTel: "+226 76 90 12 34",
    typeSuivi: "grossesse_cpon",
    titre: "3ème consultation prénatale (CPN 3) à 32 Semaines d'Aménorrhée",
    dateEcheance: "2026-11-28",
    intervalleJours: 28,
    recommandation: "Vérification présentation fœtale, biométrie, dépistage protéinurie et tension artérielle.",
    statut: "active",
    priorite: "haute",
    actionPrevue: "Programmation automatique agenda Dr. Kaboré"
  },
  {
    id: "SUIVI-04",
    patientId: "PAT-005",
    patientNom: "Idrissa BAMBARA",
    patientTel: "+226 70 18 29 40",
    typeSuivi: "chronique_diabete",
    titre: "Bilan trimestriel hémoglobine glyquée HbA1c et examen podologique",
    dateEcheance: "2026-11-08",
    intervalleJours: 90,
    recommandation: "Objectif HbA1c < 7.0%. Examen des pieds au monofilament de Semmes-Weinstein.",
    statut: "en_retard",
    priorite: "haute",
    actionPrevue: "Contact urgent par la secrétaire médicale"
  }
];

export const FACTURES_INITIALES: Facture[] = [
  {
    id: "FAC-001",
    numeroFacture: "FAC-WP-2026-0814",
    patientId: "PAT-001",
    patientNom: "Moussa CONGO",
    dateEmission: "2026-11-06",
    actes: [
      {
        id: "ACT-01",
        codeActe: "CS-CARDIO",
        designation: "Consultation Spécialisée en Cardiologie",
        quantite: 1,
        prixUnitaireFcfa: 25000,
        totalFcfa: 25000
      },
      {
        id: "ACT-02",
        codeActe: "ECG-REP",
        designation: "Électrocardiogramme standard 12 dérivations",
        quantite: 1,
        prixUnitaireFcfa: 15000,
        totalFcfa: 15000
      }
    ],
    montantTotalFcfa: 40000,
    partAssuranceFcfa: 32000,
    tauxAssurancePourcentage: 80,
    nomCompagnieAssurance: "Coris Assurances",
    partPatientFcfa: 8000,
    montantRegleFcfa: 8000,
    resteAPayerFcfa: 0,
    statut: "payee",
    modePaiement: "orange_money",
    referencePaiement: "OM-BF-8914022",
    dateReglement: "2026-11-06 10:15",
    caissierNom: "Rasmata Ilboudo"
  },
  {
    id: "FAC-002",
    numeroFacture: "FAC-WP-2026-0815",
    patientId: "PAT-002",
    patientNom: "Aïcha OUÉDRAOGO",
    dateEmission: "2026-11-07",
    actes: [
      {
        id: "ACT-03",
        codeActe: "CS-GEN",
        designation: "Consultation de Médecine Générale d'Urgence",
        quantite: 1,
        prixUnitaireFcfa: 10000,
        totalFcfa: 10000
      },
      {
        id: "ACT-04",
        codeActe: "LAB-TDR",
        designation: "Test de Diagnostic Rapide (TDR) Paludisme + Goutte Épaisse",
        quantite: 1,
        prixUnitaireFcfa: 5000,
        totalFcfa: 5000
      },
      {
        id: "ACT-05",
        codeActe: "SOIN-PERF",
        designation: "Perfusion antipyrétique & surveillance 2h",
        quantite: 1,
        prixUnitaireFcfa: 12000,
        totalFcfa: 12000
      }
    ],
    montantTotalFcfa: 27000,
    partAssuranceFcfa: 18900,
    tauxAssurancePourcentage: 70,
    nomCompagnieAssurance: "CNSS",
    partPatientFcfa: 8100,
    montantRegleFcfa: 8100,
    resteAPayerFcfa: 0,
    statut: "payee",
    modePaiement: "moov_money",
    referencePaiement: "MOOV-BF-741290",
    dateReglement: "2026-11-07 16:20",
    caissierNom: "Rasmata Ilboudo"
  },
  {
    id: "FAC-003",
    numeroFacture: "FAC-WP-2026-0816",
    patientId: "PAT-005",
    patientNom: "Idrissa BAMBARA",
    dateEmission: "2026-11-04",
    actes: [
      {
        id: "ACT-06",
        codeActe: "CS-DIAB",
        designation: "Consultation de Suivi Diabétologique",
        quantite: 1,
        prixUnitaireFcfa: 20000,
        totalFcfa: 20000
      },
      {
        id: "ACT-07",
        codeActe: "LAB-HBA1C",
        designation: "Dosage sanguin Hémoglobine Glyquée (HbA1c)",
        quantite: 1,
        prixUnitaireFcfa: 15000,
        totalFcfa: 15000
      }
    ],
    montantTotalFcfa: 35000,
    partAssuranceFcfa: 0,
    tauxAssurancePourcentage: 0,
    partPatientFcfa: 35000,
    montantRegleFcfa: 35000,
    resteAPayerFcfa: 0,
    statut: "payee",
    modePaiement: "wave",
    referencePaiement: "WAVE-BF-301988",
    dateReglement: "2026-11-04 12:05",
    caissierNom: "Rasmata Ilboudo"
  },
  {
    id: "FAC-004",
    numeroFacture: "FAC-WP-2026-0817",
    patientId: "PAT-004",
    patientNom: "Mariam SAWADOGO",
    dateEmission: "2026-11-08",
    actes: [
      {
        id: "ACT-08",
        codeActe: "CS-GYNECO",
        designation: "Consultation Prénatale Spécialisée",
        quantite: 1,
        prixUnitaireFcfa: 25000,
        totalFcfa: 25000
      },
      {
        id: "ACT-09",
        codeActe: "ECH-OBST",
        designation: "Échographie Obstétricale avec biométrie",
        quantite: 1,
        prixUnitaireFcfa: 30000,
        totalFcfa: 30000
      }
    ],
    montantTotalFcfa: 55000,
    partAssuranceFcfa: 46750,
    tauxAssurancePourcentage: 85,
    nomCompagnieAssurance: "Saham / Sanlam",
    partPatientFcfa: 8250,
    montantRegleFcfa: 0,
    resteAPayerFcfa: 8250,
    statut: "en_attente",
    caissierNom: "Rasmata Ilboudo",
    notes: "Facture en attente de validation à la sortie de consultation"
  }
];

export const AUDIT_LOGS_RGPD_INITIAUX: AuditLogRGPD[] = [
  {
    id: "LOG-001",
    dateHeure: "2026-11-08 08:29:45",
    utilisateurNom: "Dr. Salimata Ouédraogo",
    roleUtilisateur: "medecin",
    action: "CONSULTATION_DOSSIER",
    patientId: "PAT-001",
    patientNom: "CONGO Moussa",
    details: "Ouverture du dossier médical et antécédents pour consultation cardiologie programmée.",
    adresseIP: "192.168.10.42 (Intranet Clinique)",
    statutConformite: "CONFORME_CIL_BF"
  },
  {
    id: "LOG-002",
    dateHeure: "2026-11-08 08:15:10",
    utilisateurNom: "Dr. Salimata Ouédraogo",
    roleUtilisateur: "medecin",
    action: "CONNEXION_MFA",
    details: "Authentification à double facteur (2FA) validée avec succès via OTP SMS (+226 70 12 34 56).",
    adresseIP: "192.168.10.42",
    statutConformite: "CONFORME_CIL_BF"
  },
  {
    id: "LOG-003",
    dateHeure: "2026-11-07 16:30:12",
    utilisateurNom: "Rasmata Ilboudo",
    roleUtilisateur: "comptable",
    action: "EXPORT_DONNEES",
    details: "Exportation du registre journalier de caisse et facturation avec masquage des données sensibles de santé.",
    adresseIP: "192.168.10.15",
    statutConformite: "CONFORME_CIL_BF"
  },
  {
    id: "LOG-004",
    dateHeure: "2026-11-07 14:55:00",
    utilisateurNom: "Dr. Boureima Sawadogo",
    roleUtilisateur: "medecin",
    action: "GENERATION_ORDONNANCE",
    patientId: "PAT-002",
    patientNom: "OUÉDRAOGO Aïcha",
    details: "Émission d'une ordonnance numérique sécurisée avec QR code scellé par signature électronique.",
    adresseIP: "192.168.10.51",
    statutConformite: "CONFORME_CIL_BF"
  },
  {
    id: "LOG-005",
    dateHeure: "2026-11-06 09:12:00",
    utilisateurNom: "Fatimata Sankara",
    roleUtilisateur: "secretaire",
    action: "CONSENTEMENT_ENREGISTRE",
    patientId: "PAT-001",
    patientNom: "CONGO Moussa",
    details: "Recueil du consentement explicite RGPD/CIL pour le traitement des données et notifications SMS.",
    adresseIP: "192.168.10.11",
    statutConformite: "CONFORME_CIL_BF"
  }
];

export const CONSENTEMENTS_INITIAUX: ConsentementRGPD[] = [
  {
    patientId: "PAT-001",
    patientNom: "Moussa CONGO",
    dateConsentement: "2024-01-15",
    typeConsentement: "traitement_donnees_medicales",
    accorde: true,
    signataireNom: "Moussa Congo",
    canal: "numerique_sur_tablette"
  },
  {
    patientId: "PAT-001",
    patientNom: "Moussa CONGO",
    dateConsentement: "2024-01-15",
    typeConsentement: "rappels_sms",
    accorde: true,
    signataireNom: "Moussa Congo",
    canal: "numerique_sur_tablette"
  },
  {
    patientId: "PAT-002",
    patientNom: "Aïcha OUÉDRAOGO",
    dateConsentement: "2024-06-20",
    typeConsentement: "traitement_donnees_medicales",
    accorde: true,
    signataireNom: "Aïcha Ouédraogo",
    canal: "numerique_sur_tablette"
  },
  {
    patientId: "PAT-004",
    patientNom: "Mariam SAWADOGO",
    dateConsentement: "2025-02-10",
    typeConsentement: "partage_assurance",
    accorde: true,
    signataireNom: "Mariam Sawadogo",
    canal: "numerique_sur_tablette"
  }
];

export const PLATEFORMES_SANTE_INITIALES: PlateformeSanteSync[] = [
  {
    id: "SYNC-SNIS",
    nom: "SNIS Burkina Faso (DHIS2 Ministère de la Santé)",
    standard: "API REST SNIS (DHIS2)",
    description: "Système National d'Information Sanitaire pour la remontée obligatoire des indicateurs épidémiologiques et morbidité.",
    statut: "operationnel",
    derniereSynchronisation: "2026-11-08 06:00:00",
    paquetsTransmis: 1420,
    tauxReussite: 99.8,
    prochaineSync: "2026-11-08 12:00:00",
    logsRecents: [
      "[06:00:02] Connexion SSL/TLS sécurisée établie avec srv-snis.sante.gov.bf",
      "[06:00:04] 28 fiches de morbidité agrégées transmises (Paludisme, HTA, Diabète)",
      "[06:00:05] Réponse HTTP 200 OK - Quittance d'enregistrement N° SNIS-BF-20261108-091"
    ]
  },
  {
    id: "SYNC-PACS",
    nom: "Serveur PACS Radiologie & Imagerie DICOM",
    standard: "DICOM 3.0",
    description: "Passerelle de stockage et transmission numérique des clichés radiologiques, scanners et échographies.",
    statut: "operationnel",
    derniereSynchronisation: "2026-11-08 07:45:12",
    paquetsTransmis: 8540,
    tauxReussite: 100,
    prochaineSync: "Temps réel (WebSocket DICOM)",
    logsRecents: [
      "[07:45:10] Requête C-STORE reçue depuis la modalité Échographie Sonosite",
      "[07:45:12] Série de 18 clichés rattachée automatiquement au dossier PAT-004",
      "[07:45:12] Chiffrement AES-256 appliqué au stockage local sécurisé"
    ]
  },
  {
    id: "SYNC-LABO",
    nom: "Automate de Laboratoire Sysmex & Hématologie",
    standard: "HL7 v2.5",
    description: "Transmission directe des résultats d'analyses sanguines (NFS, biochimie, sérologie) vers les dossiers patients.",
    statut: "operationnel",
    derniereSynchronisation: "2026-11-08 08:10:30",
    paquetsTransmis: 3290,
    tauxReussite: 99.4,
    prochaineSync: "À chaque validation biologiste",
    logsRecents: [
      "[08:10:28] Message HL7 ORU^R01 reçu de l'automate Sysmex XN-550",
      "[08:10:30] Numération Formule Sanguine intégrée avec validation du Dr. Compaoré"
    ]
  },
  {
    id: "SYNC-TIERS-PAYANT",
    nom: "Passerelle Tiers-Payant Assurances (CNSS, Sonar, Coris)",
    standard: "FHIR R4",
    description: "Télétransmission des feuilles de soins électroniques et vérification instantanée des droits d'assurés.",
    statut: "operationnel",
    derniereSynchronisation: "2026-11-08 08:22:15",
    paquetsTransmis: 2150,
    tauxReussite: 98.9,
    prochaineSync: "À chaque émission de facture",
    logsRecents: [
      "[08:22:14] Vérification éligibilité en ligne pour le matricule CORIS-SANTE-89421",
      "[08:22:15] Réponse FHIR CoverageEligibilityResponse: Prise en charge 80% accordée"
    ]
  }
];

export const STATISTIQUES_INITIAUX = {
  totalPatientsActifs: 1480,
  consultationsCeMois: 342,
  tauxOccupationLits: 78, // %
  tauxDelivranceSms: 98.4, // %
  chiffreAffairesMoisFcfa: 18450000,
  partAssurancePourcent: 62,
  pathologiesFrequentes: [
    { nom: "Paludisme (Toutes formes)", pourcentage: 38, count: 130 },
    { nom: "Hypertension Artérielle", pourcentage: 24, count: 82 },
    { nom: "Infections Respiratoires Aiguës", pourcentage: 16, count: 55 },
    { nom: "Diabète de type 1 & 2", pourcentage: 12, count: 41 },
    { nom: "Gastro-entérites & parasitoses", pourcentage: 10, count: 34 }
  ],
  repartitionPaiements: [
    { mode: "Orange Money BF", part: 42, montant: 7749000 },
    { mode: "Prise en charge Assurance", part: 30, montant: 5535000 },
    { mode: "Moov Money BF", part: 14, montant: 2583000 },
    { mode: "Espèces (Caisse)", part: 9, montant: 1660500 },
    { mode: "Wave & Cartes Visa", part: 5, montant: 922500 }
  ]
};
