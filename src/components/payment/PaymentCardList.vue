<script setup lang="ts">
import { ref, onMounted } from 'vue';
import paymentAPI from '@/services/payment';

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['select', 'addNew', 'delete']);

const cards = ref<any[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const fetchCards = async () => {
  try {
    isLoading.value = true;
    const response = await paymentAPI.listCards(props.userId);
    cards.value = response.cards || [];
  } catch (err: any) {
    console.error('Error fetching cards:', err);
    errorMessage.value = 'No se pudieron cargar tus tarjetas guardadas.';
  } finally {
    isLoading.value = false;
  }
};

const deleteCard = async (token: string) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) return;
  
  try {
    await paymentAPI.deleteCard(props.userId, token);
    cards.value = cards.value.filter(c => c.token !== token);
    emit('delete', token);
  } catch (err: any) {
    alert('Error al eliminar la tarjeta.');
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
          <button @click.stop="deleteCard(card.token)" class="btn-delete" title="Eliminar">
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
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.card-list-step {
  width: 100%;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 1rem;
  color: colors.$text-light;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: colors.$text-dark;
  }
}

.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid colors.$border-light;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: colors.$BRAND-PRIMARY;
    background-color: rgba(colors.$BRAND-PRIMARY, 0.02);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.card-brand {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
  color: colors.$BRAND-PRIMARY;
}

.card-number {
  font-size: 1rem;
  font-weight: 600;
  color: colors.$text-dark;
}

.card-expiry {
  font-size: 0.8rem;
  color: colors.$text-light;
}

.btn-delete {
  background: none;
  border: none;
  color: colors.$text-light;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
  
  &:hover {
    color: colors.$error;
  }
}

.btn-primary {
  width: 100%;
  background-color: colors.$BRAND-PRIMARY;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn-outline {
  width: 100%;
  background: transparent;
  border: 1px solid colors.$border-light;
  padding: 0.8rem;
  border-radius: 8px;
  color: colors.$text-dark;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: colors.$background-light;
  }
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
