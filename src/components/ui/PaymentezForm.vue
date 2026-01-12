<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import paymentezService from '@/services/paymentez';
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

const isLoading = ref(true);
const isProcessing = ref(false);
const errorMessage = ref('');
const gateway = ref<any>(null);
const customerName = ref(props.userName || '');

const initPaymentez = async () => {
  try {
    isLoading.value = true;
    gateway.value = await paymentezService.createGateway();

    const tokenizeData = {
      locale: 'es',
      user: {
        id: props.userId,
        email: props.userEmail,
      },
      configuration: {
        default_country: 'ECU', // Assuming Ecuador based on context
        require_billing_address: false,
      },
    };

    gateway.value.generate_tokenize(
      tokenizeData,
      '#paymentez-container',
      handleResponse,
      handleIncompleteForm
    );

    isLoading.value = false;
  } catch (err) {
    console.error('Error initializing Paymentez:', err);
    errorMessage.value = 'No se pudo cargar la pasarela de pagos.';
    isLoading.value = false;
  }
};

const handleResponse = async (response: any) => {
  if (response.card && response.card.status === 'valid') {
    if (!customerName.value.trim()) {
      errorMessage.value = 'Por favor, ingresa el nombre de la persona que asistirá.';
      isProcessing.value = false;
      return;
    }

    try {
      // Step 2: Process the charge on our backend
      const chargeData = {
        token: response.card.token,
        amount: props.amount,
        email: props.userEmail,
        userId: props.userId,
        description: `${props.description} (Entradas: ${props.guestCount})`,
        name: customerName.value
      };

      const apiResponse = await paymentAPI.processCharge(chargeData);

      isProcessing.value = false;
      emit('success', apiResponse.transaction);
    } catch (err: any) {
      console.error('Error processing charge on backend:', err);
      errorMessage.value = err.message || 'Error al procesar el pago en el servidor.';
      isProcessing.value = false;
      emit('error', err);
    }
  } else if (response.error) {
    isProcessing.value = false;
    errorMessage.value = response.error.type || 'Error en la tokenización';
    emit('error', response.error);
  } else {
    isProcessing.value = false;
  }
};

const handleIncompleteForm = (message: string) => {
  isProcessing.value = false;
  errorMessage.value = 'Por favor, completa todos los campos requeridos.';
};

const handleTokenize = () => {
  if (!customerName.value.trim()) {
    errorMessage.value = 'Por favor, ingresa el nombre de la persona que asistirá.';
    return;
  }

  errorMessage.value = '';
  isProcessing.value = true;
  if (gateway.value) {
    gateway.value.tokenize();
  }
};

onMounted(() => {
  initPaymentez();
});

onBeforeUnmount(() => {
  // Cleanup if needed, though SDK doesn't specify a destroy method
});
</script>

<template>
  <div class="paymentez-form">
    <div v-if="isLoading" class="paymentez-loader">
      <div class="spinner"></div>
      <p>Cargando pasarela segura...</p>
    </div>

    <div v-show="!isLoading" class="form-inputs">
      <div class="input-group">
        <label for="customer-name" class="input-label">Nombre de la persona que asistirá</label>
        <input 
          id="customer-name" 
          v-model="customerName" 
          type="text" 
          placeholder="Escribe el nombre del asistente"
          :disabled="isProcessing"
          class="form-input"
        />
      </div>

      <div id="paymentez-container" class="paymentez-container"></div>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="form-actions" v-if="!isLoading">
      <button 
        @click="handleTokenize" 
        class="btn-submit" 
        :disabled="isProcessing"
      >
        <div v-if="isProcessing" class="btn-loader">
          <div class="spinner-small"></div>
          <span>Procesando...</span>
        </div>
        <span v-else>Pagar ${{ amount }}</span>
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

.paymentez-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  text-align: left;
}

.paymentez-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
  color: colors.$text-light;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .input-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: colors.$text-dark;
  }

  .form-input {
    padding: 0.8rem 1rem;
    border: 1px solid colors.$border-light;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
    background-color: white;

    color: #000000;

    &:focus {
      outline: none;
      border-color: colors.$BRAND-PRIMARY;
      box-shadow: 0 0 0 2px rgba(colors.$BRAND-PRIMARY, 0.1);
    }

    &:disabled {
      background-color: colors.$background-light;
      cursor: not-allowed;
    }
  }
}

.paymentez-container {
  min-height: 200px;
  width: 100%;

  :deep(.paymentez-input) {
    border-radius: 8px !important;
    border: 1px solid colors.$border-light !important;
    padding: 10px !important;
  }
}

.error-message {
  padding: 0.75rem;
  background-color: rgba(colors.$error, 0.1);
  color: colors.$error;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.btn-submit {
  background-color: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1.1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(colors.$BRAND-PRIMARY, 0.2);

  &:hover:not(:disabled) {
    background-color: lighten(colors.$BRAND-PRIMARY, 5%);
    transform: translateY(-1px);
    box-shadow: 0 6px 15px rgba(colors.$BRAND-PRIMARY, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.btn-cancel {
  background: transparent;
  border: 1px solid colors.$border-light;
  color: colors.$text-light;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: colors.$background-light;
    color: colors.$text-dark;
  }
}

.spinner {
  width: 35px;
  height: 35px;
  border: 3px solid colors.$gray-200;
  border-top-color: colors.$BRAND-PRIMARY;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
