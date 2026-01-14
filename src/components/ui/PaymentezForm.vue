<script setup lang="ts">
import { ref, watch } from 'vue';
import PaymentVerification from '@/components/payment/PaymentVerification.vue';
import PaymentCardList from '@/components/payment/PaymentCardList.vue';
import PaymentNewCard from '@/components/payment/PaymentNewCard.vue';
import PaymentTransactionList from '@/components/payment/PaymentTransactionList.vue';
import paymentAPI from '@/services/payment';

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

const emit = defineEmits(['success', 'error', 'cancel']);

// States: 'identifying' -> 'selecting_card' -> 'entering_new_card' -> 'processing' | 'help_center'
const step = ref('identifying');
const internalUserId = ref(props.userId);
const internalEmail = ref(props.userEmail);
const internalName = ref(props.userName);
const verificationCode = ref('');
const selectedCardToken = ref('');
const selectedCardData = ref<any>(null);
const showPayConfirm = ref(false);
const isProcessing = ref(false);
const errorMessage = ref('');
const newCardRef = ref<any>(null);
const helpRequested = ref(props.autoHelp);

// OTP verification states
const awaitingOTP = ref(false);
const otpTransactionId = ref('');
const otpCode = ref('');
const pendingTransactionData = ref<any>(null);

watch(() => props.autoHelp, (newVal) => {
  helpRequested.value = newVal;
  if (newVal) {
    // If autoHelp is triggered, we should probably be in identifying step or help_center
    if (step.value !== 'help_center' && step.value !== 'identifying') {
      step.value = 'identifying'; // Force re-verification if not verified
    }
  }
});

const handleVerified = (data: { email: string, code: string, userId?: string | null }) => {
  errorMessage.value = ''; // Clear any previous errors upon success
  internalEmail.value = data.email;
  verificationCode.value = data.code;

  if (data.userId) {
    internalUserId.value = data.userId;
  } else {
    // Generate temporary if not existing user
    internalUserId.value = 'u_' + Date.now();
  }

  // For now, if we're in help mode, we proceed to help, otherwise to card selection
  if (step.value === 'identifying' && helpRequested.value) {
    // If help was requested, we needed verification first
    step.value = 'help_center';
  } else {
    step.value = 'selecting_card';
  }
};

const openHelp = () => {
  helpRequested.value = true;
  if (step.value === 'identifying') {
    // Already in identifying, will proceed to help after verification
  } else {
    // Already verified (in theory), go to help
    step.value = 'help_center';
  }
};

const handleCardSelected = (card: any) => {
  selectedCardToken.value = card.token;
  selectedCardData.value = card;
  showPayConfirm.value = true;
};

const handleNewCardTokenized = (token: string) => {
  // For new cards, card data might not be fully available yet, but we have the token
  selectedCardToken.value = token;
  selectedCardData.value = { type: 'Nueva Tarjeta', number: 'Seleccionada' };
  showPayConfirm.value = true;
};

const confirmAndProcess = async () => {
  showPayConfirm.value = false;
  await processPayment();
};

const processPayment = async () => {
  try {
    isProcessing.value = true;
    errorMessage.value = '';

    const chargeData = {
      token: selectedCardToken.value,
      amount: props.amount,
      email: internalEmail.value,
      userId: internalUserId.value,
      verificationCode: verificationCode.value,
      description: `${props.description} (Entradas: ${props.guestCount})`,
      name: internalName.value
    };

    const response = await paymentAPI.processCharge(chargeData);

    isProcessing.value = false;

    // Check if OTP verification is required (Diners cards)
    const carrierCode = response.transaction?.carrier_code || response.gateway_response?.transaction?.carrier_code;
    const transactionStatus = response.transaction?.status || response.gateway_response?.transaction?.status;
    const transactionId = response.transaction?.id || response.gateway_response?.transaction?.id;

    if (carrierCode === 'WAITING_OTP' && transactionStatus === 'pending') {
      // Switch to OTP input mode
      awaitingOTP.value = true;
      otpTransactionId.value = transactionId || '';
      pendingTransactionData.value = response;
      showPayConfirm.value = false;
    } else if (transactionStatus === 'success' || transactionStatus === 'approved') {
      // Transaction completed successfully
      emit('success', response.transaction || response.gateway_response?.transaction);
    } else {
      // Transaction failed
      errorMessage.value = response.message || 'Transaction was not approved.';
    }
  } catch (err: any) {
    console.error('Payment processing error:', err);
    const msg = err.response?.data?.message || err.message || 'Error al procesar el pago.';

    if (msg.toLowerCase().includes('verification') || msg.toLowerCase().includes('code')) {
      handleError(msg);
    } else {
      errorMessage.value = msg;
    }
    isProcessing.value = false;
  }
};

