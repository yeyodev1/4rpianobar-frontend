```
<script setup lang="ts">
import { ref, computed, watch, onMounted, type PropType } from 'vue';
import PaymentezCheckoutForm from './PaymentezCheckoutForm.vue';
import PaymentTicket from '../payment/PaymentTicket.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  eventName: {
    type: String,
    default: ''
  },
  eventDate: {
    type: String,
    default: ''
  },
  eventTime: {
    type: String,
    default: ''
  },
  guestCount: {
    type: Number,
    default: 1
  },
  initialMode: {
    type: String as PropType<'whatsapp' | 'paymentez' | 'help'>,
    default: 'whatsapp'
  }, // 'whatsapp' or 'paymentez' or 'help'
  eventPrice: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close']);

const currentMode = ref(props.initialMode);
const paymentSuccess = ref(false);
const transactionData = ref<any>(null);
const showExitConfirm = ref(false);

const totalAmount = computed(() => props.eventPrice * props.guestCount);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    currentMode.value = props.initialMode;
    paymentSuccess.value = false;
    showExitConfirm.value = false;
  }
});

const whatsappUrl = computed(() => {
  const peopleText = props.guestCount > 1 ? ` para ${props.guestCount} personas` : ' para 1 persona';
  const text = `Hola, deseo reservar${peopleText} para el evento${props.eventName ? `: ${props.eventName}` : ''}.`;
  return `https://wa.me/593979279877?text=${encodeURIComponent(text)}`;
});

