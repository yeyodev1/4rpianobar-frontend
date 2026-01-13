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

const showRefundConfirm = ref(false);
const refundTargetTx = ref<{ id: string, amount: number } | null>(null);
const isRefunding = ref(false);

const selectedTransaction = ref<any>(null);
const showTicketModal = ref(false);

const openTicket = (tx: any) => {
  selectedTransaction.value = tx;
  showTicketModal.value = true;
};

const toast = ref<{ show: boolean, type: 'success' | 'error', message: string }>({
  show: false,
  type: 'success',
  message: ''
});

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, type, message };
  setTimeout(() => { toast.value.show = false; }, 4000);
};

const confirmRefund = (txId: string, amount: number) => {
  refundTargetTx.value = { id: txId, amount };
  showRefundConfirm.value = true;
};

const handleRefund = async () => {
  if (!refundTargetTx.value) return;

  try {
    isRefunding.value = true;
    await paymentAPI.refund(refundTargetTx.value.id, refundTargetTx.value.amount);
    showToast('¡Reembolso solicitado exitosamente!', 'success');
    showRefundConfirm.value = false;
    await fetchTransactions(); // Refresh
  } catch (err: any) {
    showToast(err.message || 'Error al procesar el reembolso.', 'error');
  } finally {
    isRefunding.value = false;
    refundTargetTx.value = null;
  }
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
      <h3>Historial de Pagos</h3>
      
      <div class="table-responsive">
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
                <span class="tx-id">Ref: {{ tx.gateway_transaction_id }}</span>
              </td>
              <td class="amount-cell">
                ${{ tx.amount }}
              </td>
              <td class="status-cell">
                <span class="tx-status" :class="tx.status">{{ tx.status }}</span>
                <div v-if="tx.refunds && tx.refunds.length > 0" class="refund-note">
                  Reembolso
                </div>
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
                  <button 
                    v-if="tx.status === 'success' && (!tx.refunds || tx.refunds.length === 0)" 
                    @click="confirmRefund(tx.gateway_transaction_id, tx.amount)" 
                    class="btn-refund-mini"
                    title="Solicitar Reembolso"
                  >
                    <i class="fa-solid fa-rotate-left"></i>
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

    <!-- Custom Refund Confirmation Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showRefundConfirm" class="refund-modal-backdrop" @click="showRefundConfirm = false">
          <div class="refund-modal-container" @click.stop>
            <div class="modal-decoration">
              <i class="fa-solid fa-circle-exclamation"></i>
            </div>
            <h3>¿Solicitar Reembolso?</h3>
            <p>Se procesará el reembolso de <strong>${{ refundTargetTx?.amount }}</strong> por la transacción con ID <code>{{ refundTargetTx?.id }}</code>.</p>
            
            <div class="modal-actions">
              <button @click="handleRefund" class="btn-confirm-refund" :disabled="isRefunding">
                <span v-if="!isRefunding">Sí, procesar reembolso</span>
                <div v-else class="mini-spinner"></div>
              </button>
              <button @click="showRefundConfirm = false" class="btn-cancel-refund" :disabled="isRefunding">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Transition>

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

      <Transition name="slide-toast">
        <div v-if="toast.show" class="toast-notification" :class="toast.type">
          <i v-if="toast.type === 'success'" class="fa-solid fa-circle-check"></i>
          <i v-else class="fa-solid fa-circle-xmark"></i>
          <span>{{ toast.message }}</span>
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

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: colors.$border-light;
    border-radius: 10px;
  }
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  /* Force minimum width to trigger scroll on mobile */
  font-size: 0.85rem;

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid colors.$border-light;
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

  .tx-id {
    font-size: 0.65rem;
    color: colors.$text-light;
    font-family: monospace;
  }
}

.amount-cell {
  font-weight: 700;
  color: colors.$BRAND-PRIMARY;
  white-space: nowrap;
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

.refund-note {
  font-size: 0.65rem;
  color: colors.$error;
  font-weight: 600;
  margin-top: 4px;
}

.actions-cell {
  text-align: center;
}

.btn-refund-mini {
  background: white;
  border: 1px solid colors.$border-light;
  color: colors.$text-light;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: colors.$error;
    color: white;
    border-color: colors.$error;
    transform: scale(1.1);
  }
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

/* Refund Modal Styles */
.refund-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.refund-modal-container {
  background: white;
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);

  .modal-decoration {
    font-size: 3rem;
    color: colors.$BRAND-PRIMARY;
    margin-bottom: 1rem;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: colors.$text-dark;
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 0.95rem;
    color: colors.$text-light;
    line-height: 1.5;
    margin-bottom: 2rem;

    code {
      background: colors.$background-light;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: colors.$text-dark;
    }
  }
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.btn-confirm-refund {
  background: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: colors.$text-dark;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-cancel-refund {
  background: none;
  border: 1px solid colors.$border-light;
  color: colors.$text-light;
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: colors.$background-light;
    color: colors.$text-dark;
  }
}

/* Toast Styles */
.toast-notification {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 10001;
  min-width: 300px;
  justify-content: center;

  &.success {
    background: #2e7d32;
  }

  &.error {
    background: #c62828;
  }

  i {
    font-size: 1.2rem;
  }
}

.mini-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
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

@keyframes slide-toast-enter {
  from {
    opacity: 0;
    transform: translate(-50%, 100%);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.slide-toast-enter-active {
  animation: slide-toast-enter 0.4s ease-out;
}

.slide-toast-leave-active {
  animation: slide-toast-enter 0.3s ease-in reverse;
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