const handleButtonClick = () => {
  if (step.value === 'entering_new_card' && newCardRef.value) {
    newCardRef.value.tokenize();
  }
};

const submitOTP = async () => {
  if (!otpCode.value || otpCode.value.length < 4) {
    errorMessage.value = 'Por favor ingresa un código OTP válido.';
    return;
  }

  try {
    isProcessing.value = true;
    errorMessage.value = '';

    const otpData = {
      userId: internalUserId.value,
      transactionId: otpTransactionId.value,
      email: internalEmail.value,
      code: verificationCode.value,
      otp: otpCode.value
    };

    const response = await paymentAPI.verifyOTP(otpData);

    isProcessing.value = false;

    // Check if OTP verification is still pending (incorrect OTP)
    const carrierCode = response.transaction?.carrier_code || response.gateway_response?.transaction?.carrier_code;
    const transactionStatus = response.transaction?.status || response.gateway_response?.transaction?.status;

    if (carrierCode === 'WAITING_OTP' && transactionStatus === 'pending') {
      // OTP was incorrect, clear input and show error, but keep form open for retry
      otpCode.value = '';
      errorMessage.value = 'Código OTP incorrecto. Por favor verifica e intenta nuevamente.';
      // Stay in awaitingOTP mode for retry
    } else if (transactionStatus === 'success' || transactionStatus === 'approved') {
      // OTP verified successfully
      awaitingOTP.value = false;
      emit('success', response.transaction || response.gateway_response?.transaction);
    } else {
      // Other failure
      errorMessage.value = response.message || 'No se pudo verificar la transacción. Por favor intenta nuevamente.';
      otpCode.value = ''; // Clear for retry
    }
  } catch (err: any) {
    console.error('OTP verification error:', err);
    errorMessage.value = err.response?.data?.message || err.message || 'Error al verificar el código OTP.';
    otpCode.value = ''; // Clear input on error
    isProcessing.value = false;
  }
};

const cancelOTP = () => {
  awaitingOTP.value = false;
  otpCode.value = '';
  otpTransactionId.value = '';
  pendingTransactionData.value = null;
  step.value = 'selecting_card';
};

const handleError = (message: string) => {
  errorMessage.value = message;
  step.value = 'identifying';
};
</script>

