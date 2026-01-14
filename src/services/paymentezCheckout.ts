/**
 * Paymentez Checkout Service
 * Wrapper for Paymentez Checkout SDK
 * Documentation: https://developers.paymentez.com/docs/payments/#checkout
 */

type CheckoutEnvironment = 'prod' | 'stg' | 'local';

interface CheckoutResponse {
  transaction?: {
    status: 'success' | 'failure';
    id: string;
    status_detail: number;
    [key: string]: any;
  };
  error?: {
    type: string;
    help: string;
    description: string;
  };
}

interface CheckoutConfig {
  env_mode: CheckoutEnvironment;
  onOpen?: () => void;
  onClose?: () => void;
  onResponse: (response: CheckoutResponse) => void;
}

class PaymentezCheckoutService {
  private checkoutInstance: any = null;
  private sdkLoaded = false;

  /**
   * Load Paymentez Checkout SDK dynamically
   */
  async loadSDK(): Promise<void> {
    if (this.sdkLoaded) return;

    return new Promise((resolve, reject) => {
      // Check if SDK is already loaded
      if ((window as any).PaymentCheckout) {
        this.sdkLoaded = true;
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = 'https://cdn.paymentez.com/ccapi/sdk/payment_checkout_3.0.0.min.js';
      script.async = true;

      script.onload = () => {
        this.sdkLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Paymentez Checkout SDK'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Initialize Paymentez Checkout modal
   */
  async initialize(config: CheckoutConfig): Promise<void> {
    await this.loadSDK();

    const PaymentCheckout = (window as any).PaymentCheckout;

    if (!PaymentCheckout) {
      throw new Error('Paymentez Checkout SDK not loaded');
    }

    this.checkoutInstance = new PaymentCheckout.modal({
      env_mode: config.env_mode,
      onOpen: () => {
        console.log('[Paymentez Checkout] Modal opened');
        if (config.onOpen) config.onOpen();
      },
      onClose: () => {
        console.log('[Paymentez Checkout] Modal closed');
        if (config.onClose) config.onClose();
      },
      onResponse: (response: CheckoutResponse) => {
        console.log('[Paymentez Checkout] Response received:', response);
        config.onResponse(response);
      }
    });
  }

  /**
   * Open Checkout modal with a payment reference
   */
  open(reference: string): void {
    if (!this.checkoutInstance) {
      throw new Error('Checkout not initialized. Call initialize() first.');
    }

    console.log('[Paymentez Checkout] Opening with reference:', reference);
    this.checkoutInstance.open({ reference });
  }

  /**
   * Close Checkout modal
   */
  close(): void {
    if (this.checkoutInstance) {
      this.checkoutInstance.close();
    }
  }

  /**
   * Check if Checkout is initialized
   */
  isInitialized(): boolean {
    return this.checkoutInstance !== null;
  }
}

export default new PaymentezCheckoutService();
export type { CheckoutResponse, CheckoutConfig, CheckoutEnvironment };
