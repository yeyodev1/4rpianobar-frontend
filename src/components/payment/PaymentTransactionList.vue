<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import paymentAPI from '@/services/payment';
import PaymentTicket from './PaymentTicket.vue';

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  verificationCode: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['error']);

const transactions = ref<any[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const fetchTransactions = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    const response = await paymentAPI.listUserTransactions(props.userId, props.email, props.verificationCode);
    transactions.value = response.transactions || [];
  } catch (err: any) {
    console.error('Error fetching transactions:', err);
    const msg = err.response?.data?.message || err.message || 'No se pudieron cargar tus transacciones.';

    // Fatal verification error: bubble up instead of showing local error
    if (msg.toLowerCase().includes('verification code')) {
      emit('error', msg);
      return;
    }

    errorMessage.value = msg;
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.verificationCode, () => {
  errorMessage.value = '';
  fetchTransactions();
});

const selectedTransaction = ref<any>(null);
const showTicketModal = ref(false);

const openTicket = (tx: any) => {
  selectedTransaction.value = tx;
  showTicketModal.value = true;
};

const retryVerification = () => {
  emit('error', errorMessage.value);
};

onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="transaction-list">
    <div v-if="isLoading" class="loader">
      <div class="spinner"></div>
      <p>Actualizando historial...</p>
    </div>

    <div v-else-if="errorMessage" class="error-container">
      <div class="error-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <p>{{ errorMessage }}</p>
      <button @click="retryVerification" class="btn-primary-mini">
        Verificar de nuevo
      </button>
    </div>

    <div v-else-if="transactions.length > 0" class="transactions-container">
      <h3>Historial de Pagos ({{ transactions.length }})</h3>
      
      <div class="table-responsive elegant-scroll">
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactions" :key="tx._id">
              <td class="date-cell">
                {{ new Date(tx.payment_date).toLocaleDateString() }}
              </td>
              <td class="desc-cell">
                <span class="desc-text">{{ tx.description }}</span>
                <div class="meta-info">
                  <span class="tx-id">Ref: {{ tx.gateway_transaction_id }}</span>
                  <span class="card-info" v-if="tx.card_token">
                     • Tarjeta ****
                  </span>
                </div>
              </td>
              <td class="amount-cell">
                ${{ tx.amount }}
              </td>
              <td class="status-cell">
                <span class="tx-status" :class="tx.status">{{ tx.status }}</span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button 
                    v-if="tx.status === 'success'" 
                    @click="openTicket(tx)" 
                    class="btn-ticket-mini"
                    title="Ver Ticket"
                  >
                    <i class="fa-solid fa-ticket"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="no-transactions">
      <p>No tienes transacciones registradas.</p>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showTicketModal" class="ticket-modal-backdrop" @click="showTicketModal = false">
          <div class="ticket-modal-container" @click.stop>
            <button class="modal-close-btn" @click="showTicketModal = false">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <PaymentTicket 
              v-if="selectedTransaction"
              :transaction="selectedTransaction"
              @close="showTicketModal = false"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.transaction-list {
  width: 100%;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  background: rgba(colors.$error, 0.03);
  border-radius: 16px;
  border: 1px dashed colors.$error;
  gap: 0.8rem;
  margin-bottom: 1rem;

  .error-icon {
    font-size: 2.5rem;
    color: colors.$error;
    opacity: 0.8;
  }

  p {
    font-size: 0.9rem;
    color: colors.$text-light;
    line-height: 1.4;
    max-width: 250px;
  }
}

.btn-primary-mini {
  background: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: colors.$text-dark;
    transform: translateY(-1px);
  }
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 1rem;
  color: colors.$text-light;

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: colors.$BRAND-PRIMARY;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.transactions-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: colors.$text-dark;
  }
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  border: 1px solid colors.$border-light;
  border-radius: 12px;
  background: white;
  margin-top: 0.5rem;
  min-height: 150px;
  /* Ensure visibility */
  max-height: 400px;
  /* Limit height to force scroll */
  overflow-y: auto;

  /* Custom scrollbar */
  &.elegant-scroll {
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.02);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(colors.$BRAND-PRIMARY, 0.4);
      border-radius: 10px;
      transition: background 0.2s;

      &:hover {
        background: rgba(colors.$BRAND-PRIMARY, 0.7);
      }
    }
  }
}

.transactions-table {
  width: 100%;
  border-collapse: separate;
  /* Changed for sticky header support if needed later */
  border-spacing: 0;
  min-width: 600px;
  font-size: 0.85rem;

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid colors.$border-light;
  }

  /* Sticky Header */
  thead th {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fdfdfd;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  th {
    background: rgba(colors.$BRAND-PRIMARY, 0.05);
    color: colors.$BRAND-PRIMARY;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.5px;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: rgba(colors.$background-light, 0.3);
  }
}

.date-cell {
  color: colors.$text-light;
  white-space: nowrap;
}

.desc-cell {
  min-width: 250px;

  .desc-text {
    display: block;
    font-weight: 600;
    color: colors.$text-dark;
    line-height: 1.2;
    margin-bottom: 2px;
  }

  .meta-info {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.65rem;
    color: colors.$text-light;

    .tx-id {
      font-family: monospace;
    }
  }
}

.amount-cell {
  font-weight: 700;
  color: colors.$BRAND-PRIMARY;
  white-space: nowrap;
}

.status-cell {
  min-width: 100px;
}

.tx-status {
  display: inline-block;
  text-transform: uppercase;
  font-weight: 800;
  font-size: 0.6rem;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;

  &.success {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &.pending {
    background: #fff3e0;
    color: #ef6c00;
  }

  &.failure {
    background: #ffebee;
    color: #c62828;
  }
}

.actions-cell {
  text-align: center;
}

.btn-ticket-mini {
  background: white;
  border: 1px solid colors.$border-light;
  color: colors.$BRAND-PRIMARY;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: colors.$BRAND-PRIMARY;
    color: white;
    border-color: colors.$BRAND-PRIMARY;
    transform: scale(1.1);
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Ticket Modal Styles */
.ticket-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.ticket-modal-container {
  background: #f8f9fa;
  width: 100%;
  max-width: 480px;
  padding: 2.5rem 1.5rem;
  border-radius: 24px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: colors.$text-light;
  z-index: 11;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    color: colors.$BRAND-PRIMARY;
    transform: rotate(90deg);
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
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

.no-transactions {
  text-align: center;
  padding: 3rem 1.5rem;
  color: colors.$text-light;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px dashed colors.$border-light;
}
</style>