<template>
  <div class="paymentez-form-stepper">
    <!-- Step 1 & 2: Verification -->
    <div v-if="step === 'identifying'">
      <div class="help-intro" v-if="helpRequested">
        <i class="fa-solid fa-circle-question"></i>
        <h3>Centro de Ayuda</h3>
        <p>Para gestionar tus tarjetas o ver tus transacciones, necesitamos verificar tu correo.</p>
      </div>
      <PaymentVerification 
        v-model:email="internalEmail"
        v-model:name="internalName"
        :error="errorMessage"
        @verified="handleVerified"
      />
    </div>

    <!-- Step 3: Selection -->
    <PaymentCardList
      v-else-if="step === 'selecting_card'"
      :user-id="internalUserId"
      :email="internalEmail"
      :verification-code="verificationCode"
      @select="handleCardSelected"
      @add-new="step = 'entering_new_card'"
      @error="handleError"
    />

    <!-- Step 4: New Card -->
    <PaymentNewCard
      v-else-if="step === 'entering_new_card'"
      ref="newCardRef"
      :user-id="internalUserId"
      :user-email="internalEmail"
      @tokenized="handleNewCardTokenized"
      @cancel="step = 'selecting_card'"
    />

    <!-- Help Center View -->
    <div v-else-if="step === 'help_center'" class="help-center">
      <div class="help-header">
        <button @click="step = 'selecting_card'" class="btn-back">
          <i class="fa-solid fa-arrow-left"></i> Volver al pago
        </button>
        <h2>Mi Cuenta</h2>
      </div>
      
      <div class="help-sections">
        <section class="help-section">
          <PaymentCardList 
            :user-id="internalUserId"
            :email="internalEmail"
            :verification-code="verificationCode"
            @add-new="step = 'entering_new_card'"
            @error="handleError"
          />
        </section>
        
        <hr class="section-divider" />
        
        <section class="help-section">
          <PaymentTransactionList 
            :user-id="internalUserId" 
            :email="internalEmail"
            :verification-code="verificationCode"
            @error="handleError"
          />
        </section>
      </div>
    </div>

    <!-- OTP Verification View -->
    <div v-if="awaitingOTP && !isProcessing" class="otp-verification-section">
      <div class="otp-header">
        <div class="icon-circle">
          <i class="fa-solid fa-shield-keyhole"></i>
        </div>
        <h3>Verificación de Seguridad</h3>
        <p class="otp-instructions">
          Se ha enviado un código OTP a tu dispositivo registrado. Por favor ingresa el código para completar la transacción.
        </p>
      </div>

      <div class="otp-input-container">
        <label for="otp-input">Código OTP</label>
        <input
          id="otp-input"
          v-model="otpCode"
          type="text"
          inputmode="numeric"
          maxlength="10"
          placeholder="Ingresa el código OTP"
          class="otp-input"
          @keyup.enter="submitOTP"
        />
      </div>

      <div class="otp-actions">
        <button @click="submitOTP" class="btn-verify-otp" :disabled="!otpCode">
          <i class="fa-solid fa-check-circle"></i> Verificar Código
        </button>
        <button @click="cancelOTP" class="btn-cancel-otp">
          Cancelar
        </button>
      </div>
    </div>

    <!-- Global Processing View -->
    <div v-if="isProcessing" class="processing-overlay">
      <div class="spinner"></div>
      <p>Procesando transacción segura...</p>
    </div>

    <div v-if="errorMessage && !isProcessing && step !== 'identifying' && awaitingOTP" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="form-actions" v-if="!isProcessing && step !== 'identifying' && !awaitingOTP">
      <button 
        v-if="step === 'entering_new_card'"
        @click="handleButtonClick" 
        class="btn-submit"
        :disabled="isProcessing"
      >
        <span>Pagar ${{ amount }}</span>
      </button>
      
      <button 
        v-if="step !== 'help_center'"
        @click="$emit('cancel')" 
        class="btn-cancel" 
        :disabled="isProcessing"
      >
        Cancelar
      </button>
    </div>

    <!-- Help Link (only shown when not in help or already verified) -->
    <div class="help-trigger" v-if="!isProcessing && step !== 'help_center' && !helpRequested && !awaitingOTP">
      <button @click="openHelp" class="btn-help">
        <i class="fa-solid fa-circle-question"></i> ¿Necesitas ayuda con tus transacciones?
      </button>
    </div>

    <!-- Final Payment Confirmation Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPayConfirm" class="pay-modal-backdrop" @click="showPayConfirm = false">
          <div class="pay-modal-container" @click.stop>
            <div class="modal-header">
              <div class="icon-pulse">
                <i class="fa-solid fa-shield-check"></i>
              </div>
              <h3>Confirmar Pago Seguro</h3>
            </div>
            
            <div class="modal-body">
              <div class="pay-summary">
                <div class="pay-row">
                  <span>Monto Total:</span>
                  <strong class="pay-amount">${{ amount }}</strong>
                </div>
                <div class="pay-row">
                  <span>Método:</span>
                  <strong v-if="selectedCardData">{{ selectedCardData.type }} •••• {{ selectedCardData.number }}</strong>
                </div>
              </div>
              <p class="pay-confirmation-text">¿Procedemos con la compra usando esta tarjeta?</p>
            </div>

            <div class="modal-footer">
              <button @click="confirmAndProcess" class="btn-pay-now">
                Sí, Confirmar Pago
              </button>
              <button @click="showPayConfirm = false" class="btn-pay-cancel">
                Revisar Detalles
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.paymentez-form-stepper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.processing-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  gap: 1.5rem;

  p {
    font-weight: 600;
    color: colors.$BRAND-PRIMARY;
    animation: pulse 2s infinite;
  }
}

.help-intro {
  text-align: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(colors.$BRAND-PRIMARY, 0.05);
  border-radius: 12px;

  i {
    font-size: 2rem;
    color: colors.$BRAND-PRIMARY;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    color: colors.$BRAND-PRIMARY;
    margin-bottom: 0.3rem;
  }
}

.help-center {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: slideUp 0.3s ease-out;
}

.help-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h2 {
    font-family: 'Playfair Display', serif;
    color: colors.$BRAND-PRIMARY;
    font-size: 1.5rem;
  }
}

.btn-back {
  background: none;
  border: none;
  color: colors.$text-light;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0;
  width: fit-content;

  &:hover {
    color: colors.$BRAND-PRIMARY;
  }
}

.section-divider {
  border: none;
  border-top: 1px solid colors.$border-light;
  margin: 0.5rem 0;
}

.help-trigger {
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid colors.$border-light;
  display: flex;
  justify-content: center;
}

.btn-help {
  background: none;
  border: none;
  color: colors.$text-light;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    color: colors.$BRAND-PRIMARY;
  }
}

