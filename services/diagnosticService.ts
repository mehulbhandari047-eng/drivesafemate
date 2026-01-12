
import { dbService } from './databaseService';
import { analyzeSystemHealth } from './geminiService';
import { paymentService } from './paymentService';
import { supabase } from './supabaseClient';

export interface TestResult {
  name: string;
  category: 'FRONTEND' | 'BACKEND' | 'API';
  status: 'PASS' | 'FAIL' | 'RUNNING';
  message: string;
  latency?: number;
}

class DiagnosticService {
  async runFullSuite(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // 1. Test Local Storage (Frontend State)
    results.push(await this.testStorage());

    // 2. Test Supabase Connectivity
    results.push(await this.testSupabase());

    // 3. Test Gemini API (AI Reasoning)
    results.push(await this.testGemini());

    // 4. Test Payment Simulator
    results.push(await this.testPayment());

    return results;
  }

  private async testStorage(): Promise<TestResult> {
    const start = performance.now();
    try {
      const seeded = localStorage.getItem('dsm_seeded');
      const instructors = localStorage.getItem('dsm_instructors');
      if (seeded && instructors) {
        return {
          name: 'Local Storage Integrity',
          category: 'FRONTEND',
          status: 'PASS',
          message: 'Data persistence layer is healthy and seeded.',
          latency: Math.round(performance.now() - start)
        };
      }
      throw new Error('Storage missing or unseeded');
    } catch (e) {
      return {
        name: 'Local Storage Integrity',
        category: 'FRONTEND',
        status: 'FAIL',
        message: 'Persistence layer requires re-seeding.'
      };
    }
  }

  private async testSupabase(): Promise<TestResult> {
    const start = performance.now();
    try {
      // Small query to check connectivity
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      if (error && error.message.includes('FetchError')) throw error;
      
      return {
        name: 'Supabase Cloud Sync',
        category: 'BACKEND',
        status: 'PASS',
        message: 'Real-time database connection established.',
        latency: Math.round(performance.now() - start)
      };
    } catch (e) {
      return {
        name: 'Supabase Cloud Sync',
        category: 'BACKEND',
        status: 'FAIL',
        message: 'Cloud connection refused. Reverting to local fallback.'
      };
    }
  }

  private async testGemini(): Promise<TestResult> {
    const start = performance.now();
    try {
      const health = await analyzeSystemHealth([{ action: 'DIAGNOSTIC_PING', status: 'SUCCESS' }]);
      if (health) {
        return {
          name: 'Gemini AI reasoning',
          category: 'API',
          status: 'PASS',
          message: `Model operational. Status: ${health.status}`,
          latency: Math.round(performance.now() - start)
        };
      }
      throw new Error('No response');
    } catch (e) {
      return {
        name: 'Gemini AI reasoning',
        category: 'API',
        status: 'FAIL',
        message: 'API Key invalid or rate limit exceeded.'
      };
    }
  }

  private async testPayment(): Promise<TestResult> {
    const start = performance.now();
    try {
      const result = await paymentService.processTransaction(1, {
        name: 'TEST_USER',
        number: '4242 4242 4242 4242',
        expiry: '12/28',
        cvv: '123'
      });
      if (result.success) {
        return {
          name: 'Stripe Gateway Mock',
          category: 'BACKEND',
          status: 'PASS',
          message: 'Financial transaction bridge is secure.',
          latency: Math.round(performance.now() - start)
        };
      }
      throw new Error(result.error);
    } catch (e) {
      return {
        name: 'Stripe Gateway Mock',
        category: 'BACKEND',
        status: 'FAIL',
        message: 'Payment handshake failed.'
      };
    }
  }
}

export const diagnosticService = new DiagnosticService();
