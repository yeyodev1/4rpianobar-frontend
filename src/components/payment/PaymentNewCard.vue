<script setup lang="ts">
import { ref, onMounted } from 'vue';
import paymentezService from '@/services/paymentez';

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['tokenized', 'cancel']);

const isLoading = ref(true);
const gateway = ref<any>(null);
const errorMessage = ref('');

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
        default_country: 'ECU',
        require_billing_address: false,
      },
    };

    gateway.value.generate_tokenize(
      tokenizeData,
      '#paymentez-container-inner',
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
  if (response.card && response.card.status === 'valid') {
    emit('tokenized', response.card.token);
  } else if (response.error) {
    errorMessage.value = response.error.type || 'Error en la tokenización';
  }
};

const handleIncompleteForm = () => {
  errorMessage.value = 'Por favor, completa todos los campos de la tarjeta.';
};

const tokenize = () => {
  if (gateway.value) {
    gateway.value.tokenize();
  }
};

onMounted(() => {
  initPaymentez();
});

defineExpose({ tokenize });
</script>

<template>
  <div class="new-card-step">
    <div v-if="isLoading" class="loader">
      <div class="spinner"></div>
      <p>Cargando pasarela...</p>
    </div>

    <div v-show="!isLoading">
      <div id="paymentez-container-inner" class="paymentez-inner"></div>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <button @click="$emit('cancel')" class="btn-link">
        Volver a mis tarjetas
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.new-card-step {
  width: 100%;
}

.paymentez-inner {
  min-height: 200px;
  margin-bottom: 1rem;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 1rem;
  color: colors.$text-light;
}

.btn-link {
  display: block;
  margin: 1rem auto;
  background: none;
  border: none;
  color: colors.$text-light;
  text-decoration: underline;
  font-size: 0.9rem;
  cursor: pointer;
}

.error-message {
  color: colors.$error;
  font-size: 0.85rem;
  background: rgba(colors.$error, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0,0,0,0.1);
  border-top-color: colors.$BRAND-PRIMARY;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
