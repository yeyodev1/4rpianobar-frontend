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
  cedula?: string;
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
  gateway_response?: {
    transaction: {
      id: string;
      status: string;
      current_status?: string;
      status_detail?: number;
      carrier_code?: string;
      authorization_code?: string;
      amount: number;
      [key: string]: any;
    };
    card?: any;
  };
}

export interface OTPVerificationRequest {
  userId: string;
  transactionId: string;
  email: string;
  code: string;
  otp: string;
}

export interface OTPVerificationResponse {
  message: string;
  transaction: {
    id: string;
    status: string;
    authorization_code?: string;
    amount: number;
    carrier_code?: string;
    [key: string]: any;
  };
  gateway_response?: {
    transaction: {
      id: string;
      status: string;
      current_status?: string;
      status_detail?: number;
      carrier_code?: string;
      authorization_code?: string;
      amount: number;
      [key: string]: any;
    };
    card?: any;
  };
}

export interface InitReferenceRequest {
  userId: string;
  email: string;
  amount: number;
  description: string;
  verificationCode: string;
  cedula?: string;
}

export interface InitReferenceResponse {
  reference: string;
  message: string;
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

  async listCards(userId: string, email: string, code: string): Promise<CardResponse> {
    const response = await this.get<CardResponse>(`payment/paymentez/cards/${userId}?email=${email}&code=${code}`);
    return response.data;
  }

  async listUserTransactions(userId: string, email: string, code: string): Promise<any> {
    const response = await this.get(`payment/paymentez/transactions/${userId}?email=${email}&code=${code}`);
    return response.data;
  }

  async deleteCard(userId: string, token: string, email: string, code: string): Promise<any> {
    const response = await this.delete(`payment/paymentez/cards/${userId}/${token}?email=${email}&code=${code}`);
    return response.data;
  }

  async refund(transactionId: string, amount?: number): Promise<any> {
    const response = await this.post('payment/paymentez/refund', { transactionId, amount });
    return response.data;
  }

  async verifyOTP(data: OTPVerificationRequest): Promise<OTPVerificationResponse> {
    const response = await this.post<OTPVerificationResponse>('payment/paymentez/verify-otp', data);
    return response.data;
  }

  async initPaymentReference(data: InitReferenceRequest): Promise<InitReferenceResponse> {
    const response = await this.post<InitReferenceResponse>('payment/paymentez/init-reference', data);
    return response.data;
  }

  async saveTransaction(transaction: any, userId: string, email: string, name?: string, cedula?: string): Promise<any> {
    const response = await this.post('payment/paymentez/save-transaction', {
      transaction,
      userId,
      email,
      name,
      cedula
    });
    return response.data;
  }
}

export default new PaymentAPI();

