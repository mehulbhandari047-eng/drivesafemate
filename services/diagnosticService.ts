
import { dbService } from './databaseService';
import { analyzeSystemHealth, generateLearningPath } from './geminiService';
import { paymentService } from './paymentService';
import { supabase } from './supabaseClient';
import { UserRole } from '../types';

export interface TestStep {
  id: string;
  name: string;
  category: 'AUTH' | 'DATA' | 'AI' | 'PAYMENT';
  status: 'IDLE' | 'RUNNING' | 'PASS' | 'FAIL';
  message: string;
  latency?: number;
}

class DiagnosticService {
  async runAutomatedAudit(onStepUpdate: (steps: TestStep[]) => void): Promise<boolean> {
    const steps: TestStep[] = [
      { id: '1', name: 'Cloud Connectivity', category: 'DATA', status: 'IDLE', message: 'Checking Supabase heartbeat...' },
      { id: '2', name: 'Auth Resilience', category: 'AUTH', status: 'IDLE', message: 'Simulating new student registration...' },
      { id: '3', name: 'Discovery Engine', category: 'DATA', status: 'IDLE', message: 'Querying instructor marketplace...' },
      { id: '4', name: 'Gemini AI Logic', category: 'AI', status: 'IDLE', message: 'Requesting personalized learning path...' },
      { id: '5', name: 'Transaction Bridge', category: 'PAYMENT', status: 'IDLE', message: 'Processing test payment...' },
      { id: '6', name: 'Data Integrity', category: 'DATA', status: 'IDLE', message: 'Verifying booking persistence...' },
    ];

    const update = (id: string, patch: Partial<TestStep>) => {
      const idx = steps.findIndex(s => s.id === id);
      steps[idx] = { ...steps[idx], ...patch };
      onStepUpdate([...steps]);
    };

    try {
      // Step 1: Cloud Connectivity
      update('1', { status: 'RUNNING' });
      const start1 = performance.now();
      const status = await dbService.checkConnectivity();
      if (status === 'DISCONNECTED') throw new Error("Cloud connection unreachable.");
      update('1', { status: 'PASS', message: 'Cloud link verified.', latency: Math.round(performance.now() - start1) });

      // Step 2: Auth Resilience
      update('2', { status: 'RUNNING' });
      const start2 = performance.now();
      const testEmail = `audit_${Math.random().toString(36).substr(2, 5)}@test.com`;
      const testUser = await dbService.registerUser({
        name: 'Audit Bot',
        email: testEmail,
        role: UserRole.STUDENT
      });
      if (!testUser.id) throw new Error("Registration failed.");
      update('2', { status: 'PASS', message: `Registered temporary auditor: ${testEmail}`, latency: Math.round(performance.now() - start2) });

      // Step 3: Discovery Engine
      update('3', { status: 'RUNNING' });
      const start3 = performance.now();
      const instructors = await dbService.getInstructors();
      if (instructors.length === 0) throw new Error("No marketplace data returned.");
      update('3', { status: 'PASS', message: `Marketplace returned ${instructors.length} coaches.`, latency: Math.round(performance.now() - start3) });

      // Step 4: Gemini AI Logic
      update('4', { status: 'RUNNING' });
      const start4 = performance.now();
      const path = await generateLearningPath({ state: 'NSW', hoursLogged: 5, goals: ['Safety', 'Parking'] });
      if (!path || path.length === 0) throw new Error("AI failed to generate valid JSON path.");
      update('4', { status: 'PASS', message: `Gemini generated ${path.length} modules.`, latency: Math.round(performance.now() - start4) });

      // Step 5: Transaction Bridge
      update('5', { status: 'RUNNING' });
      const start5 = performance.now();
      const payment = await paymentService.processTransaction(1, {
        name: 'AUDIT_BOT',
        number: '4242 4242 4242 4242',
        expiry: '12/28',
        cvv: '123'
      });
      if (!payment.success) throw new Error("Payment gateway rejected transaction.");
      update('5', { status: 'PASS', message: `TX Approved: ${payment.transactionId}`, latency: Math.round(performance.now() - start5) });

      // Step 6: Data Integrity
      update('6', { status: 'RUNNING' });
      const start6 = performance.now();
      const newBooking = await dbService.createBooking({
        studentId: testUser.id,
        studentName: testUser.name,
        instructorId: instructors[0].id,
        instructorName: instructors[0].name,
        dateTime: '2025-01-01 10:00 AM',
        status: 'CONFIRMED',
        duration: 60,
        location: 'Audit Point',
        price: 1
      });
      const verify = await dbService.getBookings(testUser.id, UserRole.STUDENT);
      if (verify.length === 0) throw new Error("Booking record lost in persistence layer.");
      update('6', { status: 'PASS', message: 'Transactional chain intact.', latency: Math.round(performance.now() - start6) });

      return true;
    } catch (e: any) {
      const runningIdx = steps.findIndex(s => s.status === 'RUNNING');
      if (runningIdx !== -1) {
        update(steps[runningIdx].id, { status: 'FAIL', message: e.message || "Unknown error" });
      }
      return false;
    }
  }

  // Backward compatibility for the simple dashboard view
  async runFullSuite() {
    const results: any[] = [];
    const status = await dbService.checkConnectivity();
    results.push({ name: 'Cloud Connectivity', category: 'DATA', status: status === 'CONNECTED' ? 'PASS' : 'FAIL', message: 'Checking heartbeat...' });
    return results;
  }
}

export const diagnosticService = new DiagnosticService();
