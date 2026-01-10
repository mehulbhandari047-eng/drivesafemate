
import { User, UserRole, Booking, Instructor, Review } from '../types';
import { supabase } from './supabaseClient';

export interface SystemLog {
  id: string;
  timestamp: string;
  service: 'SUPABASE' | 'GEMINI' | 'PAYMENT' | 'LOCALSTORAGE' | 'SYSTEM';
  action: string;
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
  details?: string;
  traceId: string;
}

class DatabaseService {
  private logs: SystemLog[] = [];
  private logListeners: ((logs: SystemLog[]) => void)[] = [];

  constructor() {
    this.seedData();
  }

  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private addLog(log: Omit<SystemLog, 'id' | 'timestamp' | 'traceId'>) {
    const traceId = `TRC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newLog: SystemLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      traceId
    };
    this.logs = [newLog, ...this.logs].slice(0, 100); 
    this.logListeners.forEach(l => l(this.logs));
    return traceId;
  }

  seedData() {
    const isSeeded = localStorage.getItem('dsm_seeded');
    if (isSeeded) return;

    this.addLog({ service: 'SYSTEM', action: 'SEED_DATABASE', status: 'PENDING', details: 'Initializing first-run Australian data' });

    const mockInstructors: Instructor[] = [
      {
        id: 'inst_1', userId: 'u_inst_1', name: 'David Thompson', avatar: 'https://i.pravatar.cc/150?u=david',
        specialties: ['Nervous Drivers', 'Night Driving'], rating: 4.9, reviewCount: 128, pricePerHour: 75,
        suburbs: ['Bondi', 'Coogee', 'Randwick'], available: true, transmission: 'Automatic', carModel: '2023 Toyota Corolla',
        languages: ['English'], isVerified: true, bio: 'Patient local expert with 15 years experience in Sydney eastern suburbs.'
      },
      {
        id: 'inst_2', userId: 'u_inst_2', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah',
        specialties: ['Manual Specialist', 'Overseas Conversions'], rating: 5.0, reviewCount: 84, pricePerHour: 85,
        suburbs: ['Parramatta', 'Blacktown', 'Westmead'], available: true, transmission: 'Manual', carModel: '2024 Mazda 3',
        languages: ['English', 'Mandarin'], isVerified: true, bio: 'Manual gearbox specialist focused on technical precision and safety.'
      }
    ];

    const mockBookings: Booking[] = [
      {
        id: 'book_up_1', studentId: 'u_current', studentName: 'John Doe', instructorId: 'inst_2',
        instructorName: 'Sarah Chen', dateTime: new Date(Date.now() + 86400000).toISOString().split('T')[0] + ' 11:00 AM', 
        status: 'CONFIRMED', duration: 60, location: 'Parramatta Station', price: 85
      }
    ];

    localStorage.setItem('dsm_instructors', JSON.stringify(mockInstructors));
    localStorage.setItem('dsm_bookings', JSON.stringify(mockBookings));
    localStorage.setItem('dsm_users', JSON.stringify([
      this.getMockUserByRole(UserRole.STUDENT),
      this.getMockUserByRole(UserRole.INSTRUCTOR),
      this.getMockUserByRole(UserRole.ADMIN)
    ]));
    localStorage.setItem('dsm_seeded', 'true');
    
    this.addLog({ service: 'SYSTEM', action: 'SEED_DATABASE', status: 'SUCCESS', details: 'Seed complete' });
  }

  async login(email: string, _pass: string): Promise<User | null> {
    await this.delay(800);
    const users = JSON.parse(localStorage.getItem('dsm_users') || '[]');
    const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.addLog({ service: 'SUPABASE', action: 'LOGIN', status: 'SUCCESS', details: email });
      return user;
    }
    return null;
  }

  async registerUser(data: { name: string, email: string, password?: string, role: UserRole }): Promise<User> {
    await this.delay(1000);
    const id = `u_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = {
      id,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      isVerified: false
    };
    
    const users = JSON.parse(localStorage.getItem('dsm_users') || '[]');
    localStorage.setItem('dsm_users', JSON.stringify([...users, newUser]));
    this.addLog({ service: 'SUPABASE', action: 'REGISTER', status: 'SUCCESS', details: data.email });
    return newUser;
  }

