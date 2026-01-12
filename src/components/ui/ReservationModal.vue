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
    type: String,
    default: 'whatsapp' // 'whatsapp' or 'paymentez'
  },
  eventPrice: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close']);

const currentMode = ref(props.initialMode);
const paymentSuccess = ref(false);
const transactionData = ref<any>(null);

const totalAmount = computed(() => props.eventPrice * props.guestCount);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    currentMode.value = props.initialMode;
    paymentSuccess.value = false;
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

const close = () => {
  emit('close');
};

const saveTicket = () => {
  const originalTitle = document.title;
  document.title = `Ticket_Reserva_${props.eventName.replace(/\s+/g, '_')}`;
  window.print();
  document.title = originalTitle;
};

const shareTicketWhatsApp = () => {
  if (!transactionData.value) return;

  const t = transactionData.value;
  const message = `*TICKET DE RESERVA - 4R PIANO BAR*\n\n` +
    `*Evento:* ${props.eventName}\n` +
    `*Fecha:* ${props.eventDate || 'N/A'}\n` +
    `*Hora:* ${props.eventTime || 'N/A'}\n` +
    `*Cliente:* ${t.name || 'N/A'}\n` +
    `*Asistentes:* ${props.guestCount} persona(s)\n` +
    `*Total Pagado:* $${t.amount} ${t.currency}\n` +
    `---------------------------\n` +
    `*Ref. Pago:* ${t.gateway_transaction_id}\n` +
    `*Cod. Autorización:* ${t.authorization_code}\n\n` +
    `_Favor presentar este mensaje en la puerta._`;

  const url = `https://wa.me/593979279877?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
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
      <div v-if="isOpen" class="modal-backdrop" @click="close">
        <div class="modal-container" :class="{ 'modal-container--large': currentMode === 'paymentez' && !paymentSuccess, 'modal-container--ticket': paymentSuccess }" @click.stop>
          <button class="btn-close" @click="close" aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="modal-content">
            <!-- Success State: Virtual Ticket -->
            <div v-if="paymentSuccess && transactionData" class="ticket-view">
              <div class="ticket-header">
                <div class="icon-success-wrapper">
                  <i class="fa-solid fa-check"></i>
                </div>
                <h2 class="ticket-status-title">¡Reserva Confirmada!</h2>
                <p class="ticket-status-subtitle">Tu pago ha sido procesado exitosamente</p>
                
                <!-- Reminder Alert -->
                <div class="capture-reminder">
                  <i class="fa-solid fa-camera"></i>
                  <span><strong>Recomendación:</strong> Toma una captura de pantalla o descarga el ticket ahora. Por seguridad, no guardamos sesiones persistentes.</span>
                </div>
              </div>

              <div class="virtual-ticket" id="reservation-ticket">
                <div class="ticket-top">
                  <div class="ticket-brand">4R PIANO BAR</div>
                  <div class="ticket-type">TICKET DE ACCESO</div>
                </div>
                
                <div class="ticket-body">
                  <div class="ticket-main-info">
                    <h3 class="event-name">{{ eventName }}</h3>
                    <div class="event-datetime">
                      <span><i class="fa-regular fa-calendar"></i> {{ eventDate || 'Fecha por confirmar' }}</span>
                      <span><i class="fa-regular fa-clock"></i> {{ eventTime || 'Hora por confirmar' }}</span>
                    </div>
                  </div>

                  <div class="ticket-details-grid">
                    <div class="detail-item">
                      <label>Cliente</label>
                      <span>{{ transactionData.name }}</span>
                    </div>
                    <div class="detail-item">
                      <label>Personas</label>
                      <span>{{ guestCount }}</span>
                    </div>
                    <div class="detail-item">
                      <label>Total Pagado</label>
                      <span class="price-value">${{ transactionData.amount }} {{ transactionData.currency }}</span>
                    </div>
                    <div class="detail-item">
                      <label>Estado</label>
                      <span class="status-badge">PAGADO</span>
                    </div>
                  </div>

                  <div class="ticket-divider">
                    <div class="dot left"></div>
                    <div class="line"></div>
                    <div class="dot right"></div>
                  </div>

                  <div class="ticket-footer-info">
                    <div class="footer-item">
                      <label>Ref. de Pago</label>
                      <code>{{ transactionData.gateway_transaction_id }}</code>
                    </div>
                    <div class="footer-item">
                      <label>Cod. Autorización</label>
                      <code>{{ transactionData.authorization_code }}</code>
                    </div>
                  </div>
                </div>
                
                <div class="ticket-instructions">
                  <i class="fa-solid fa-circle-info"></i>
                  Presenta este ticket digital en la puerta el día del evento.
                </div>
              </div>

              <div class="ticket-actions">
                <button @click="shareTicketWhatsApp" class="btn-action btn-whatsapp-ticket">
                  <i class="fa-brands fa-whatsapp"></i>
                  Enviar a WhatsApp
                </button>
                <div class="secondary-actions">
                  <button @click="saveTicket" class="btn-action btn-save">
                    <i class="fa-solid fa-download"></i>
                    Guardar Detalles
                  </button>
                  <button @click="close" class="btn-action btn-finish">
                    Finalizar
                  </button>
                </div>
              </div>
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
                  :user-id="transactionData?.userId || 'u_' + Date.now()" 
                  :user-email="transactionData?.email || 'cliente@example.com'"
                  :amount="totalAmount"
                  :guest-count="guestCount"
                  :description="'Reserva para: ' + eventName"
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
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background-color: #fcfcfc;
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(colors.$BRAND-PRIMARY, 0.1);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);

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
</style>
