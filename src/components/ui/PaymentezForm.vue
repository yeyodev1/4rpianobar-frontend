<script setup lang="ts">
import { ref } from 'vue';
import PaymentVerification from '@/components/payment/PaymentVerification.vue';
import PaymentCardList from '@/components/payment/PaymentCardList.vue';
import PaymentNewCard from '@/components/payment/PaymentNewCard.vue';
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
  }
});

const emit = defineEmits(['success', 'error', 'cancel']);

// States: 'identifying' -> 'selecting_card' -> 'entering_new_card' -> 'processing'
const step = ref('identifying');
const internalUserId = ref(props.userId);
const internalEmail = ref(props.userEmail);
const internalName = ref(props.userName);
const verificationCode = ref('');
const selectedCardToken = ref('');
const isProcessing = ref(false);
const errorMessage = ref('');
const newCardRef = ref<any>(null);

const handleVerified = (data: { email: string, code: string }) => {
  internalEmail.value = data.email;
  verificationCode.value = data.code;
  // Note: We'll use the provided userId for now, or the one from previous sessions if backend returned it.
  // The backend return value of requestVerification could be useful here.
  step.value = 'selecting_card';
};

const handleCardSelected = async (card: any) => {
  selectedCardToken.value = card.token;
  await processPayment();
};

const handleNewCardTokenized = async (token: string) => {
  selectedCardToken.value = token;
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
    emit('success', response.transaction);
  } catch (err: any) {
    console.error('Payment processing error:', err);
    errorMessage.value = err.message || 'Error al procesar el pago.';
    isProcessing.value = false;
    // If it was a code error, maybe go back to verification? 
    // For now stay here and show error.
  }
};

const handleButtonClick = () => {
  if (step.value === 'entering_new_card' && newCardRef.value) {
    newCardRef.value.tokenize();
  }
};
</script>

<template>
  <div class="paymentez-form-stepper">
    <!-- Step 1 & 2: Verification -->
    <PaymentVerification 
      v-if="step === 'identifying'"
      v-model:email="internalEmail"
      v-model:name="internalName"
      @verified="handleVerified"
    />

    <!-- Step 3: Selection -->
    <PaymentCardList
      v-else-if="step === 'selecting_card'"
      :user-id="internalUserId"
      @select="handleCardSelected"
      @add-new="step = 'entering_new_card'"
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

    <!-- Global Processing View -->
    <div v-if="isProcessing" class="processing-overlay">
      <div class="spinner"></div>
      <p>Procesando transacción segura...</p>
    </div>

    <div v-if="errorMessage && !isProcessing" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="form-actions" v-if="!isProcessing && step !== 'identifying'">
      <button 
        v-if="step === 'entering_new_card'"
        @click="handleButtonClick" 
        class="btn-submit"
        :disabled="isProcessing"
      >
        <span>Pagar ${{ amount }}</span>
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

.error-message {
  padding: 1rem;
  background-color: rgba(colors.$error, 0.1);
  color: colors.$error;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
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
  border: 4px solid rgba(0,0,0,0.1);
  border-top-color: colors.$BRAND-PRIMARY;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}
</style>

