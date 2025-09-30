import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '../components/ToastProvider';
import { 
  People, 
  MedicalServices, 
  Assignment, 
  Download, 
  Search, 
  FilterList, 
  Visibility,
  Add,
  Edit,
  Delete,
  Close,
  Save,
  Person,
  LocalHospital,
  Schedule,
  Description,
  Medication,
  Emergency,
  TrendingUp,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { MedicalRecordViewer, MedicalRecordExporter } from '../components';
import { 
  userApi, 
  doctorPatientApi, 
  medicalRecordApi, 
  prescriptionApi, 
  emergencyContactApi,
  pregnancyApi,
  appointmentApi,
  type User, 
  type DoctorPatient, 
  type MedicalRecord,
  type MedicalPrescription,
  type EmergencyContact,
  type PregnancyRecord
} from '../services/api';

const DoctorDashboardPage: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [doctorPatients, setDoctorPatients] = useState<DoctorPatient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<MedicalPrescription[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [pregnancyRecords, setPregnancyRecords] = useState<PregnancyRecord[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);
  const [showExporter, setShowExporter] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pregnant' | 'active' | 'inactive'>('all');
  const [activeTab, setActiveTab] = useState<'patients' | 'records' | 'prescriptions' | 'appointments'>('patients');
  
  const toast = useToast();

  // Récupérer l'ID du médecin connecté (pour l'instant, on utilise l'ID 3)
  const currentDoctorId = 3;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les relations médecin-patient
      const doctorPatientRelations = await doctorPatientApi.getByDoctorId(currentDoctorId);
      setDoctorPatients(doctorPatientRelations);
      
      // Récupérer les patients
      const patientIds = doctorPatientRelations.map(rel => rel.patientId);
      const allPatients = await userApi.getAll();
      const doctorPatients = allPatients.filter(patient => 
        patientIds.includes(patient.id) && patient.profileType === 'pregnant_woman'
      );
      setPatients(doctorPatients);
      
      // Récupérer les dossiers médicaux
      const allMedicalRecords = await medicalRecordApi.getByDoctorId(currentDoctorId);
      setMedicalRecords(allMedicalRecords);
      
      // Récupérer les prescriptions
      const allPrescriptions = await prescriptionApi.getByDoctorId(currentDoctorId);
      setPrescriptions(allPrescriptions);
      
      // Récupérer les contacts d'urgence
      const allEmergencyContacts = await Promise.all(
        patientIds.map(id => emergencyContactApi.getByPatientId(id))
      );
      setEmergencyContacts(allEmergencyContacts.flat());
      
      // Récupérer les dossiers de grossesse
      const allPregnancyRecords = await Promise.all(
        patientIds.map(id => pregnancyApi.getByUserId(id))
      );
      setPregnancyRecords(allPregnancyRecords.filter(record => record !== null) as PregnancyRecord[]);
      
      // Récupérer les rendez-vous
      const allAppointments = await Promise.all(
        patientIds.map(id => appointmentApi.getByUserId(id))
      );
      setAppointments(allAppointments.flat());
      
      toast.show('Données chargées avec succès', 'success');
    } catch (error: any) {
      console.error('Erreur lors du chargement des données:', error);
      toast.show('Erreur lors du chargement des données', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Statistiques du médecin
  const stats = useMemo(() => {
    const totalPatients = patients.length;
    const activePatients = doctorPatients.filter(rel => rel.status === 'active').length;
    const totalRecords = medicalRecords.length;
    const totalPrescriptions = prescriptions.length;
    const upcomingAppointments = appointments.filter(apt => 
      new Date(apt.date) > new Date() && apt.status === 'scheduled'
    ).length;
    
    return {
      totalPatients,
      activePatients,
      totalRecords,
      totalPrescriptions,
      upcomingAppointments
    };
  }, [patients, doctorPatients, medicalRecords, prescriptions, appointments]);

  // Patients filtrés
  const filteredPatients = useMemo(() => {
    let filtered = patients;
    
    // Filtre par type
    if (filterType === 'pregnant') {
      filtered = filtered.filter(patient => 
        pregnancyRecords.some(record => record.userId === patient.id)
      );
    } else if (filterType === 'active') {
      const activePatientIds = doctorPatients
        .filter(rel => rel.status === 'active')
        .map(rel => rel.patientId);
      filtered = filtered.filter(patient => activePatientIds.includes(patient.id));
    } else if (filterType === 'inactive') {
      const inactivePatientIds = doctorPatients
        .filter(rel => rel.status === 'inactive')
        .map(rel => rel.patientId);
      filtered = filtered.filter(patient => inactivePatientIds.includes(patient.id));
    }
    
    // Recherche par nom
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [patients, filterType, searchTerm, doctorPatients, pregnancyRecords]);

  // Dossiers médicaux du patient sélectionné
  const patientMedicalRecords = useMemo(() => {
    if (!selectedPatient) return [];
    return medicalRecords.filter(record => record.patientId === selectedPatient.id);
  }, [selectedPatient, medicalRecords]);

  // Prescriptions du patient sélectionné
  const patientPrescriptions = useMemo(() => {
    if (!selectedPatient) return [];
    return prescriptions.filter(prescription => prescription.patientId === selectedPatient.id);
  }, [selectedPatient, prescriptions]);

  // Dossier de grossesse du patient sélectionné
  const patientPregnancyRecord = useMemo(() => {
    if (!selectedPatient) return null;
    return pregnancyRecords.find(record => record.userId === selectedPatient.id) || null;
  }, [selectedPatient, pregnancyRecords]);

  // Contacts d'urgence du patient sélectionné
  const patientEmergencyContacts = useMemo(() => {
    if (!selectedPatient) return [];
    return emergencyContacts.filter(contact => contact.patientId === selectedPatient.id);
  }, [selectedPatient, emergencyContacts]);

  const handleViewPatient = (patient: User) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleClosePatientDetails = () => {
    setSelectedPatient(null);
    setShowPatientDetails(false);
  };


  const handleViewRecord = (record: MedicalRecord) => {
    setViewingRecord(record);
  };

  const handleExportPatient = (patient: User) => {
    setSelectedPatient(patient);
    setShowExporter(true);
  };

  const exportPatientData = (patient: User) => {
    const patientData = {
      patient: {
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.email,
        phone: patient.phone,
        region: patient.region
      },
      pregnancyRecord: patientPregnancyRecord,
      medicalRecords: patientMedicalRecords,
      prescriptions: patientPrescriptions,
      emergencyContacts: patientEmergencyContacts
    };

    const dataStr = JSON.stringify(patientData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dossier_${patient.firstName}_${patient.lastName}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.show('Dossier exporté avec succès', 'success');
  };

  if (isLoading) {
    return (
      <div className="w-full p-3 sm:p-4 space-y-4 min-h-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 rounded-xl h-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-3 sm:p-4 space-y-4 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Médecin</h1>
          <p className="text-gray-600">Gérez vos patients et leurs dossiers médicaux</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={fetchData}
          >
            <TrendingUp className="mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <People className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalPatients}</div>
          <div className="text-sm text-gray-600">Patients totaux</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.activePatients}</div>
          <div className="text-sm text-gray-600">Patients actifs</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <Assignment className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalRecords}</div>
          <div className="text-sm text-gray-600">Dossiers médicaux</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <Medication className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalPrescriptions}</div>
          <div className="text-sm text-gray-600">Prescriptions</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <Schedule className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.upcomingAppointments}</div>
          <div className="text-sm text-gray-600">Rendez-vous</div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'patients' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('patients')}
        >
          Mes Patients
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'records' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('records')}
        >
          Dossiers Médicaux
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'prescriptions' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('prescriptions')}
        >
          Prescriptions
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'appointments' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('appointments')}
        >
          Rendez-vous
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'patients' && (
        <div className="space-y-4">
          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterList className="text-gray-400 w-5 h-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les patients</option>
                  <option value="pregnant">Femmes enceintes</option>
                  <option value="active">Patients actifs</option>
                  <option value="inactive">Patients inactifs</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des patients */}
          <div className="space-y-4">
            {filteredPatients.map((patient) => {
              const pregnancyRecord = pregnancyRecords.find(record => record.userId === patient.id);
              const patientRelation = doctorPatients.find(rel => rel.patientId === patient.id);
              
              return (
                <div key={patient.id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                        <Person className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                        <p className="text-sm text-gray-500">{patient.phone}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            patientRelation?.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {patientRelation?.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                          {pregnancyRecord && (
                            <span className="px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
                              {pregnancyRecord.currentWeek} semaines
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-4 py-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
                        onClick={() => handleViewPatient(patient)}
                      >
                        <Visibility className="w-4 h-4 mr-1" />
                        Voir dossier
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-green-100 text-green-600 hover:bg-green-200"
                        onClick={() => handleExportPatient(patient)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Exporter
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPatients.length === 0 && (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <Person className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun patient trouvé</h3>
                <p className="text-gray-500">
                  {searchTerm || filterType !== 'all' 
                    ? 'Essayez de modifier vos critères de recherche ou de filtre.'
                    : 'Aucun patient n\'est assigné à votre compte.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Détails du patient sélectionné */}
      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={handleClosePatientDetails}>
          <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">
                Dossier médical - {selectedPatient.firstName} {selectedPatient.lastName}
              </h3>
              <button className="p-2 rounded hover:bg-gray-100" onClick={handleClosePatientDetails}>
                <Close />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informations du patient */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Informations personnelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Téléphone:</span>
                    <p className="font-medium">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Région:</span>
                    <p className="font-medium">{selectedPatient.region}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Statut:</span>
                    <p className="font-medium">
                      {doctorPatients.find(rel => rel.patientId === selectedPatient.id)?.status || 'Inconnu'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dossier de grossesse */}
              {patientPregnancyRecord && (
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Dossier de grossesse</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Semaine actuelle:</span>
                      <p className="font-medium text-lg">{patientPregnancyRecord.currentWeek} semaines</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Date d'accouchement prévue:</span>
                      <p className="font-medium">{new Date(patientPregnancyRecord.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">IMC:</span>
                      <p className="font-medium">{patientPregnancyRecord.bmi}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions rapides */}
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => handleExportPatient(selectedPatient)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Exporter le dossier
                </button>
              </div>

              {/* Dossiers médicaux */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Dossiers médicaux récents</h4>
                {patientMedicalRecords.length > 0 ? (
                  <div className="space-y-2">
                    {patientMedicalRecords.slice(0, 5).map((record) => (
                      <div key={record.id} className="bg-white border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{record.title}</h5>
                            <p className="text-sm text-gray-600">
                              {new Date(record.date).toLocaleDateString()} - {record.recordType}
                            </p>
                          </div>
                          <button 
                            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                            onClick={() => handleViewRecord(record)}
                          >
                            <Visibility className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun dossier médical enregistré</p>
                )}
              </div>

              {/* Prescriptions récentes */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Prescriptions récentes</h4>
                {patientPrescriptions.length > 0 ? (
                  <div className="space-y-2">
                    {patientPrescriptions.slice(0, 3).map((prescription) => (
                      <div key={prescription.id} className="bg-white border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">
                              Prescription du {new Date(prescription.date).toLocaleDateString()}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {prescription.medications.length} médicament(s)
                            </p>
                          </div>
                          <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">
                            <Visibility className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune prescription enregistrée</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      {viewingRecord && (
        <MedicalRecordViewer
          record={viewingRecord}
          onClose={() => setViewingRecord(null)}
          onExport={(record) => {
            const dataStr = JSON.stringify(record, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `dossier_${record.title}_${new Date(record.date).toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(url);
            toast.show('Dossier exporté avec succès', 'success');
          }}
        />
      )}

      {showExporter && selectedPatient && (
        <MedicalRecordExporter
          patient={selectedPatient}
          pregnancyRecord={patientPregnancyRecord}
          medicalRecords={patientMedicalRecords}
          prescriptions={patientPrescriptions}
          emergencyContacts={patientEmergencyContacts}
          onClose={() => setShowExporter(false)}
        />
      )}

      {/* Formulaires pour ajouter des dossiers médicaux et prescriptions */}
      {/* Ces formulaires seraient implémentés de manière similaire au dashboard admin */}
    </div>
  );
};

export default DoctorDashboardPage;
