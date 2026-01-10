
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface CardDetails {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
}

class PaymentService {
  /**
   * Simulates a call to an Australian payment gateway.
   * Logic: 
   * - CVV '000' triggers a bank decline.
   * - Card starting with '5' simulates a verification delay.
   */
  async processTransaction(amount: number, details: CardDetails): Promise<PaymentResult> {
    console.log(`[PaymentGateway] Initiating transaction of $${amount} for ${details.name}`);
    
    // Simulate network latency (2-4 seconds)
    const latency = 2000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, latency));

    // Security Check Simulation
    if (details.cvv === '000') {
      return { 
        success: false, 
        error: "Declined: Insufficient funds or card restricted by your bank." 
      };
    }

    if (details.number.replace(/\s/g, '').length < 16) {
      return {
        success: false,
        error: "Invalid card number. Please check the 16-digit sequence."
      };
    }

    // Success
    return {
      success: true,
      transactionId: `DSM-PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
  }
}

export const paymentService = new PaymentService();
