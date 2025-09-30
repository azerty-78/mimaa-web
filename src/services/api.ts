// Détection automatique de l'URL de l'API
const getApiBaseUrl = () => {
  // En développement local ou sur ngrok, utiliser le proxy Vite
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // Sur ngrok, utiliser le proxy Vite qui redirige vers localhost:3001
  // Le proxy Vite transforme /api/users en localhost:3001/users
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
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  targetAudience: string;
  location: string;
  organizer: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
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
  type: string;
  date: string; // ISO
  status: string;
  notes?: string;
}

// Fonction utilitaire pour les requêtes
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('Making API request to:', url);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    console.error('Request URL:', url);
    console.error('Request config:', config);
    throw error;
  }
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
      method: 'PATCH',
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
  create: (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> =>
    request<Campaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    }),
  update: (id: number, campaignData: Partial<Campaign>): Promise<Campaign> =>
    request<Campaign>(`/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(campaignData),
    }),
  delete: (id: number): Promise<void> =>
    request<void>(`/campaigns/${id}`, {
      method: 'DELETE',
    }),
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
    const records = await request<PregnancyRecord[]>(`/pregnancyRecords?userId=${userId}`);
    return records.length > 0 ? records[0] : null;
  },
  create: (data: Omit<PregnancyRecord, 'id'>): Promise<PregnancyRecord> =>
    request<PregnancyRecord>('/pregnancyRecords', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<PregnancyRecord>): Promise<PregnancyRecord> =>
    request<PregnancyRecord>(`/pregnancyRecords/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  addSymptom: async (record: PregnancyRecord, s: { name: string; severity: string }): Promise<PregnancyRecord> => {
    const symptoms = [...(record.symptoms || [])];
    symptoms.push(s);
    return pregnancyApi.update(record.id, { symptoms });
  },
  addMedication: async (record: PregnancyRecord, m: { name: string; dose: string; frequency: string }): Promise<PregnancyRecord> => {
    const medications = [...(record.medications || [])];
    medications.push(m);
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