.error-message {
  padding: 1rem;
  background-color: rgba(colors.$error, 0.1);
  color: colors.$error;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
}

.btn-submit {
  background-color: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1.1rem;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(colors.$BRAND-PRIMARY, 0.2);
  transition: all 0.3s;

  &:hover {
    background-color: darken(colors.$BRAND-PRIMARY, 5%);
    transform: translateY(-2px);
  }
}

.btn-cancel {
  background: transparent;
  border: 1px solid colors.$border-light;
  color: colors.$text-light;
  padding: 0.8rem;
  border-radius: 10px;
  cursor: pointer;
}

.spinner {
  width: 45px;
  height: 45px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: colors.$BRAND-PRIMARY;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
  }
}

/* Pay Confirmation Modal Styles */
.pay-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  padding: 1rem;
}

.pay-modal-container {
  background: white;
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.3);
  animation: modalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);

  .icon-pulse {
    width: 60px;
    height: 60px;
    background: colors.$BRAND-PRIMARY;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin: 0 auto 1.2rem;
    box-shadow: 0 0 0 0 rgba(colors.$BRAND-PRIMARY, 0.4);
    animation: iconPulse 2s infinite;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    color: colors.$text-dark;
    margin-bottom: 1.5rem;
  }
}

.pay-summary {
  background: colors.$background-light;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  .pay-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      color: colors.$text-light;
      font-size: 0.9rem;
    }

    strong {
      color: colors.$text-dark;
      font-size: 1rem;
    }

    .pay-amount {
      color: colors.$BRAND-PRIMARY;
      font-size: 1.4rem;
      font-weight: 800;
    }
  }
}

.pay-confirmation-text {
  font-size: 0.95rem;
  color: colors.$text-dark;
  font-weight: 600;
  margin-bottom: 2rem;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.btn-pay-now {
  background: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1.1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(colors.$BRAND-PRIMARY, 0.2);

  &:hover {
    background: colors.$text-dark;
    transform: translateY(-2px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  }
}

.btn-pay-cancel {
  background: none;
  border: 1px solid colors.$border-light;
  color: colors.$text-light;
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: colors.$background-light;
    color: colors.$text-dark;
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes iconPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(colors.$BRAND-PRIMARY, 0.4);
  }

  70% {
    box-shadow: 0 0 0 15px rgba(colors.$BRAND-PRIMARY, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(colors.$BRAND-PRIMARY, 0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* OTP Verification Styles */
.otp-verification-section {
  padding: 2rem;
  background: linear-gradient(135deg, rgba(colors.$BRAND-PRIMARY, 0.05) 0%, rgba(colors.$BRAND-PRIMARY, 0.02) 100%);
  border-radius: 16px;
  border: 2px solid rgba(colors.$BRAND-PRIMARY, 0.1);
  animation: slideUp 0.4s ease-out;
}

.otp-header {
  text-align: center;
  margin-bottom: 2rem;

  .icon-circle {
    width: 70px;
    height: 70px;
    background: colors.$BRAND-PRIMARY;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin: 0 auto 1.2rem;
    box-shadow: 0 8px 20px rgba(colors.$BRAND-PRIMARY, 0.3);
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    color: colors.$text-dark;
    margin-bottom: 0.8rem;
  }

  .otp-instructions {
    color: colors.$text-light;
    font-size: 0.95rem;
    line-height: 1.5;
    max-width: 400px;
    margin: 0 auto;
  }
}

.otp-input-container {
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-weight: 600;
    color: colors.$text-dark;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .otp-input {
    width: 100%;
    padding: 1rem;
    font-size: 1.2rem;
    text-align: center;
    letter-spacing: 0.3em;
    border: 2px solid colors.$border-light;
    border-radius: 12px;
    transition: all 0.3s;
    font-weight: 600;
    color: colors.$text-dark;

    &:focus {
      outline: none;
      border-color: colors.$BRAND-PRIMARY;
      box-shadow: 0 0 0 4px rgba(colors.$BRAND-PRIMARY, 0.1);
    }

    &::placeholder {
      letter-spacing: normal;
      font-weight: normal;
      color: colors.$text-light;
      opacity: 0.5;
    }
  }
}

.otp-actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.btn-verify-otp {
  background: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1.1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(colors.$BRAND-PRIMARY, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: darken(colors.$BRAND-PRIMARY, 5%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(colors.$BRAND-PRIMARY, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-cancel-otp {
  background: transparent;
  border: 1px solid colors.$border-light;
  color: colors.$text-light;
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: colors.$background-light;
    color: colors.$text-dark;
  }
}
</style>
