const API_BASE_URL = 'http://localhost:3001';

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
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
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
