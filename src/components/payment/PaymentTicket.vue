<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  },
  eventName: {
    type: String,
    default: ''
  },
  guestCount: {
    type: [Number, String],
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
  showSuccessHeader: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const displayEventName = computed(() => {
  if (props.eventName) return props.eventName;
  const desc = props.transaction.description || '';
  const match = desc.match(/Reserva para:\s*(.*?)\s*\(Entradas:/);
  return match ? match[1] : (desc || 'Evento 4R Piano Bar');
});

const displayGuestCount = computed(() => {
  if (props.guestCount) return props.guestCount;
  const desc = props.transaction.description || '';
  const match = desc.match(/\(Entradas:\s*(\d+)\)/);
  return match ? match[1] : '1';
});

const displayDate = computed(() => {
  if (props.eventDate) return props.eventDate;
  if (props.transaction.payment_date) {
    return new Date(props.transaction.payment_date).toLocaleDateString();
  }
  return 'N/A';
});

const saveTicket = () => {
  const originalTitle = document.title;
  document.title = `Ticket_Reserva_${displayEventName.value.replace(/\s+/g, '_')}`;
  window.print();
  document.title = originalTitle;
};

const shareTicketWhatsApp = () => {
  const t = props.transaction;
  const message = `*TICKET DE RESERVA - 4R PIANO BAR*\n\n` +
    `*Evento:* ${displayEventName.value}\n` +
    `*Fecha:* ${displayDate.value}\n` +
    `*Hora:* ${props.eventTime || 'N/A'}\n` +
    `*Cliente:* ${t.name || 'N/A'}\n` +
    `*Asistentes:* ${displayGuestCount.value} persona(s)\n` +
    `*Total Pagado:* $${t.amount} ${t.currency}\n` +
    `---------------------------\n` +
    `*Ref. Pago:* ${t.gateway_transaction_id}\n` +
    `*Cod. Autorización:* ${t.authorization_code}\n\n` +
    `_Favor presentar este mensaje en la puerta._`;

  const url = `https://wa.me/593979279877?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
</script>

<template>
  <div class="ticket-view">
    <div v-if="showSuccessHeader" class="ticket-header">
      <div class="icon-success-wrapper">
        <i class="fa-solid fa-check"></i>
      </div>
      <h2 class="ticket-status-title">¡Reserva Confirmada!</h2>
      <p class="ticket-status-subtitle">Tu pago ha sido procesado exitosamente</p>
      
      <div class="capture-reminder">
        <i class="fa-solid fa-camera"></i>
        <span><strong>Recomendación:</strong> Toma una captura de pantalla o descarga el ticket ahora.</span>
      </div>
    </div>

    <div class="virtual-ticket" id="reservation-ticket">
      <div class="ticket-top">
        <div class="ticket-brand">4R PIANO BAR</div>
        <div class="ticket-type">TICKET DE ACCESO</div>
      </div>
      
      <div class="ticket-body">
        <div class="ticket-main-info">
          <h3 class="event-name">{{ displayEventName }}</h3>
          <div class="event-datetime">
            <span><i class="fa-regular fa-calendar"></i> {{ displayDate }}</span>
            <span v-if="eventTime"><i class="fa-regular fa-clock"></i> {{ eventTime }}</span>
          </div>
        </div>

        <div class="ticket-details-grid">
          <div class="detail-item">
            <label>Cliente</label>
            <span>{{ transaction.name || 'Cliente' }}</span>
          </div>
          <div class="detail-item">
            <label>Personas</label>
            <span>{{ displayGuestCount }}</span>
          </div>
          <div class="detail-item">
            <label>Total Pagado</label>
            <span class="price-value">${{ transaction.amount }} {{ transaction.currency }}</span>
          </div>
          <div class="detail-item">
            <label>Estado</label>
            <div class="status-container">
              <span class="status-badge" :class="transaction.status">
                {{ transaction.status === 'success' ? 'PAGADO' : transaction.status }}
              </span>
              <span v-if="transaction.refunds && transaction.refunds.length > 0" class="refund-badge">
                REEMBOLSADO
              </span>
            </div>
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
            <code>{{ transaction.gateway_transaction_id }}</code>
          </div>
          <div class="footer-item">
            <label>Cod. Autorización</label>
            <code>{{ transaction.authorization_code || 'N/A' }}</code>
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
        <button @click="$emit('close')" class="btn-action btn-finish">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.ticket-view {
  animation: fadeIn 0.5s ease-out;
  width: 100%;
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
  text-align: center;

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

        &.refunded {
          background: #fff3e0;
          color: #ef6c00;
        }
      }

      .status-container {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }

      .refund-badge {
        display: inline-block;
        background: rgba(colors.$error, 0.1);
        color: colors.$error;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.65rem;
        font-weight: 800;
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

@media print {

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