const handlePaymentSuccess = (transaction: any) => {
  paymentSuccess.value = true;
  transactionData.value = transaction;

  // Persistence: Save to localStorage so it's not lost on refresh
  try {
    const storageKey = `reservation_${props.eventName.replace(/\s+/g, '_')}`;
    localStorage.setItem(storageKey, JSON.stringify({
      transaction,
      eventName: props.eventName,
      eventDate: props.eventDate,
      eventTime: props.eventTime,
      guestCount: props.guestCount,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.warn('Could not save reservation to local storage', e);
  }
};

const temporarilyHidden = ref(false);

const handleRequestHide = () => {
  temporarilyHidden.value = true;
};

const handleRequestShow = () => {
  temporarilyHidden.value = false;
};

const close = () => {
  // If payment is already a success, close without warning
  if (paymentSuccess.value) {
    emit('close');
    return;
  }

  // If we are in WhatsApp mode and haven't started anything complex, just close
  // But if we are in Paymentez mode, warn them
  if (currentMode.value === 'paymentez') {
    showExitConfirm.value = true;
  } else {
    emit('close');
  }
};

const confirmClose = () => {
  showExitConfirm.value = false;
  emit('close');
};

// Auto-check for existing reservation on mount
onMounted(() => {
  const storageKey = `reservation_${props.eventName.replace(/\s+/g, '_')}`;
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      // Only restore if it's the same event (extra safety)
      if (data.eventName === props.eventName) {
        transactionData.value = data.transaction;
        paymentSuccess.value = true;
      }
    } catch (e) {
      localStorage.removeItem(storageKey);
    }
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" v-show="!temporarilyHidden" class="modal-backdrop" @click="close">
        <div class="modal-container" :class="{ 'modal-container--large': currentMode === 'paymentez' && !paymentSuccess, 'modal-container--ticket': paymentSuccess }" @click.stop>
          <button class="btn-close" @click="close" aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="modal-content">
            <!-- Success State: Virtual Ticket -->
            <PaymentTicket 
              v-if="paymentSuccess && transactionData"
              :transaction="transactionData"
              :event-name="eventName"
              :guest-count="guestCount"
              :event-date="eventDate"
              :event-time="eventTime"
              show-success-header
              @close="close"
            />

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

            <!-- Mode: Paymentez -->
            <div v-else-if="currentMode === 'paymentez' || currentMode === 'help'" class="modal-paymentez">
              <div class="modal-icon">
                <i v-if="currentMode === 'paymentez'" class="fa-solid fa-credit-card"></i>
                <i v-else class="fa-solid fa-circle-question"></i>
              </div>
              
              <h2 class="modal-title">{{ currentMode === 'paymentez' ? 'Finalizar Reserva' : 'Ayuda con Reservas' }}</h2>
              
              <div class="purchase-summary" v-if="currentMode === 'paymentez'">
                <p class="summary-item">
                  <span>Evento:</span>
                  <strong>{{ eventName }}</strong>
                </p>
                <p class="summary-item">
                  <span>Asistentes:</span>
                  <strong>{{ guestCount }} personas</strong>
                </p>
                <p class="summary-total">
                  <span>Total a pagar:</span>
                  <strong>${{ totalAmount }}</strong>
                </p>
              </div>
              
              <p class="modal-subtitle">
                {{ currentMode === 'paymentez'
                  ? 'Selecciona o introduce los datos de tu tarjeta para completar la compra.'
                  : 'Verifica tu cuenta para gestionar tus tarjetas y transacciones.'
                }}
              </p>
              
              <div class="modal-body modal-body--form">
                <PaymentezCheckoutForm 
                  :user-id="transactionData?.userId || 'u_' + Date.now()" 
                  :user-email="transactionData?.email || ''"
                  :amount="totalAmount"
                  :guest-count="guestCount"
                  :description="'Reserva para: ' + eventName"
                  @success="handlePaymentSuccess"
                  @cancel="currentMode = 'whatsapp'"
                  @request-hide-modal="handleRequestHide"
                  @request-show-modal="handleRequestShow"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Exit Confirmation Modal (Nested Teleport) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showExitConfirm" class="exit-modal-backdrop" @click="showExitConfirm = false">
          <div class="exit-modal-container" @click.stop>
            <div class="exit-icon">
              <i class="fa-solid fa-person-running"></i>
            </div>
            <h3>¿Seguro que quieres salir?</h3>
            <p>Si cierras ahora, perderás el progreso de tu reserva para <strong>{{ eventName }}</strong>.</p>
            
            <div class="exit-actions">
              <button @click="showExitConfirm = false" class="btn-stay">
                Continuar con la Reserva
              </button>
              <button @click="confirmClose" class="btn-exit">
                Sí, salir de todos modos
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background-color: #fcfcfc;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(colors.$BRAND-PRIMARY, 0.1);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  margin-top: auto;
  margin-bottom: auto;

  &--large {
    max-width: 550px;
  }

  &--ticket {
    max-width: 480px;
    background-color: #f8f9fa;
  }
}

.btn-close {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 1.2rem;
  color: colors.$text-light;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    color: colors.$BRAND-PRIMARY;
    transform: rotate(90deg);
  }
}

.modal-content {
  padding: 2.5rem 1.5rem;
  overflow-y: auto;
  flex: 1;
}

/* Success / Ticket Styles */
.ticket-view {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ticket-header {
  margin-bottom: 2rem;

  .icon-success-wrapper {
    width: 60px;
    height: 60px;
    background-color: #4CAF50;
    color: white;
    border-radius: 50%;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
  }

  .ticket-status-title {
    font-family: 'Playfair Display', serif;
    color: colors.$BRAND-PRIMARY;
    font-size: 1.8rem;
    margin-bottom: 0.3rem;
  }

  .ticket-status-subtitle {
    color: colors.$text-light;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
}

.capture-reminder {
  background-color: rgba(colors.$BRAND-PRIMARY, 0.08);
  border: 1px dashed colors.$BRAND-PRIMARY;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  margin-top: 1rem;

  i {
    font-size: 1.5rem;
    color: colors.$BRAND-PRIMARY;
  }

  span {
    font-size: 0.85rem;
    color: colors.$text-dark;
    line-height: 1.4;

    strong {
      color: colors.$BRAND-PRIMARY;
    }
  }
}

.virtual-ticket {
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #eee;
  margin-bottom: 2rem;
  text-align: left;
  position: relative;

  .ticket-top {
    background-color: colors.$BRAND-PRIMARY;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    .ticket-brand {
      font-weight: 800;
      letter-spacing: 2px;
      font-size: 0.8rem;
    }

    .ticket-type {
      font-size: 0.7rem;
      opacity: 0.8;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 2px 8px;
      border-radius: 4px;
    }
  }

  .ticket-body {
    padding: 1.5rem;
  }

  .event-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: colors.$text-dark;
    margin-bottom: 0.8rem;
    line-height: 1.2;
  }

  .event-datetime {
    display: flex;
    gap: 1.5rem;
    color: colors.$text-light;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;

    span {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
  }

  .ticket-details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
    margin-bottom: 1.5rem;

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;

      label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: colors.$text-light;
        letter-spacing: 0.5px;
      }

      span {
        font-weight: 600;
        color: colors.$text-dark;
        font-size: 1rem;
      }

      .price-value {
        color: colors.$BRAND-PRIMARY;
        font-size: 1.1rem;
      }

      .status-badge {
        display: inline-block;
        background: #e8f5e9;
        color: #2e7d32;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        width: fit-content;
      }
    }
  }

  .ticket-divider {
    display: flex;
    align-items: center;
    margin: 1.5rem -1.5rem;
    position: relative;

    .line {
      flex: 1;
      height: 1px;
      border-top: 2px dashed #eee;
    }

    .dot {
      width: 20px;
      height: 20px;
      background: #f8f9fa;
      border-radius: 50%;
      position: absolute;
      border: 1px solid #eee;

      &.left {
        left: -11px;
      }

      &.right {
        right: -11px;
      }
    }
  }

  .ticket-footer-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;

    .footer-item {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;

      label {
        color: colors.$text-light;
      }

      code {
        background: #f1f1f1;
        padding: 2px 6px;
        border-radius: 4px;
        color: #555;
        font-family: monospace;
      }
    }
  }

  .ticket-instructions {
    background: #fff8e1;
    padding: 0.8rem 1.5rem;
    font-size: 0.8rem;
    color: #856404;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    border-top: 1px solid #ffecb3;
  }
}

