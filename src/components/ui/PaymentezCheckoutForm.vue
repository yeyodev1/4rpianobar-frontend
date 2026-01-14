<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import paymentAPI from '@/services/payment';
import paymentezCheckout from '@/services/paymentezCheckout';
import type { CheckoutResponse } from '@/services/paymentezCheckout';
import PaymentVerification from '@/components/payment/PaymentVerification.vue';
import PaymentTransactionList from '@/components/payment/PaymentTransactionList.vue';

const props = defineProps({
  userEmail: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  guestCount: {
    type: Number,
    default: 1
  },
  description: {
    type: String,
    default: 'Reserva 4R Piano Bar'
  },
  userName: {
    type: String,
    default: ''
  },
  autoHelp: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['success', 'error', 'cancel', 'requestHideModal', 'requestShowModal']);

// State
const step = ref<'identifying' | 'ready' | 'transactions'>('identifying');
const internalUserId = ref(props.userId);
const internalEmail = ref(props.userEmail);
const internalName = ref(props.userName);
const verificationCode = ref('');
const isProcessing = ref(false);
const errorMessage = ref('');
const checkoutInitialized = ref(false);
const helpRequested = ref(props.autoHelp);

// Watch for autoHelp changes
watch(() => props.autoHelp, (newVal) => {
  helpRequested.value = newVal;
  if (newVal && step.value !== 'transactions' && step.value !== 'identifying') {
    if (step.value === 'ready') step.value = 'transactions';
  }
});

// Initialize Checkout modal
const initializeCheckout = async () => {
  try {
    await paymentezCheckout.initialize({
      env_mode: import.meta.env.VITE_PAYMENTEZ_ENV || 'stg',
      onOpen: () => {
        console.log('[PaymentezCheckout] Modal opened - hiding parent modal');
        isProcessing.value = true;
        errorMessage.value = '';
        // Hide parent modal when Checkout opens
        emit('requestHideModal');
      },
      onClose: () => {
        console.log('[PaymentezCheckout] Modal closed - showing parent modal again');
        isProcessing.value = false;
        // Show parent modal again when Checkout closes (user cancelled or error)
        emit('requestShowModal');
      },
      onResponse: handleCheckoutResponse
    });
    checkoutInitialized.value = true;
  } catch (err) {
    console.error('Failed to initialize Checkout:', err);
    errorMessage.value = 'No se pudo inicializar la pasarela de pagos.';
  }
};

// Handle verification success
const handleVerified = (data: { email: string, code: string, userId?: string | null }) => {
  errorMessage.value = '';
  internalEmail.value = data.email;
  verificationCode.value = data.code;

  if (data.userId) {
    internalUserId.value = data.userId;
  } else {
    internalUserId.value = 'u_' + Date.now();
  }

  // Always go to transaction list first after verification
  step.value = 'transactions';
};

// Process payment with Checkout
const processPayment = async () => {
  try {
    isProcessing.value = true;
    errorMessage.value = '';

    // Get payment reference from backend
    const { reference } = await paymentAPI.initPaymentReference({
      userId: internalUserId.value,
      email: internalEmail.value,
      amount: props.amount,
      description: `${props.description} (Entradas: ${props.guestCount})`,
      verificationCode: verificationCode.value
    });

    console.log('[PaymentezCheckout] Opening with reference:', reference);

    // Open Checkout modal
    paymentezCheckout.open(reference);
  } catch (err: any) {
    console.error('Payment error:', err);
    errorMessage.value = err.response?.data?.message || err.message || 'Error al iniciar el pago.';
    isProcessing.value = false;
  }
};

// Handle Checkout response
const handleCheckoutResponse = async (response: CheckoutResponse) => {
  isProcessing.value = false;

  if (response.error) {
    // Error from Checkout
    errorMessage.value = response.error.description || 'Error en el proceso de pago.';
    emit('error', response.error);
  } else if (response.transaction) {
    // Transaction completed
    if (response.transaction.status === 'success') {
      try {
        // Save transaction to backend with user details
        const savedResponse = await paymentAPI.saveTransaction(
          response.transaction,
          internalUserId.value,
          internalEmail.value
        );
        // Emit the saved transaction from backend (contains DB ID, etc.)
        emit('success', savedResponse.transaction);
      } catch (err) {
        console.error('Failed to save transaction:', err);
        // Fallback: emit original Paymentez transaction if save fails
        emit('success', response.transaction);
      }
    } else {
      errorMessage.value = 'La transacción no fue aprobada.';
      emit('error', response.transaction);
    }
  }
};

const handleError = (message: string) => {
  errorMessage.value = message;
  step.value = 'identifying';
};

onMounted(() => {
  initializeCheckout();
});

onUnmounted(() => {
  if (checkoutInitialized.value) {
    paymentezCheckout.close();
  }
});
</script>

<template>
  <div class="paymentez-checkout-wrapper">
    <!-- Step 1: Verification -->
    <div v-if="step === 'identifying'">
      <div class="info-header">
        <i class="fa-solid fa-credit-card"></i>
        <h3>Información de Pago</h3>
        <p>Verifica tu correo para continuar con el pago seguro.</p>
      </div>
      <PaymentVerification 
        v-model:email="internalEmail"
        v-model:name="internalName"
        :error="errorMessage"
        @verified="handleVerified"
      />
    </div>

    <!-- Step 3: Transaction List (Clean View) -->
    <div v-else-if="step === 'transactions'">
      <div class="transactions-header">
        <h3 class="view-title">Mis Transacciones</h3>
        <button v-if="!autoHelp" @click="step = 'ready'" class="btn-proceed-top">
          Pagar ${{ amount }} <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
      
      <PaymentTransactionList
        :user-id="internalUserId"
        :email="internalEmail"
        :verification-code="verificationCode"
      />

      <div class="transactions-footer" v-if="autoHelp">
        <button @click="$emit('cancel')" class="btn-cancel">
          Cerrar
        </button>
      </div>
    </div>

    <!-- Step 2: Ready to Pay -->
    <div v-else-if="step === 'ready'">
        <!-- Help Link in Payment View -->
        <div class="help-link-wrapper">
           <button class="btn-text-help" @click="step = 'transactions'">
             <i class="fa-solid fa-clock-rotate-left"></i>
             Ver mis transacciones pasadas
           </button>
        </div>  
      <div class="payment-summary">
        <div class="summary-card">
          <div class="summary-header">
            <i class="fa-solid fa-ticket"></i>
            <h3>Resumen de Compra</h3>
          </div>
          
          <div class="summary-details">
            <div class="detail-row">
              <span class="label">Descripción:</span>
              <strong>{{ description }}</strong>
            </div>
            <div class="detail-row">
              <span class="label">Entradas:</span>
              <strong>{{ guestCount }} {{ guestCount === 1 ? 'persona' : 'personas' }}</strong>
            </div>
            <div class="detail-row total">
              <span class="label">Total a Pagar:</span>
              <strong class="amount">${{ amount }}</strong>
            </div>
          </div>
        </div>

        <div class="checkout-info">
          <i class="fa-solid fa-shield-check"></i>
          <p>Pago 100% Seguro procesado por Paymentez</p>
        </div>

        <button 
          @click="processPayment" 
          class="btn-pay"
          :disabled="isProcessing || !checkoutInitialized"
        >
          <i class="fa-solid fa-lock" v-if="!isProcessing"></i>
          <div class="btn-spinner" v-else></div>
          {{ isProcessing ? 'Procesando...' : `Pagar $${amount}` }}
        </button>

        <button 
          @click="$emit('cancel')" 
          class="btn-cancel"
          :disabled="isProcessing"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage && !isProcessing" class="error-message">
      <i class="fa-solid fa-circle-exclamation"></i>
      {{ errorMessage }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.paymentez-checkout-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(colors.$BRAND-PRIMARY, 0.05) 0%, rgba(colors.$BRAND-PRIMARY, 0.02) 100%);
  border-radius: 12px;

  i {
    font-size: 2rem;
    color: colors.$BRAND-PRIMARY;
    margin-bottom: 0.8rem;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    color: colors.$BRAND-PRIMARY;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: colors.$text-light;
    font-size: 0.95rem;
  }
}

