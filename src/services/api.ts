// Détection automatique de l'URL de l'API avec support ngrok amélioré
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // En développement local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // Détection ngrok (tous les domaines ngrok possibles)
  const isNgrok = hostname.includes('ngrok') || 
                  hostname.includes('ngrok-free.app') || 
                  hostname.includes('ngrok.app') || 
                  hostname.includes('ngrok.io');
  
  if (isNgrok) {
    // Sur ngrok, utiliser le proxy Vite qui redirige vers localhost:3001
    // Le proxy Vite transforme /api/users en localhost:3001/users
    console.log('🌐 Détection ngrok - utilisation du proxy Vite');
    return '/api';
  }
  
  // Pour d'autres environnements (production, staging, etc.)
  // Utiliser le proxy Vite par défaut
  console.log('🌐 Environnement non-local - utilisation du proxy Vite');
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Types pour TypeScript
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  profileType: 'pregnant_woman' | 'doctor' | 'administrator';
  profileImage: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Informations professionnelles pour les médecins
  specialty?: string;
  licenseNumber?: string;
  hospital?: string;
  yearsOfExperience?: number;
  certifications?: string[];
  languages?: string[];
  consultationFee?: number;
  availability?: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  bio?: string;
  education?: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  awards?: Array<{
    title: string;
    year: number;
    organization: string;
  }>;
}

export interface DoctorPatient {
  id: number;
  doctorId: number;
  patientId: number;
  assignedAt: string;
  status: 'active' | 'inactive' | 'discharged';
  notes?: string;
}

export interface Campaign {
  id?: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string; // ex: 'planned' | 'active' | 'completed' | 'upcoming'
  targetAudience?: string;
  location?: string;
  organizer?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Community {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  isPublic: boolean;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

// Types grossesse
export interface MedicalParams {
  systolicMmHg: number;
  diastolicMmHg: number;
  fastingGlucoseMgDl: number;
  hemoglobinGdl: number;
  bmi: number;
  preExistingConditions: string[];
  allergies: string[];
  riskFlags: string[];
}

export interface PregnancyRecord {
  id: number;
  userId: number;
  dueDate: string;
  currentWeek: number;
  lastMenstrualPeriod: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  babyName?: string;
  ultrasound: {
    date: string;
    summary: string;
    estimatedWeightGrams: number;
    lengthCm: number;
  };
  ultrasounds?: Array<{
    date: string;
    summary: string;
    estimatedWeightGrams: number;
    lengthCm: number;
  }>;
  symptoms: { name: string; severity: string }[];
  medications: { name: string; dose: string; frequency: string }[];
  nutrition: {
    caloriesTarget: number;
    waterLitersTarget: number;
    activityTargetMinPerWeek: number;
  };
  medicalParams?: MedicalParams;
  notes: string;
}

export interface Appointment {
  id: number;
  userId: number;
  doctorId?: number;
  type: string;
  date: string; // ISO
  status: string;
  notes?: string;
}

// Configuration des timeouts et retry
const REQUEST_TIMEOUT = 10000; // 10 secondes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

// Fonction pour attendre un délai
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction utilitaire pour les requêtes avec retry et timeout
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Ajouter un timeout à la requête
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  config.signal = controller.signal;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Making API request to: ${url} (attempt ${attempt}/${MAX_RETRIES})`);
      const response = await fetch(url, config);
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`API request failed: ${response.status} ${response.statusText}`);
        
        // Fallback dev: si on utilise '/api' et que ça échoue, réessayer localhost:3001
        if (API_BASE_URL === '/api' && attempt === 1) {
          const fallbackUrl = `http://localhost:3001${endpoint}`;
          console.warn('Retrying request with fallback URL:', fallbackUrl);
          const retryConfig = { ...config };
          delete retryConfig.signal; // Reset signal for retry
          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), REQUEST_TIMEOUT);
          retryConfig.signal = retryController.signal;
          
          try {
            const retry = await fetch(fallbackUrl, retryConfig);
            clearTimeout(retryTimeoutId);
            if (!retry.ok) throw new Error(`HTTP error! status: ${retry.status}`);
            return await retry.json();
          } catch (retryError) {
            clearTimeout(retryTimeoutId);
            console.warn('Fallback request also failed:', retryError);
          }
        }
        
        // Si c'est une erreur 4xx, ne pas retry
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        // Pour les erreurs 5xx, retry
        if (attempt < MAX_RETRIES) {
          console.warn(`Retrying in ${RETRY_DELAY}ms...`);
          await delay(RETRY_DELAY * attempt); // Délai progressif
          continue;
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Si c'est une erreur d'abort (timeout), retry
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`Request timeout (${REQUEST_TIMEOUT}ms) on attempt ${attempt}`);
        if (attempt < MAX_RETRIES) {
          console.warn(`Retrying in ${RETRY_DELAY}ms...`);
          await delay(RETRY_DELAY * attempt);
          continue;
        }
        throw new Error('Request timeout - Le serveur met trop de temps à répondre');
      }
      
      // Pour les erreurs réseau, retry
      if (attempt < MAX_RETRIES) {
        console.warn(`Network error on attempt ${attempt}, retrying in ${RETRY_DELAY}ms...`, error);
        await delay(RETRY_DELAY * attempt);
        continue;
      }
      
      console.error('API request failed after all retries:', error);
      console.error('Request URL:', url);
      console.error('Request config:', config);
      throw error;
    }
  }
  
  throw new Error('Maximum retry attempts exceeded');
}

