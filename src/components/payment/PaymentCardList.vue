<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import paymentAPI from '@/services/payment';

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

const emit = defineEmits(['select', 'addNew', 'delete', 'error']);

const cards = ref<any[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const fetchCards = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    const response = await paymentAPI.listCards(props.userId, props.email, props.verificationCode);
    cards.value = response.cards || [];
  } catch (err: any) {
    console.error('Error fetching cards:', err);
    const msg = err.response?.data?.message || err.message || 'No se pudieron cargar tus tarjetas guardadas.';

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

// Clear error and re-fetch if props change (user verified again)
watch(() => props.verificationCode, () => {
  errorMessage.value = '';
  fetchCards();
});

const retryVerification = () => {
  emit('error', errorMessage.value);
};

const showDeleteConfirm = ref(false);
const tokenToDelete = ref('');
const isDeleting = ref(false);
const toast = ref<{ show: boolean, type: 'success' | 'error', message: string }>({
  show: false,
  type: 'success',
  message: ''
});

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, type, message };
  setTimeout(() => { toast.value.show = false; }, 4000);
};

const confirmDelete = (token: string) => {
  tokenToDelete.value = token;
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  if (!tokenToDelete.value) return;

  try {
    isDeleting.value = true;
    await paymentAPI.deleteCard(props.userId, tokenToDelete.value, props.email, props.verificationCode);
    cards.value = cards.value.filter(c => c.token !== tokenToDelete.value);
    emit('delete', tokenToDelete.value);
    showToast('Tarjeta eliminada correctamente.');
    showDeleteConfirm.value = false;
  } catch (err: any) {
    showToast('No se pudo eliminar la tarjeta.', 'error');
  } finally {
    isDeleting.value = false;
    tokenToDelete.value = '';
  }
};

onMounted(() => {
  fetchCards();
});
</script>

<template>
  <div class="card-list-step">
    <div v-if="isLoading" class="loader">
      <div class="spinner"></div>
      <p>Buscando tarjetas guardadas...</p>
    </div>

    <div v-else-if="errorMessage" class="error-container">
      <div class="error-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3>Vaya, algo salió mal</h3>
      <p>{{ errorMessage }}</p>
      <button @click="retryVerification" class="btn-primary">
        Intentar de nuevo
      </button>
    </div>

    <div v-else-if="cards.length > 0" class="cards-container">
      <h3>Selecciona una Tarjeta</h3>
      <div class="cards-grid">
        <div 
          v-for="card in cards" 
          :key="card.token" 
          class="card-item"
          @click="$emit('select', card)"
        >
          <div class="card-info">
            <span class="card-brand">{{ card.type }}</span>
            <span class="card-number">•••• {{ card.number }}</span>
            <span class="card-expiry">{{ card.expiry_month }}/{{ card.expiry_year }}</span>
          </div>
          <button @click.stop="confirmDelete(card.token)" class="btn-delete" title="Eliminar">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      
      <button @click="$emit('addNew')" class="btn-outline">
        Usar una tarjeta nueva
      </button>
    </div>

    <div v-else class="no-cards">
      <p>No tienes tarjetas guardadas para este correo.</p>
      <button @click="$emit('addNew')" class="btn-primary">
        Agregar Nueva Tarjeta
      </button>
    </div>

    <!-- Custom Deletion Confirmation -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDeleteConfirm" class="del-modal-backdrop" @click="showDeleteConfirm = false">
          <div class="del-modal-container" @click.stop>
            <div class="del-icon">
              <i class="fa-solid fa-trash-can"></i>
            </div>
            <h3>¿Eliminar Tarjeta?</h3>
            <p>Esta acción no se puede deshacer. No podrás usar esta tarjeta para tus próximas reservas sin volver a ingresarla.</p>
            
            <div class="del-actions">
              <button @click="handleDelete" class="btn-confirm-del" :disabled="isDeleting">
                <span v-if="!isDeleting">Sí, eliminar</span>
                <div v-else class="mini-spinner"></div>
              </button>
              <button @click="showDeleteConfirm = false" class="btn-cancel-del" :disabled="isDeleting">
                Cancelar
              </button>
            </div>
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
@use 'sass:color';

.card-list-step {
  width: 100%;
}

/* ... styles omitted for brevity, keeping surrounding code intact if it was passed ... */
/* Wait, I should target specific blocks or replace the whole style if manageable, but replace_file_content is better with specific chunks */

/* ... */

.btn-primary {
  width: 100%;
  background-color: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: color.scale(colors.$BRAND-PRIMARY, $lightness: -10%);
    transform: translateY(-2px);
  }
}

/* ... */

.btn-confirm-del {
  background: colors.$error;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: color.scale(colors.$error, $lightness: -10%);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-cancel-del {
  background: none;
  border: 1px solid colors.$border-light;
  color: colors.$text-light;
  padding: 0.8rem;
  border-radius: 8px;
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
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: white;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 20002;
  min-width: 250px;
  justify-content: center;
  font-size: 0.9rem;

  &.success {
    background: #2e7d32;
  }

  &.error {
    background: #c62828;
  }

  i {
    font-size: 1.1rem;
  }
}

.mini-spinner {
  width: 18px;
  height: 18px;
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

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
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