.payment-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: slideUp 0.4s ease-out;
}

.summary-card {
  background: white;
  border: 2px solid rgba(colors.$BRAND-PRIMARY, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.summary-header {
  background: linear-gradient(135deg, colors.$BRAND-PRIMARY 0%, darken(colors.$BRAND-PRIMARY, 10%) 100%);
  color: white;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  i {
    font-size: 1.5rem;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    margin: 0;
  }
}

.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  .view-title {
    font-family: 'Playfair Display', serif;
    color: colors.$BRAND-PRIMARY;
    font-size: 1.4rem;
    margin: 0;
  }
}

.btn-proceed-top {
  background: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(colors.$BRAND-PRIMARY, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(colors.$BRAND-PRIMARY, 0.3);
  }
}

.transactions-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.help-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  h3 {
    font-family: 'Playfair Display', serif;
    color: colors.$BRAND-PRIMARY;
    font-size: 1.4rem;
    margin: 0;
  }
}

.pending-reservation-banner {
  background: rgba(colors.$BRAND-PRIMARY, 0.05);
  border: 1px solid rgba(colors.$BRAND-PRIMARY, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  .banner-content {
    flex: 1;
    font-size: 0.9rem;

    strong {
      color: colors.$BRAND-PRIMARY;
      display: block;
      margin-bottom: 0.2rem;
    }

    p {
      color: colors.$text-light;
      margin: 0;
      font-size: 0.85rem;
    }
  }
}

.btn-proceed-pay {
  background: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(colors.$BRAND-PRIMARY, 0.2);

  &:hover {
    background: darken(colors.$BRAND-PRIMARY, 5%);
    transform: translateY(-1px);
  }
}


.summary-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid colors.$border-light;

  &:last-child {
    border-bottom: none;
  }

  &.total {
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 2px solid colors.$BRAND-PRIMARY;

    .amount {
      font-size: 1.8rem;
      color: colors.$BRAND-PRIMARY;
    }
  }

  .label {
    color: colors.$text-light;
    font-size: 0.95rem;
  }

  strong {
    color: colors.$text-dark;
    font-weight: 600;
  }
}

.checkout-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem;
  background: rgba(colors.$BRAND-PRIMARY, 0.05);
  border-radius: 10px;

  i {
    color: colors.$BRAND-PRIMARY;
    font-size: 1.2rem;
  }

  p {
    color: colors.$text-dark;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
  }
}

.btn-pay {
  background: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1.3rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.15rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(colors.$BRAND-PRIMARY, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;

  &:hover:not(:disabled) {
    background: darken(colors.$BRAND-PRIMARY, 5%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(colors.$BRAND-PRIMARY, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

.btn-cancel {
  background: transparent;
  border: 1px solid colors.$border-light;
  color: colors.$text-light;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: colors.$background-light;
    color: colors.$text-dark;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.error-message {
  padding: 1rem;
  background-color: rgba(colors.$error, 0.1);
  color: colors.$error;
  border-radius: 10px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  border-left: 4px solid colors.$error;

  i {
    font-size: 1.2rem;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
