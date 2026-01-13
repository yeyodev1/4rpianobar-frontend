import APIBase from './httpBase';

export interface PaymentRequest {
  token: string;
  amount: number;
  email: string;
  userId: string;
  verificationCode: string; // Required in new flow
  description?: string;
  name?: string;
}

export interface VerificationRequest {
  email: string;
  name?: string;
}

export interface VerificationResponse {
  message: string;
  userId: string | null;
}

export interface CardResponse {
  message: string;
  cards: any[];
  hits: number;
}

export interface PaymentResponse {
  message: string;
  transaction: {
    id: string;
    status: string;
    authorization_code: string;
    amount: number;
    [key: string]: any;
  };
}

class PaymentAPI extends APIBase {
  async requestVerification(data: VerificationRequest): Promise<VerificationResponse> {
    const response = await this.post<VerificationResponse>('payment/paymentez/verify-code', data);
    return response.data;
  }

  async processCharge(data: PaymentRequest): Promise<PaymentResponse> {
    const response = await this.post<PaymentResponse>('payment/paymentez/charge', data);
    return response.data;
  }

  async listCards(userId: string): Promise<CardResponse> {
    const response = await this.get<CardResponse>(`payment/paymentez/cards/${userId}`);
    return response.data;
  }

  async deleteCard(userId: string, token: string): Promise<any> {
    const response = await this.delete(`payment/paymentez/cards/${userId}/${token}`);
    return response.data;
  }

  async refund(transactionId: string, amount?: number): Promise<any> {
    const response = await this.post('payment/paymentez/refund', { transactionId, amount });
    return response.data;
  }
}

export default new PaymentAPI();

