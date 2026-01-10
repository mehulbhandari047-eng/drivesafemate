
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR'
}

export enum PageView {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  SERVICES = 'SERVICES',
  CONTACT = 'CONTACT',
  DASHBOARD = 'DASHBOARD'
}

export enum TrainingType {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  HYBRID = 'HYBRID'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
}

export interface Booking {
  id: string;
  studentId: string;
  studentName?: string;
  instructorId: string;
  instructorName: string;
  dateTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  duration: number; 
  location: string;
  price: number;
}

export interface AdminStats {
  totalRevenue: number;
  platformFees: number;
  activeInstructors: number;
  activeStudents: number;
  pendingVerifications: number;
  bookingsThisMonth: number;
}

export interface Instructor {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  suburbs: string[];
  distance?: number; 
  available: boolean;
  transmission: 'Automatic' | 'Manual' | 'Both';
  carModel: string;
  languages: string[];
  bio: string;
  isVerified: boolean;
}

/**
 * Interface representing an email notification sent by the system
 */
export interface EmailNotification {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  type: 'CONFIRMATION' | 'CANCELLATION' | 'REMINDER';
}

/**
 * Interface representing a slot in the instructor's calendar
 */
export interface AvailabilitySlot {
  day: string;
  time: string;
  isAvailable: boolean;
}
