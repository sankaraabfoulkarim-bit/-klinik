import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { PatientsView } from './views/PatientsView';
import { AppointmentsView } from './views/AppointmentsView';
import { SmsAndFollowUpView } from './views/SmsAndFollowUpView';
import { BillingAndPaymentView } from './views/BillingAndPaymentView';
import { AnalyticsView } from './views/AnalyticsView';
import { RgpdView } from './views/RgpdView';
import { MfaSecurityView } from './views/MfaSecurityView';
import { HealthSyncView } from './views/HealthSyncView';

// Modals
import { PatientDetailDrawer } from './components/PatientDetailDrawer';
import { NewPatientModal } from './components/NewPatientModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { NewInvoiceModal } from './components/NewInvoiceModal';
import { PaymentModal } from './components/PaymentModal';
import { PrintableOrdonnance } from './components/PrintableOrdonnance';
import { PrintableFacture } from './components/PrintableFacture';

// Types & Services
import { 
  Patient, 
  RendezVous, 
  Facture, 
  RappelSMS, 
  NotificationSuivi, 
  AuditLogRGPD, 
  PlateformeSanteSync, 
  StatutRDV, 
  RoleUtilisateur, 
  Ordonnance 
} from './types/clinic';
import { ClinicStorageService } from './services/clinicStorage';
import { CLINIC_INFO } from './data/mockClinicData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Current user state (staff profile)
  const [currentUser, setCurrentUser] = useState<{
    nom: string;
    role: RoleUtilisateur;
    mfaActif: boolean;
  }>({
    nom: 'Dr. Salimata Ouédraogo',
    role: 'medecin',
    mfaActif: true
  });

  // App dataset loaded from storage
  const [patients, setPatients] = useState<Patient[]>([]);
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [smsLogs, setSmsLogs] = useState<RappelSMS[]>([]);
  const [suivis, setSuivis] = useState<NotificationSuivi[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRGPD[]>([]);
  const [plateformes, setPlateformes] = useState<PlateformeSanteSync[]>([]);

  // Modal states
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showNewPatientModal, setShowNewPatientModal] = useState<boolean>(false);
  const [showNewRdvModal, setShowNewRdvModal] = useState<boolean>(false);
  const [preselectedRdvPatient, setPreselectedRdvPatient] = useState<Patient | null>(null);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState<boolean>(false);
  const [paymentFacture, setPaymentFacture] = useState<Facture | null>(null);
  const [printOrdonnanceObj, setPrintOrdonnanceObj] = useState<Ordonnance | null>(null);
  const [printFactureObj, setPrintFactureObj] = useState<Facture | null>(null);

  // Load and refresh state
  const refreshData = useCallback(() => {
    setPatients(ClinicStorageService.getPatients());
    setRendezVous(ClinicStorageService.getRendezVous());
    setFactures(ClinicStorageService.getFactures());
    setSmsLogs(ClinicStorageService.getSmsLogs());
    setSuivis(ClinicStorageService.getSuivis());
    setAuditLogs(ClinicStorageService.getAuditLogs());
    setPlateformes(ClinicStorageService.getPlateformes());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle patient selection (open drawer and record RGPD audit)
  const handleSelectPatient = (patientId: string) => {
    const p = ClinicStorageService.getPatientById(patientId);
    if (p) {
      ClinicStorageService.logAudit({
        action: 'CONSULTATION_DOSSIER',
        patientId: p.id,
        patientNom: `${p.nom} ${p.prenom}`,
        details: `Consultation du dossier médical complet par ${currentUser.nom}`,
        utilisateurNom: currentUser.nom,
        roleUtilisateur: currentUser.role
      });
      refreshData();
    }
    setSelectedPatientId(patientId);
  };

  // Handle appointment status change
  const handleUpdateRdvStatut = (rdvId: string, nouveauStatut: StatutRDV) => {
    ClinicStorageService.updateRdvStatut(rdvId, nouveauStatut);
    refreshData();
  };

  // Handle quick SMS reminder from appointment row
  const handleSendSmsReminder = (rdv: RendezVous) => {
    ClinicStorageService.sendSms({
      patientId: rdv.patientId,
      patientNom: rdv.patientNom,
      telephone: rdv.patientTel,
      typeRappel: 'rdv_j1',
      message: `Clinique Wend-Panga: Rappel de votre consultation avec ${rdv.praticienNom} le ${rdv.date} à ${rdv.heure}. Standard: ${CLINIC_INFO.telephone}.`,
      dateProgrammee: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operateur: rdv.patientTel.startsWith('+226 70') ? 'Orange Burkina' : 'Moov Africa Burkina',
      coutFcfa: 25
    });
    refreshData();
  };

  // User role switch
  const handleSwitchUser = (newRole: RoleUtilisateur) => {
    let newNom = 'Dr. Salimata Ouédraogo';
    if (newRole === 'infirmier') newNom = 'Infirmière K. Zongo';
    else if (newRole === 'secretaire') newNom = 'Fatimata Sankara';
    else if (newRole === 'comptable') newNom = 'Rasmata Ilboudo';
    else if (newRole === 'admin') newNom = 'Administrateur SI Clinique';

    setCurrentUser({
      nom: newNom,
      role: newRole,
      mfaActif: true
    });
  };

  // Selected patient object for drawer
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Badge counters for sidebar
  const waitingCount = rendezVous.filter(r => r.date === '2026-11-08' && r.statut === 'salle_attente').length;
  const unpaidCount = factures.filter(f => f.statut === 'en_attente').length;
  const dueFollowUpCount = suivis.filter(s => s.statut === 'en_retard' || s.statut === 'active').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenNewPatient={() => setShowNewPatientModal(true)}
        onOpenNewRdv={() => {
          setPreselectedRdvPatient(null);
          setShowNewRdvModal(true);
        }}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          waitingCount={waitingCount}
          unpaidCount={unpaidCount}
          dueFollowUpCount={dueFollowUpCount}
        />

        {/* Central Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          
          {currentTab === 'dashboard' && (
            <DashboardView
              patients={patients}
              rendezVous={rendezVous}
              factures={factures}
              suivis={suivis}
              smsLogs={smsLogs}
              onSelectPatient={handleSelectPatient}
              onUpdateRdvStatut={handleUpdateRdvStatut}
              onOpenNewPatient={() => setShowNewPatientModal(true)}
              onOpenNewRdv={() => {
                setPreselectedRdvPatient(null);
                setShowNewRdvModal(true);
              }}
              onNavigateToTab={setCurrentTab}
            />
          )}

          {currentTab === 'patients' && (
            <PatientsView
              patients={patients}
              onSelectPatient={handleSelectPatient}
              onOpenNewPatient={() => setShowNewPatientModal(true)}
              onOpenNewRdvWithPatient={(p) => {
                setPreselectedRdvPatient(p);
                setShowNewRdvModal(true);
              }}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsView
              rendezVous={rendezVous}
              onSelectPatient={handleSelectPatient}
              onUpdateRdvStatut={handleUpdateRdvStatut}
              onSendSmsReminder={handleSendSmsReminder}
              onOpenNewRdv={() => {
                setPreselectedRdvPatient(null);
                setShowNewRdvModal(true);
              }}
            />
          )}

          {currentTab === 'sms' && (
            <SmsAndFollowUpView
              smsLogs={smsLogs}
              suivis={suivis}
              patients={patients}
              onRefreshData={refreshData}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {currentTab === 'billing' && (
            <BillingAndPaymentView
              factures={factures}
              patients={patients}
              onOpenPaymentModal={(f) => setPaymentFacture(f)}
              onPrintFacture={(f) => setPrintFactureObj(f)}
              onOpenNewInvoiceModal={() => setShowNewInvoiceModal(true)}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              patients={patients}
              factures={factures}
              rendezVous={rendezVous}
            />
          )}

          {currentTab === 'rgpd' && (
            <RgpdView
              auditLogs={auditLogs}
              patients={patients}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {currentTab === 'mfa' && (
            <MfaSecurityView
              patients={patients}
              onRefreshData={refreshData}
            />
          )}

          {currentTab === 'sync' && (
            <HealthSyncView
              plateformes={plateformes}
              onRefreshData={refreshData}
            />
          )}

        </main>

      </div>

      {/* MODAL 1: Patient Details Drawer */}
      {selectedPatient && (
        <PatientDetailDrawer
          patient={selectedPatient}
          onClose={() => setSelectedPatientId(null)}
          onPrintOrdonnance={(ord) => setPrintOrdonnanceObj(ord)}
          onOpenNewRdv={(p) => {
            setSelectedPatientId(null);
            setPreselectedRdvPatient(p);
            setShowNewRdvModal(true);
          }}
          onRefreshData={refreshData}
        />
      )}

      {/* MODAL 2: New Patient Registration */}
      {showNewPatientModal && (
        <NewPatientModal
          onClose={() => setShowNewPatientModal(false)}
          onPatientCreated={(newP) => {
            refreshData();
            handleSelectPatient(newP.id);
          }}
        />
      )}

      {/* MODAL 3: New Appointment Scheduling */}
      {showNewRdvModal && (
        <NewAppointmentModal
          patients={patients}
          preselectedPatient={preselectedRdvPatient}
          onClose={() => {
            setShowNewRdvModal(false);
            setPreselectedRdvPatient(null);
          }}
          onRdvCreated={() => {
            refreshData();
          }}
        />
      )}

      {/* MODAL 4: New Invoice Creation */}
      {showNewInvoiceModal && (
        <NewInvoiceModal
          patients={patients}
          onClose={() => setShowNewInvoiceModal(false)}
          onInvoiceCreated={() => {
            refreshData();
          }}
        />
      )}

      {/* MODAL 5: Payment Portal Modal */}
      {paymentFacture && (
        <PaymentModal
          facture={paymentFacture}
          onClose={() => setPaymentFacture(null)}
          onPaymentSuccess={() => {
            refreshData();
          }}
          onPrintFacture={(f) => {
            setPaymentFacture(null);
            setPrintFactureObj(f);
          }}
        />
      )}

      {/* MODAL 6: Printable Ordonnance */}
      {printOrdonnanceObj && (
        <PrintableOrdonnance
          ordonnance={printOrdonnanceObj}
          patient={patients.find(p => p.id === printOrdonnanceObj.patientId)}
          onClose={() => setPrintOrdonnanceObj(null)}
        />
      )}

      {/* MODAL 7: Printable Facture */}
      {printFactureObj && (
        <PrintableFacture
          facture={printFactureObj}
          onClose={() => setPrintFactureObj(null)}
        />
      )}

    </div>
  );
}
