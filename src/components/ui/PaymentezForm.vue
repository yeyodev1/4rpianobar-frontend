<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import paymentezService from '@/services/paymentez';

const props = defineProps({
  userEmail: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['success', 'error', 'cancel']);

const isLoading = ref(true);
const isProcessing = ref(false);
const errorMessage = ref('');
const gateway = ref<any>(null);

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

const handleResponse = (response: any) => {
  isProcessing.value = false;
  if (response.card && response.card.status === 'valid') {
    emit('success', response.card);
  } else if (response.error) {
    errorMessage.value = response.error.type || 'Error en la tokenización';
    emit('error', response.error);
  }
};

const handleIncompleteForm = (message: string) => {
  isProcessing.value = false;
  errorMessage.value = 'Por favor, completa todos los campos requeridos.';
};

const handleTokenize = () => {
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

    <div v-show="!isLoading" id="paymentez-container" class="paymentez-container"></div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="form-actions" v-if="!isLoading">
      <button 
        @click="handleTokenize" 
        class="btn-submit" 
        :disabled="isProcessing"
      >
        <span v-if="isProcessing">Procesando...</span>
        <span v-else>Confirmar y Pagar</span>
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
  gap: 1.5rem;
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

.paymentez-container {
  min-height: 200px;
  width: 100%;

  /* Overriding potential internal SDK styles if necessary */
  :deep(.paymentez-input) {
    border-radius: 4px;
    border: 1px solid colors.$border-light;
  }
}

.error-message {
  padding: 0.75rem;
  background-color: rgba(colors.$error, 0.1);
  color: colors.$error;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-submit {
  background-color: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background-color: lighten(colors.$BRAND-PRIMARY, 10%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-cancel {
  background: transparent;
  border: 1px solid colors.$border-light;
  color: colors.$text-light;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: colors.$background-light;
    color: colors.$text-dark;
  }
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid colors.$gray-200;
  border-top-color: colors.$BRAND-PRIMARY;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