  async onboardInstructor(data: Omit<Instructor, 'id' | 'rating' | 'reviewCount' | 'isVerified'>): Promise<Instructor> {
    await this.delay(1200);
    const id = `inst_${Math.random().toString(36).substr(2, 9)}`;
    const newInstructor: Instructor = {
      ...data,
      id,
      rating: 0,
      reviewCount: 0,
      isVerified: false
    };
    
    const current = JSON.parse(localStorage.getItem('dsm_instructors') || '[]');
    localStorage.setItem('dsm_instructors', JSON.stringify([...current, newInstructor]));
    this.addLog({ service: 'LOCALSTORAGE', action: 'ONBOARD_VENDOR', status: 'SUCCESS', details: id });
    return newInstructor;
  }

  subscribeToLogs(listener: (logs: SystemLog[]) => void) {
    this.logListeners.push(listener);
    listener(this.logs);
    return () => {
      this.logListeners = this.logListeners.filter(l => l !== listener);
    };
  }

  getMockUserByRole(role: UserRole): User {
    const personas = {
      [UserRole.ADMIN]: {
        id: 'admin_1', name: 'Sheila Higgins', email: 'principal@drivesafemate.com.au',
        role: UserRole.ADMIN, avatar: 'https://i.pravatar.cc/150?u=sheila', isVerified: true
      },
      [UserRole.INSTRUCTOR]: {
        id: 'u_inst_2', name: 'Sarah Chen', email: 'sarah.chen@drivesafemate.com.au',
        role: UserRole.INSTRUCTOR, avatar: 'https://i.pravatar.cc/150?u=sarah', isVerified: true
      },
      [UserRole.STUDENT]: {
        id: 'u_current', name: 'John Doe', email: 'john.doe@student.com.au',
        role: UserRole.STUDENT, avatar: 'https://i.pravatar.cc/150?u=john', isVerified: false
      }
    };
    return personas[role];
  }

  async getAllBookings(): Promise<Booking[]> {
    const local = JSON.parse(localStorage.getItem('dsm_bookings') || '[]');
    return local.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }

  async getAdminStats() {
    const bookings = await this.getAllBookings();
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
    return {
      totalRevenue: totalRevenue || 12450,
      platformFees: (totalRevenue || 12450) * 0.15,
      activeInstructors: 42,
      activeStudents: 856,
      pendingVerifications: 5,
      bookingsThisMonth: bookings.length || 128
    };
  }

  async getInstructors(): Promise<Instructor[]> {
    return JSON.parse(localStorage.getItem('dsm_instructors') || '[]');
  }

  async getInstructorReviews(instructorId: string): Promise<Review[]> {
    return [
      { id: 'rev_1', instructorId, studentName: 'Lachlan M.', rating: 5, comment: 'Patient and professional.', date: '2023-11-15' }
    ];
  }

  async getBookings(userId: string, role: UserRole): Promise<Booking[]> {
    const local = JSON.parse(localStorage.getItem('dsm_bookings') || '[]');
    return local.filter((b: Booking) => 
      role === UserRole.STUDENT ? b.studentId === userId : b.instructorId === userId
    );
  }

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const id = `book_${Math.random().toString(36).substr(2, 9)}`;
    const newBooking = { ...booking, id } as Booking;
    const all = JSON.parse(localStorage.getItem('dsm_bookings') || '[]');
    localStorage.setItem('dsm_bookings', JSON.stringify([newBooking, ...all]));
    return newBooking;
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    const all = JSON.parse(localStorage.getItem('dsm_bookings') || '[]');
    const updated = all.map((b: Booking) => b.id === id ? { ...b, status } : b);
    localStorage.setItem('dsm_bookings', JSON.stringify(updated));
  }

  async getAvailableInstructors(date: string, time: string): Promise<Instructor[]> {
    await this.delay(600);
    return this.getInstructors();
  }

  async simulateActivity() {
    this.addLog({ service: 'SYSTEM', action: 'TRAFFIC_SIM', status: 'SUCCESS' });
  }
}

export const dbService = new DatabaseService();