// API pour les utilisateurs
export const userApi = {
  // Récupérer tous les utilisateurs
  getAll: (): Promise<User[]> => request<User[]>('/users'),
  
  // Récupérer un utilisateur par ID
  getById: (id: number): Promise<User> => request<User>(`/users/${id}`),
  
  // Récupérer un utilisateur par email
  getByEmail: (email: string): Promise<User[]> => 
    request<User[]>(`/users?email=${email}`),
  
  // Créer un nouvel utilisateur
  create: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> =>
    request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  // Mettre à jour un utilisateur
  update: (id: number, userData: Partial<User>): Promise<User> =>
    request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  // Supprimer un utilisateur
  delete: (id: number): Promise<void> =>
    request<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
  
  // Authentification
  login: async (email: string, password: string): Promise<User | null> => {
    const users = await request<User[]>(`/users?email=${email}&password=${password}`);
    return users.length > 0 ? users[0] : null;
  },
};

// API pour les campagnes
export const campaignApi = {
  getAll: (): Promise<Campaign[]> => request<Campaign[]>('/campaigns'),
  getById: (id: number): Promise<Campaign> => request<Campaign>(`/campaigns/${id}`),
  create: (data: Omit<Campaign, 'id'>): Promise<Campaign> =>
    request<Campaign>('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Campaign>): Promise<Campaign> =>
    request<Campaign>(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number): Promise<void> => request<void>(`/campaigns/${id}`, { method: 'DELETE' }),
};

// API pour les communautés
export const communityApi = {
  getAll: (): Promise<Community[]> => request<Community[]>('/communities'),
  getById: (id: number): Promise<Community> => request<Community>(`/communities/${id}`),
  create: (communityData: Omit<Community, 'id' | 'createdAt'>): Promise<Community> =>
    request<Community>('/communities', {
      method: 'POST',
      body: JSON.stringify(communityData),
    }),
  update: (id: number, communityData: Partial<Community>): Promise<Community> =>
    request<Community>(`/communities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(communityData),
    }),
  delete: (id: number): Promise<void> =>
    request<void>(`/communities/${id}`, {
      method: 'DELETE',
    }),
};

// API pour les notifications
export const notificationApi = {
  getByUserId: (userId: number): Promise<Notification[]> => 
    request<Notification[]>(`/notifications?userId=${userId}`),
  markAsRead: (id: number): Promise<Notification> =>
    request<Notification>(`/notifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead: true }),
    }),
  create: (notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> =>
    request<Notification>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }),
};

