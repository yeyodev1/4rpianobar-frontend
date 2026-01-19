/**
 * Paymentez SDK Wrapper Service
 * Handles dynamic script loading and initialization of the PaymentGateway.
 */

interface PaymentezConfig {
  environment: 'stg' | 'prod';
  applicationCode: string;
  applicationKey: string;
}

const DEFAULT_CONFIG: PaymentezConfig = {
  environment: (import.meta.env.VITE_NUVEI_ENV as 'stg' | 'prod') || 'prod',
  applicationCode: import.meta.env.VITE_NUVEI_APP_CODE_CLIENT || 'PIANOBAR-EC-CLIENT',
  applicationKey: import.meta.env.VITE_NUVEI_APP_KEY_CLIENT || 'WpPU7Nsf9IkJh27JPqbnhxSedzBYRb'
};

class PaymentezService {
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  /**
   * Dynamically loads the Paymentez SDK script
   */
  public loadSDK(): Promise<void> {
    if (this.isLoaded) return Promise.resolve();
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.paymentez.com/ccapi/sdk/payment_sdk_stable.min.js';
      script.charset = 'UTF-8';
      script.async = true;
      script.onload = () => {
        // Bridge: In some browsers/environments, top-level 'class' declarations 
        // in a script don't automatically attach to 'window'. 
        // We inject a tiny script to bridge it manually.
        const bridge = document.createElement('script');
        bridge.textContent = `
          if (typeof PaymentGateway !== 'undefined' && !window.PaymentGateway) {
            window.PaymentGateway = PaymentGateway;
          }
          if (typeof Paymentez !== 'undefined' && typeof Paymentez.PaymentGateway === 'function') {
            window.PaymentGateway = Paymentez.PaymentGateway;
          }
        `;
        document.head.appendChild(bridge);

        this.isLoaded = true;
        resolve();
      };
      script.onerror = (err) => {
        this.loadPromise = null;
        reject(new Error('Failed to load Paymentez SDK'));
      };
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  /**
   * Initializes a new instance of the PaymentGateway
   */
  public async createGateway(customConfig?: Partial<PaymentezConfig>) {
    await this.loadSDK();
    const config = { ...DEFAULT_CONFIG, ...customConfig };

    const getConstructor = () => {
      const win = window as any;
      // Some versions expose it directly, others under a Paymentez namespace
      if (typeof win.PaymentGateway === 'function') return win.PaymentGateway;
      if (win.Paymentez && typeof win.Paymentez.PaymentGateway === 'function') return win.Paymentez.PaymentGateway;
      return null;
    };

    let PaymentGatewayConstructor = getConstructor();
    let attempts = 0;

    // Wait up to 3 seconds for the global to be ready
    while (!PaymentGatewayConstructor && attempts < 30) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      PaymentGatewayConstructor = getConstructor();
      attempts++;
    }

    if (!PaymentGatewayConstructor) {
      console.error('Paymentez SDK loaded but PaymentGateway constructor not found.', {
        PaymentGateway: (window as any).PaymentGateway,
        Paymentez: (window as any).Paymentez
      });
      throw new Error('PaymentGateway is not a constructor. Check if the SDK script URL is correct and allowed.');
    }

    return new PaymentGatewayConstructor(
      config.environment,
      config.applicationCode,
      config.applicationKey
    );
  }
}

export default new PaymentezService();
