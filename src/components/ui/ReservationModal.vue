<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import PaymentezForm from './PaymentezForm.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  eventName: {
    type: String,
    default: ''
  },
  guestCount: {
    type: Number,
    default: 1
  },
  initialMode: {
    type: String,
    default: 'whatsapp' // 'whatsapp' or 'paymentez'
  }
});

const emit = defineEmits(['close']);

const currentMode = ref(props.initialMode);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    currentMode.value = props.initialMode;
    paymentSuccess.value = false;
  }
});

const paymentSuccess = ref(false);
const cardInfo = ref(null);

const whatsappUrl = computed(() => {
  const peopleText = props.guestCount > 1 ? ` para ${props.guestCount} personas` : ' para 1 persona';
  const text = `Hola, deseo reservar${peopleText} para el evento${props.eventName ? `: ${props.eventName}` : ''}.`;
  return `https://wa.me/593979279877?text=${encodeURIComponent(text)}`;
});

const handlePaymentSuccess = (response: any) => {
  paymentSuccess.value = true;
  cardInfo.value = response;
  // Here we would typically call our backend to complete the charge
  console.log('Payment token received:', response.token);
};

const close = () => {
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-backdrop" @click="close">
        <div class="modal-container" :class="{ 'modal-container--large': currentMode === 'paymentez' && !paymentSuccess }" @click.stop>
          <button class="btn-close" @click="close" aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="modal-content">
            <!-- Success State -->
            <div v-if="paymentSuccess" class="state-view state-success">
              <div class="icon-wrapper icon-wrapper--success">
                <i class="fa-solid fa-check"></i>
              </div>
              <h2 class="modal-title">¡Reserva Exitosa!</h2>
              <p>Hemos recibido tu pago correctamente. Pronto recibirás un correo con los detalles de tu reserva para <strong>{{ eventName }}</strong>.</p>
              <button class="btn-primary" @click="close">Cerrar</button>
            </div>

            <!-- WhatsApp Mode -->
            <div v-else-if="currentMode === 'whatsapp'" class="state-view">
              <div class="icon-wrapper icon-wrapper--whatsapp">
                <i class="fa-brands fa-whatsapp"></i>
              </div>
              
              <h2 class="modal-title">Reserva Exclusiva</h2>
              
              <div class="modal-body">
                <p>Gestionaremos tu reserva personalmente a través de nuestro canal oficial de WhatsApp.</p>
                <p class="highlight">Garantiza tu asistencia de forma rápida y directa.</p>
              </div>
              
              <a :href="whatsappUrl" target="_blank" class="btn-whatsapp-action" @click="close">
                <span>Continuar a WhatsApp</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>

              <button class="btn-switch-mode" @click="currentMode = 'paymentez'">
                O pagar con tarjeta de crédito
              </button>
            </div>

            <!-- Paymentez Mode -->
            <div v-else-if="currentMode === 'paymentez'" class="state-view">
              <div class="icon-wrapper icon-wrapper--card">
                <i class="fa-solid fa-credit-card"></i>
              </div>
              
              <h2 class="modal-title">Pago con Tarjeta</h2>
              <p class="modal-subtitle">Introduce los datos de tu tarjeta para completar la reserva de <strong>{{ guestCount }} personas</strong>.</p>
              
              <div class="modal-body modal-body--form">
                <PaymentezForm 
                  user-id="user_123" 
                  user-email="cliente@example.com"
                  @success="handlePaymentSuccess"
                  @cancel="currentMode = 'whatsapp'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background-color: colors.$white;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(colors.$BRAND-PRIMARY, 0.1);
  transition: max-width 0.3s ease;

  &--large {
    max-width: 550px;
  }
}

.btn-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: colors.$text-light;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 10;

  &:hover {
    color: colors.$BRAND-PRIMARY;
  }
}

.modal-content {
  padding: 2.5rem 2rem;
  text-align: center;
}

.state-view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;

  &--whatsapp {
    background-color: #25D366;
    color: white;
    box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
  }

  &--card {
    background-color: colors.$BRAND-PRIMARY;
    color: white;
    box-shadow: 0 10px 20px rgba(colors.$BRAND-PRIMARY, 0.2);
  }

  &--success {
    background-color: #4CAF50;
    color: white;
    box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
  }
}

.modal-title {
  font-family: 'Playfair Display', serif;
  color: colors.$BRAND-PRIMARY;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  color: colors.$text-light;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.modal-body {
  color: colors.$text-dark;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;

  p {
    margin-bottom: 0.8rem;
  }

  .highlight {
    font-weight: 600;
  }

  &--form {
    width: 100%;
    margin-bottom: 0;
  }
}

.btn-whatsapp-action {
  background-color: #25D366;
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  margin-bottom: 1.5rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
    background-color: #1faf53;
  }
}

.btn-switch-mode {
  background: none;
  border: none;
  color: colors.$BRAND-PRIMARY;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
}

.btn-primary {
  background-color: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: modal-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-leave-active .modal-container {
  animation: modal-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}

@keyframes modal-slide-in {
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