// API pour les dossiers de grossesse
export const pregnancyApi = {
  getByUserId: async (userId: number): Promise<PregnancyRecord | null> => {
    const records = await request<PregnancyRecord[]>(`/pregnancy-records?userId=${userId}`);
    return records.length > 0 ? records[0] : null;
  },
  create: (data: Omit<PregnancyRecord, 'id'>): Promise<PregnancyRecord> =>
    request<PregnancyRecord>('/pregnancy-records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<PregnancyRecord>): Promise<PregnancyRecord> =>
    request<PregnancyRecord>(`/pregnancy-records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  addSymptom: async (record: PregnancyRecord, s: { name: string; severity: string }): Promise<PregnancyRecord> => {
    const symptoms = [...(record.symptoms || [])];
    symptoms.push(s);
    return pregnancyApi.update(record.id, { symptoms });
  },
  removeSymptom: async (record: PregnancyRecord, name: string): Promise<PregnancyRecord> => {
    const symptoms = (record.symptoms || []).filter(s => s.name !== name);
    return pregnancyApi.update(record.id, { symptoms });
  },
  updateSymptom: async (record: PregnancyRecord, prevName: string, s: { name: string; severity: string }): Promise<PregnancyRecord> => {
    const symptoms = (record.symptoms || []).map(x => x.name === prevName ? s : x);
    return pregnancyApi.update(record.id, { symptoms });
  },
  addMedication: async (record: PregnancyRecord, m: { name: string; dose: string; frequency: string }): Promise<PregnancyRecord> => {
    const medications = [...(record.medications || [])];
    medications.push(m);
    return pregnancyApi.update(record.id, { medications });
  },
  removeMedication: async (record: PregnancyRecord, name: string): Promise<PregnancyRecord> => {
    const medications = (record.medications || []).filter(m => m.name !== name);
    return pregnancyApi.update(record.id, { medications });
  },
  updateMedication: async (record: PregnancyRecord, prevName: string, m: { name: string; dose: string; frequency: string }): Promise<PregnancyRecord> => {
    const medications = (record.medications || []).map(x => x.name === prevName ? m : x);
    return pregnancyApi.update(record.id, { medications });
  },
  addUltrasound: async (record: PregnancyRecord, u: { date: string; summary: string; estimatedWeightGrams: number; lengthCm: number }): Promise<PregnancyRecord> => {
    const ultrasounds = [...(record.ultrasounds || []), u];
    // garder un champ "ultrasound" de compat pour le dernier
    return pregnancyApi.update(record.id, { ultrasounds, ultrasound: u });
  },
};

// API pour les rendez-vous
export const appointmentApi = {
  getByUserId: (userId: number): Promise<Appointment[]> =>
    request<Appointment[]>(`/appointments?userId=${userId}`),
  create: (data: Omit<Appointment, 'id'>): Promise<Appointment> =>
    request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<Appointment>): Promise<Appointment> =>
    request<Appointment>(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: number): Promise<void> =>
    request<void>(`/appointments/${id}`, { method: 'DELETE' }),
};

// Types pour les dossiers médicaux
export interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  recordType: 'consultation' | 'laboratory' | 'ultrasound' | 'prescription' | 'other';
  title: string;
  date: string;
  content: any;
  attachments?: Array<{
    type: 'image' | 'pdf' | 'document';
    name: string;
    url: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalPrescription {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  notes?: string;
  createdAt: string;
}

export interface EmergencyContact {
  id: number;
  patientId: number;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface HealthCenter {
  id: number;
  name: string;
  type: 'hospital' | 'clinic' | 'health_center' | 'maternity';
  address: string;
  city: string;
  region: string;
  phone: string;
  email?: string;
  website?: string;
  description?: string;
  services: string[];
  specialties: string[];
  capacity: number;
  isActive: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// API pour les relations médecin-patient
export const doctorPatientApi = {
  getByDoctorId: (doctorId: number): Promise<DoctorPatient[]> => 
    request<DoctorPatient[]>(`/doctorPatients?doctorId=${doctorId}`),
  getByPatientId: (patientId: number): Promise<DoctorPatient[]> => 
    request<DoctorPatient[]>(`/doctorPatients?patientId=${patientId}`),
  create: (relation: Omit<DoctorPatient, 'id'>): Promise<DoctorPatient> =>
    request<DoctorPatient>('/doctorPatients', {
      method: 'POST',
      body: JSON.stringify(relation),
    }),
  update: (id: number, relation: Partial<DoctorPatient>): Promise<DoctorPatient> =>
    request<DoctorPatient>(`/doctorPatients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(relation),
    }),
  delete: (id: number): Promise<void> =>
    request<void>(`/doctorPatients/${id}`, { method: 'DELETE' }),
};

