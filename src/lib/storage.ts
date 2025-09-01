// Local Storage utilities for Shifa Hospital system

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  lastVisit?: string;
  registrationDate: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  image: string;
  availability: {
    days: string[];
    timeSlots: string[];
  };
  consultationFee: number;
  status: 'available' | 'busy' | 'offline';
  languages: string[];
  location: string;
  bio: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  symptoms?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
  patientId?: string;
}

// Storage keys
const STORAGE_KEYS = {
  PATIENTS: 'shifa_patients',
  DOCTORS: 'shifa_doctors',  
  APPOINTMENTS: 'shifa_appointments',
  CHAT_HISTORY: 'shifa_chat_history',
  CURRENT_USER: 'shifa_current_user'
};

// Generic storage functions
export const storage = {
  get: <T>(key: string): T[] => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  set: <T>(key: string, data: T[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  add: <T extends { id: string }>(key: string, item: T): void => {
    const items = storage.get<T>(key);
    const existingIndex = items.findIndex(existing => existing.id === item.id);
    
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.push(item);
    }
    
    storage.set(key, items);
  },

  remove: (key: string, id: string): void => {
    const items = storage.get(key);
    const filtered = items.filter((item: any) => item.id !== id);
    storage.set(key, filtered);
  },

  find: <T extends { id: string }>(key: string, id: string): T | undefined => {
    const items = storage.get<T>(key);
    return items.find(item => item.id === id);
  }
};

// Specific storage functions
export const patientStorage = {
  getAll: () => storage.get<Patient>(STORAGE_KEYS.PATIENTS),
  add: (patient: Patient) => storage.add(STORAGE_KEYS.PATIENTS, patient),
  findByEmail: (email: string) => {
    const patients = storage.get<Patient>(STORAGE_KEYS.PATIENTS);
    return patients.find(p => p.email === email);
  },
  getCurrent: (): Patient | null => {
    try {
      const current = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return current ? JSON.parse(current) : null;
    } catch {
      return null;
    }
  },
  setCurrent: (patient: Patient | null) => {
    if (patient) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(patient));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
};

export const doctorStorage = {
  getAll: () => storage.get<Doctor>(STORAGE_KEYS.DOCTORS),
  add: (doctor: Doctor) => storage.add(STORAGE_KEYS.DOCTORS, doctor),
  findById: (id: string) => storage.find<Doctor>(STORAGE_KEYS.DOCTORS, id),
  search: (query: string, specialization?: string) => {
    const doctors = storage.get<Doctor>(STORAGE_KEYS.DOCTORS);
    return doctors.filter(doctor => {
      const matchesQuery = query === '' || 
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(query.toLowerCase());
      
      const matchesSpecialization = !specialization || 
        doctor.specialization === specialization;
        
      return matchesQuery && matchesSpecialization;
    });
  }
};

export const appointmentStorage = {
  getAll: () => storage.get<Appointment>(STORAGE_KEYS.APPOINTMENTS),
  add: (appointment: Appointment) => storage.add(STORAGE_KEYS.APPOINTMENTS, appointment),
  getByPatient: (patientId: string) => {
    const appointments = storage.get<Appointment>(STORAGE_KEYS.APPOINTMENTS);
    return appointments.filter(apt => apt.patientId === patientId);
  },
  getByDoctor: (doctorId: string) => {
    const appointments = storage.get<Appointment>(STORAGE_KEYS.APPOINTMENTS);
    return appointments.filter(apt => apt.doctorId === doctorId);
  }
};

export const chatStorage = {
  getHistory: (patientId?: string) => {
    const messages = storage.get<ChatMessage>(STORAGE_KEYS.CHAT_HISTORY);
    return patientId 
      ? messages.filter(msg => msg.patientId === patientId)
      : messages;
  },
  addMessage: (message: ChatMessage) => storage.add(STORAGE_KEYS.CHAT_HISTORY, message),
  clearHistory: () => storage.set(STORAGE_KEYS.CHAT_HISTORY, [])
};

// Initialize dummy data
export const initializeDummyData = () => {
  // Check if data already exists
  if (storage.get<Doctor>(STORAGE_KEYS.DOCTORS).length > 0) return;

  // Sample doctors
  const sampleDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      qualifications: ['MBBS', 'MD Cardiology', 'FACC'],
      experience: 12,
      rating: 4.8,
      reviewCount: 127,
      image: '/api/placeholder/300/300',
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
        timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      },
      consultationFee: 150,
      status: 'available',
      languages: ['English', 'Urdu'],
      location: 'Block A, 2nd Floor',
      bio: 'Experienced cardiologist with expertise in interventional cardiology and heart disease prevention.'
    },
    {
      id: '2',
      name: 'Dr. Ahmed Khan',
      specialization: 'Orthopedics',
      qualifications: ['MBBS', 'MS Orthopedics', 'FRCS'],
      experience: 15,
      rating: 4.9,
      reviewCount: 203,
      image: '/api/placeholder/300/300',
      availability: {
        days: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
        timeSlots: ['08:00', '09:00', '10:00', '11:00', '15:00', '16:00']
      },
      consultationFee: 120,
      status: 'available',
      languages: ['English', 'Urdu', 'Hindi'],
      location: 'Block B, 1st Floor',
      bio: 'Specialist in joint replacement surgery and sports medicine with international training.'
    },
    {
      id: '3',
      name: 'Dr. Fatima Ali',
      specialization: 'Dermatology',
      qualifications: ['MBBS', 'MD Dermatology', 'DDV'],
      experience: 8,
      rating: 4.7,
      reviewCount: 89,
      image: '/api/placeholder/300/300',
      availability: {
        days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['10:00', '11:00', '12:00', '14:00', '15:00']
      },
      consultationFee: 100,
      status: 'busy',
      languages: ['English', 'Urdu'],
      location: 'Block C, 3rd Floor',
      bio: 'Expert in cosmetic dermatology and skin cancer treatment with latest laser technologies.'
    },
    {
      id: '4',
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      qualifications: ['MBBS', 'MD Neurology', 'DM'],
      experience: 18,
      rating: 4.9,
      reviewCount: 156,
      image: '/api/placeholder/300/300',
      availability: {
        days: ['Monday', 'Wednesday', 'Friday'],
        timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00']
      },
      consultationFee: 200,
      status: 'available',
      languages: ['English', 'Chinese'],
      location: 'Block A, 4th Floor',
      bio: 'Leading neurologist specializing in stroke treatment and neurological disorders.'
    }
  ];

  // Sample patient (for demo)
  const samplePatient: Patient = {
    id: 'patient-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+92-300-1234567',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    address: '123 Main Street, Karachi',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+92-300-7654321',
      relation: 'Wife'
    },
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin', 'Peanuts'],
    currentMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
    registrationDate: '2024-01-15',
    lastVisit: '2024-08-20'
  };

  // Initialize storage
  storage.set(STORAGE_KEYS.DOCTORS, sampleDoctors);
  storage.set(STORAGE_KEYS.PATIENTS, [samplePatient]);
  storage.set(STORAGE_KEYS.APPOINTMENTS, []);
  storage.set(STORAGE_KEYS.CHAT_HISTORY, []);
};