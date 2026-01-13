<script setup lang="ts">
import { ref, watch } from 'vue';
import paymentAPI from '@/services/payment';

const props = defineProps({
  email: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['verified', 'update:email', 'update:name']);

const step = ref(1); // 1: input, 2: verify
const internalEmail = ref(props.email);
const internalName = ref(props.name);
const code = ref('');
const isLoading = ref(false);

const translateError = (msg: string) => {
  if (!msg) return '';
  const lowerMsg = msg.toLowerCase();
  if (lowerMsg.includes('invalid') || lowerMsg.includes('expired')) {
    if (lowerMsg.includes('verification') || lowerMsg.includes('code')) {
      return 'El código de verificación es inválido o ha expirado. Por favor, solicita uno nuevo para continuar.';
    }
  }
  return msg;
};

const errorMessage = ref(translateError(props.error));

watch(() => props.error, (newVal) => {
  errorMessage.value = translateError(newVal);
  if (errorMessage.value.includes('expirado') || errorMessage.value.includes('inválido')) {
    step.value = 1; // Return to email input to start over as requested
  }
});

// Clear error when user types
watch([internalEmail, internalName, code], () => {
  if (errorMessage.value) errorMessage.value = '';
});

const resolvedUserId = ref<string | null>(null);

const requestToken = async () => {
  if (!internalEmail.value) {
    errorMessage.value = 'El correo electrónico es requerido.';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';
    const response = await paymentAPI.requestVerification({
      email: internalEmail.value,
      name: internalName.value
    });
    resolvedUserId.value = response.userId;
    step.value = 2;
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Error al enviar el código.';
    errorMessage.value = translateError(msg);
  } finally {
    isLoading.value = false;
  }
};

const verifyCode = async () => {
  if (!code.value || code.value.length < 6) {
    errorMessage.value = 'Ingresa un código válido de 6 dígitos.';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';

    emit('update:email', internalEmail.value);
    emit('update:name', internalName.value);
    emit('verified', {
      email: internalEmail.value,
      code: code.value,
      userId: resolvedUserId.value
    });
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Error al verificar el código.';
    errorMessage.value = translateError(msg);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="verification-step">
    <!-- Step 1: Request Code -->
    <div v-if="step === 1" class="step-content">
      <div class="input-group">
        <label>Correo Electrónico</label>
        <input 
          v-model="internalEmail" 
          type="email" 
          placeholder="ejemplo@correo.com"
          :disabled="isLoading"
          class="form-input"
        />
      </div>
      
      <div class="input-group">
        <label>Nombre Completo</label>
        <input 
          v-model="internalName" 
          type="text" 
          placeholder="Tu nombre"
          :disabled="isLoading"
          class="form-input"
        />
      </div>

      <Transition name="fade">
        <div v-if="errorMessage" class="error-message">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>
      </Transition>

      <button @click="requestToken" class="btn-primary" :disabled="isLoading">
        <span v-if="isLoading">Enviando...</span>
        <span v-else>Recibir Código de Verificación</span>
      </button>
      
      <p class="verification-note">
        Te enviaremos un código de seguridad a tu correo para proceder con el pago de forma segura.
      </p>
    </div>

    <!-- Step 2: Enter Code -->
    <div v-else class="step-content">
      <h3>Verifica tu Identidad</h3>
      <p>Hemos enviado un código de 6 dígitos a <strong>{{ internalEmail }}</strong></p>
      
      <div class="input-group">
        <input 
          v-model="code" 
          type="text" 
          placeholder="000000"
          maxlength="6"
          :disabled="isLoading"
          class="form-input code-input"
        />
      </div>

      <Transition name="fade">
        <div v-if="errorMessage" class="error-message">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>
      </Transition>

      <button @click="verifyCode" class="btn-primary" :disabled="isLoading">
        Continuar al Pago
      </button>
      
      <button @click="step = 1" class="btn-link" :disabled="isLoading">
        Cambiar correo
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.verification-step {
  padding: 1rem 0;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  text-align: center;

  h3 {
    font-family: 'Playfair Display', serif;
    color: colors.$BRAND-PRIMARY;
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.9rem;
    color: colors.$text-light;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: colors.$text-dark;
  }
}

.form-input {
  padding: 0.8rem 1rem;
  border: 1px solid colors.$border-light;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  color: #000;

  &:focus {
    outline: none;
    border-color: colors.$BRAND-PRIMARY;
  }

  &.code-input {
    text-align: center;
    font-size: 1.5rem;
    letter-spacing: 0.5rem;
    font-weight: bold;
  }
}

.btn-primary {
  background-color: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-link {
  background: none;
  border: none;
  color: colors.$text-light;
  text-decoration: underline;
  font-size: 0.85rem;
  cursor: pointer;
}

.error-message {
  color: colors.$error;
  font-size: 0.85rem;
  background: rgba(colors.$error, 0.08);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-left: 3px solid colors.$error;
  text-align: left;
  margin: 0.5rem 0;

  i {
    font-size: 1rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.verification-note {
  font-size: 0.75rem !important;
  opacity: 0.8;
}
</style>