.ticket-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .btn-whatsapp-ticket {
    background-color: #25D366;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 50px;
    font-weight: bold;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    cursor: pointer;
    box-shadow: 0 8px 15px rgba(37, 211, 102, 0.3);
    transition: all 0.3s;

    &:hover {
      background-color: #1faf53;
      transform: translateY(-2px);
      box-shadow: 0 12px 20px rgba(37, 211, 102, 0.4);
    }
  }

  .secondary-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .btn-save {
    background: white;
    border: 1px solid colors.$border-light;
    padding: 0.8rem;
    border-radius: 12px;
    color: colors.$text-dark;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #f0f0f0;
    }
  }

  .btn-finish {
    background: #333;
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #000;
    }
  }
}

/* Original Styles Restored/Adjusted */
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
}

.modal-title {
  font-family: 'Playfair Display', serif;
  color: colors.$BRAND-PRIMARY;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.purchase-summary {
  background: colors.$background-light;
  border-radius: 12px;
  padding: 1.2rem;
  width: 100%;
  margin-bottom: 1.5rem;
  text-align: left;
  border-left: 4px solid colors.$BRAND-PRIMARY;

  .summary-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: colors.$text-light;
    margin-bottom: 0.4rem;

    strong {
      color: colors.$text-dark;
    }
  }

  .summary-total {
    display: flex;
    justify-content: space-between;
    font-size: 1.1rem;
    margin-top: 0.8rem;
    padding-top: 0.8rem;
    border-top: 1px dashed colors.$border-light;
    color: colors.$text-dark;

    strong {
      color: colors.$BRAND-PRIMARY;
      font-size: 1.3rem;
    }
  }
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
  animation: modal-slide-in 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.modal-fade-leave-active .modal-container {
  animation: modal-slide-in 0.3s ease reverse;
}

@keyframes modal-slide-in {
  from {
    transform: translateY(30px) scale(0.95);
    opacity: 0;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Print Overrides */
@media print {
  .modal-backdrop {
    background: white;
    position: relative;
    padding: 0;
    backdrop-filter: none;
  }

  .modal-container {
    box-shadow: none;
    border: none;
    max-width: 100%;
  }

  .btn-close,
  .ticket-actions,
  .ticket-header {
    display: none !important;
  }

  .virtual-ticket {
    box-shadow: none;
    margin: 0;
  }
}

/* Exit Confirmation Styles */
.exit-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1.5rem;
}

.exit-modal-container {
  background: white;
  width: 100%;
  max-width: 400px;
  padding: 3rem 2rem;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);

  .exit-icon {
    width: 70px;
    height: 70px;
    background: rgba(colors.$BRAND-PRIMARY, 0.1);
    color: colors.$BRAND-PRIMARY;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2rem;
    margin: 0 auto 1.5rem;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem;
    color: colors.$text-dark;
    margin-bottom: 1rem;
  }

  p {
    color: colors.$text-light;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    font-size: 1rem;

    strong {
      color: colors.$text-dark;
    }
  }
}

.exit-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-stay {
  background: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1.1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(colors.$BRAND-PRIMARY, 0.2);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(colors.$BRAND-PRIMARY, 0.3);
  }
}

.btn-exit {
  background: none;
  border: 1px solid colors.$border-light;
  color: colors.$text-light;
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: colors.$background-light;
    color: colors.$error;
    border-color: colors.$error;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
