// Simplified API file for testing
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
  specialty?: string;
  licenseNumber?: string;
  hospital?: string;
}

export interface DoctorPatient {
  id: number;
  doctorId: number;
  patientId: number;
  assignedAt: string;
  status: 'active' | 'inactive' | 'discharged';
  notes?: string;
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
  medicalParams?: {
    systolicMmHg: number;
    diastolicMmHg: number;
    fastingGlucoseMgDl: number;
    hemoglobinGdl: number;
    bmi: number;
    preExistingConditions: string[];
    allergies: string[];
    riskFlags: string[];
  };
  notes: string;
}

// Mock APIs
export const userApi = {
  getAll: async (): Promise<User[]> => [],
  getById: async (id: number): Promise<User> => ({} as User),
  create: async (data: any): Promise<User> => ({} as User),
  update: async (id: number, data: any): Promise<User> => ({} as User),
  delete: async (id: number): Promise<void> => {},
  login: async (email: string, password: string): Promise<User | null> => null,
};

export const doctorPatientApi = {
  getByDoctorId: async (doctorId: number): Promise<DoctorPatient[]> => [],
  getByPatientId: async (patientId: number): Promise<DoctorPatient[]> => [],
  create: async (relation: any): Promise<DoctorPatient> => ({} as DoctorPatient),
  update: async (id: number, relation: any): Promise<DoctorPatient> => ({} as DoctorPatient),
  delete: async (id: number): Promise<void> => {},
};

export const medicalRecordApi = {
  getByPatientId: async (patientId: number): Promise<MedicalRecord[]> => [],
  getByDoctorId: async (doctorId: number): Promise<MedicalRecord[]> => [],
  getById: async (id: number): Promise<MedicalRecord> => ({} as MedicalRecord),
  create: async (data: any): Promise<MedicalRecord> => ({} as MedicalRecord),
  update: async (id: number, data: any): Promise<MedicalRecord> => ({} as MedicalRecord),
  delete: async (id: number): Promise<void> => {},
};

export const prescriptionApi = {
  getByPatientId: async (patientId: number): Promise<MedicalPrescription[]> => [],
  getByDoctorId: async (doctorId: number): Promise<MedicalPrescription[]> => [],
  getById: async (id: number): Promise<MedicalPrescription> => ({} as MedicalPrescription),
  create: async (data: any): Promise<MedicalPrescription> => ({} as MedicalPrescription),
  update: async (id: number, data: any): Promise<MedicalPrescription> => ({} as MedicalPrescription),
  delete: async (id: number): Promise<void> => {},
};

export const emergencyContactApi = {
  getByPatientId: async (patientId: number): Promise<EmergencyContact[]> => [],
  create: async (data: any): Promise<EmergencyContact> => ({} as EmergencyContact),
  update: async (id: number, data: any): Promise<EmergencyContact> => ({} as EmergencyContact),
  delete: async (id: number): Promise<void> => {},
};

export const pregnancyApi = {
  getByUserId: async (userId: number): Promise<PregnancyRecord | null> => null,
  create: async (data: any): Promise<PregnancyRecord> => ({} as PregnancyRecord),
  update: async (id: number, data: any): Promise<PregnancyRecord> => ({} as PregnancyRecord),
  addSymptom: async (record: PregnancyRecord, s: any): Promise<PregnancyRecord> => record,
  removeSymptom: async (record: PregnancyRecord, name: string): Promise<PregnancyRecord> => record,
  updateSymptom: async (record: PregnancyRecord, prevName: string, s: any): Promise<PregnancyRecord> => record,
  addMedication: async (record: PregnancyRecord, m: any): Promise<PregnancyRecord> => record,
  removeMedication: async (record: PregnancyRecord, name: string): Promise<PregnancyRecord> => record,
  updateMedication: async (record: PregnancyRecord, prevName: string, m: any): Promise<PregnancyRecord> => record,
  addUltrasound: async (record: PregnancyRecord, u: any): Promise<PregnancyRecord> => record,
};

export const appointmentApi = {
  getByUserId: async (userId: number): Promise<any[]> => [],
  create: async (data: any): Promise<any> => ({}),
  update: async (id: number, data: any): Promise<any> => ({}),
  delete: async (id: number): Promise<void> => {},
};
