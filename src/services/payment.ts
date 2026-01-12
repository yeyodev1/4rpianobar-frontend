import APIBase from './httpBase';

export interface PaymentRequest {
  token: string;
  amount: number;
  email: string;
  userId: string;
  description?: string;
  name?: string;
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
  async processCharge(data: PaymentRequest): Promise<PaymentResponse> {
    const response = await this.post<PaymentResponse>('payment/paymentez/charge', data);
    return response.data;
  }
}

export default new PaymentAPI();