// API pour les dossiers médicaux
export const medicalRecordApi = {
  getByPatientId: (patientId: number): Promise<MedicalRecord[]> =>
    request<MedicalRecord[]>(`/medicalRecords?patientId=${patientId}`),
  getByDoctorId: (doctorId: number): Promise<MedicalRecord[]> =>
    request<MedicalRecord[]>(`/medicalRecords?doctorId=${doctorId}`),
  getById: (id: number): Promise<MedicalRecord> =>
    request<MedicalRecord>(`/medicalRecords/${id}`),
  create: (data: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalRecord> =>
    request<MedicalRecord>('/medicalRecords', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<MedicalRecord>): Promise<MedicalRecord> =>
    request<MedicalRecord>(`/medicalRecords/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number): Promise<void> =>
    request<void>(`/medicalRecords/${id}`, { method: 'DELETE' }),
};

// API pour les prescriptions médicales
export const prescriptionApi = {
  getByPatientId: (patientId: number): Promise<MedicalPrescription[]> =>
    request<MedicalPrescription[]>(`/medicalPrescriptions?patientId=${patientId}`),
  getByDoctorId: (doctorId: number): Promise<MedicalPrescription[]> =>
    request<MedicalPrescription[]>(`/medicalPrescriptions?doctorId=${doctorId}`),
  getById: (id: number): Promise<MedicalPrescription> =>
    request<MedicalPrescription>(`/medicalPrescriptions/${id}`),
  create: (data: Omit<MedicalPrescription, 'id' | 'createdAt'>): Promise<MedicalPrescription> =>
    request<MedicalPrescription>('/medicalPrescriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<MedicalPrescription>): Promise<MedicalPrescription> =>
    request<MedicalPrescription>(`/medicalPrescriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number): Promise<void> =>
    request<void>(`/medicalPrescriptions/${id}`, { method: 'DELETE' }),
};

// API pour les contacts d'urgence
export const emergencyContactApi = {
  getByPatientId: (patientId: number): Promise<EmergencyContact[]> =>
    request<EmergencyContact[]>(`/emergencyContacts?patientId=${patientId}`),
  create: (data: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> =>
    request<EmergencyContact>('/emergencyContacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<EmergencyContact>): Promise<EmergencyContact> =>
    request<EmergencyContact>(`/emergencyContacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number): Promise<void> =>
    request<void>(`/emergencyContacts/${id}`, { method: 'DELETE' }),
};

// Fonction pour assigner automatiquement un médecin à une femme enceinte
export const assignRandomDoctor = async (patientId?: number): Promise<DoctorPatient | null> => {
  try {
    // Si aucun ID n'est fourni, récupérer le dernier utilisateur créé (femme enceinte)
    let actualPatientId = patientId;
    if (!actualPatientId) {
      const allUsers = await userApi.getAll();
      const pregnantWomen = allUsers.filter(user => 
        user.profileType === 'pregnant_woman' && user.isActive
      );
      
      if (pregnantWomen.length === 0) {
        console.warn('Aucune femme enceinte trouvée pour assignation');
        return null;
      }
      
      // Prendre la dernière femme enceinte créée
      actualPatientId = pregnantWomen[pregnantWomen.length - 1].id;
    }
    
    // Récupérer tous les médecins actifs
    const allUsers = await userApi.getAll();
    const doctors = allUsers.filter(user => 
      user.profileType === 'doctor' && user.isActive
    );
    
    if (doctors.length === 0) {
      console.warn('Aucun médecin disponible pour assignation');
      return null;
    }
    
    // Sélectionner un médecin aléatoire
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
    
    // Créer la relation médecin-patient
    const doctorPatientRelation: Omit<DoctorPatient, 'id'> = {
      doctorId: randomDoctor.id,
      patientId: actualPatientId,
      assignedAt: new Date().toISOString(),
      status: 'active',
      notes: 'Assignation automatique lors de la création du compte'
    };
    
    // Enregistrer la relation
    const createdRelation = await doctorPatientApi.create(doctorPatientRelation);
    
    console.log(`Médecin ${randomDoctor.firstName} ${randomDoctor.lastName} assigné à la patiente ${actualPatientId}`);
    return createdRelation;
    
  } catch (error) {
    console.error('Erreur lors de l\'assignation du médecin:', error);
    return null;
  }
};

// API pour les centres de santé
export const healthCenterApi = {
  getAll: (): Promise<HealthCenter[]> => 
    request<HealthCenter[]>('/healthCenters'),
  getById: (id: number): Promise<HealthCenter> => 
    request<HealthCenter>(`/healthCenters/${id}`),
  create: (data: Omit<HealthCenter, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthCenter> => 
    request<HealthCenter>('/healthCenters', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }),
  update: (id: number, data: Partial<Omit<HealthCenter, 'id' | 'createdAt'>>): Promise<HealthCenter> => 
    request<HealthCenter>(`/healthCenters/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        updatedAt: new Date().toISOString()
      })
    }),
  delete: (id: number): Promise<void> => 
    request<void>(`/healthCenters/${id}`, { method: 'DELETE' }),
  getByRegion: (region: string): Promise<HealthCenter[]> => 
    request<HealthCenter[]>(`/healthCenters?region=${region}`),
  getByType: (type: string): Promise<HealthCenter[]> => 
    request<HealthCenter[]>(`/healthCenters?type=${type}`),
  getActive: (): Promise<HealthCenter[]> => 
    request<HealthCenter[]>('/healthCenters?isActive=true')
};
