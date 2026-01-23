<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Storyblok from '@/services/storyblok';
import ReservationModal from '@/components/ui/ReservationModal.vue';
import type { Event } from '@/types/event';

const route = useRoute();
const router = useRouter();
const event = ref<Event | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showReservationModal = ref(false);
const reservationMode = ref<'whatsapp' | 'paymentez' | 'help'>('whatsapp');
const guestCount = ref(2);
const isCheckoutOpen = ref(false); // Track if Checkout modal is open

// Selected Zone Logic
const selectedZoneName = ref<string>('');

const minGuests = computed(() => selectedZoneName.value === 'VIP' ? 10 : 1);
const maxGuests = computed(() => selectedZoneName.value === 'VIP' ? 15 : 20);

// Watcher to enforce limits when switching zones
watch(selectedZoneName, (newZone) => {
  if (newZone === 'VIP') {
    if (guestCount.value < 10) guestCount.value = 10;
    if (guestCount.value > 15) guestCount.value = 15;
  }
});

const incrementGuests = () => {
  if (guestCount.value < maxGuests.value) guestCount.value++;
};

const decrementGuests = () => {
  if (guestCount.value > minGuests.value) guestCount.value--;
};

const whatsappDirectUrl = computed(() => {
  const peopleText = guestCount.value > 1 ? ` para ${guestCount.value} personas` : ' para 1 persona';
  const zoneText = selectedZoneName.value ? ` en zona ${selectedZoneName.value}` : '';
  const text = `Hola, deseo reservar${peopleText}${zoneText} para el evento${event.value ? `: ${event.value.title}` : ''}.`;
  return `https://wa.me/593979279877?text=${encodeURIComponent(text)}`;
});

// Reutilizamos la lógica de mapeo que ya probamos en EventCard...
const mapStoryToEvent = (story: any): Event => {
  const content = story.content;
  const dateObj = new Date(content.fecha || new Date());

  const date = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const time = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  let imageUrl = 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2000&auto=format&fit=crop';
  if (content.foto) {
    if (typeof content.foto === 'string' && content.foto.trim() !== '') {
      imageUrl = content.foto;
    } else if (typeof content.foto === 'object' && content.foto.filename) {
      imageUrl = content.foto.filename;
    }
  }

  const prices = [];

  if (content.priceTerraza) {
    prices.push({
      zone: 'Terraza',
      price: parseFloat(content.priceTerraza) || 0,
      cover: parseFloat(content.priceTerrazaCover) || 0
    });
  }
  if (content.priceSalonPrincipal) {
    prices.push({
      zone: 'Salón Principal',
      price: parseFloat(content.priceSalonPrincipal) || 0,
      cover: parseFloat(content.priceSalonPrincipalCover) || 0
    });
  }
  if (content.priceVip) {
    prices.push({
      zone: 'VIP',
      price: parseFloat(content.priceVip) || 0,
      cover: parseFloat(content.priceVipCover) || 0
    });
  }

  return {
    id: story.uuid,
    title: content.title || story.name,
    date: date,
    time: time,
    description: content.description || '',
    imageUrl: imageUrl,
    location: '4R Piano Bar',
    price: content.price ? `$${content.price}` : undefined,
    prices: prices.length > 0 ? prices : undefined
  };
};

const fetchEventDetail = async () => {
  const slug = route.params.slug as string;
  if (!slug) {
    router.push({ name: 'events' });
    return;
  }

  try {
    loading.value = true;
    const story = await Storyblok.getEventBySlug(slug);

    if (story) {
      event.value = mapStoryToEvent(story);

      // Select first zone by default if available
      const prices = event.value?.prices;
      if (prices && prices.length > 0) {
        selectedZoneName.value = prices[0]?.zone || '';
      }
    } else {
      error.value = 'Evento no encontrado';
    }
  } catch (err) {
    console.error('Error fetching event detail:', err);
    error.value = 'Error al cargar el evento. Intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};

const numericPrice = computed(() => {
  // If we have distinct zones, find the price of the selected zone
  if (event.value?.prices && event.value.prices.length > 0 && selectedZoneName.value) {
    const zone = event.value.prices.find(p => p.zone === selectedZoneName.value);
    return zone ? zone.price : 0;
  }

  // Fallback for single legacy price
  if (!event.value?.price) return 0;
  const price = event.value.price.replace(/[^\d.]/g, '');
  return parseFloat(price) || 0;
});

const handleBuyTicket = () => {
  reservationMode.value = 'paymentez';
  showReservationModal.value = true;
};

const handleWhatsappReservation = () => {
  reservationMode.value = 'whatsapp';
  showReservationModal.value = true;
};

const handleHelpRequest = () => {
  reservationMode.value = 'help';
  showReservationModal.value = true;
};

const onSelectZone = (zoneName: string) => {
  selectedZoneName.value = zoneName;
};

onMounted(async () => {
  fetchEventDetail();
});

const goBack = () => {
  router.push({ name: 'events' });
};
</script>

<template>
  <main class="event-detail">
    <div v-if="loading" class="event-detail__state">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="event-detail__state">
      <p>{{ error }}</p>
      <button @click="goBack" class="btn-back">Volver a Eventos</button>
    </div>

    <article v-else-if="event" class="event-content">
      
      <header class="event-header" :style="{ backgroundImage: `url(${event.imageUrl})` }">
        <div class="event-header__overlay"></div>
        <div class="event-header__content">
          <button @click="goBack" class="btn-back-icon" aria-label="Volver">
            <i class="fa-solid fa-arrow-left"></i> Volver
          </button>
          <h1 class="event-title">{{ event.title }}</h1>
          <div class="event-meta-hero">
            <span class="meta-item"><i class="fa-regular fa-calendar"></i> {{ event.date }}</span>
            <span class="meta-item"><i class="fa-regular fa-clock"></i> {{ event.time }}</span>
          </div>
        </div>
      </header>

      <div class="event-body-container">
        <div class="event-main-info">
          <p class="event-description">{{ event.description }}</p>
          
          <div class="event-additional-info">
            <div class="info-block" v-if="event.location">
              <h3><i class="fa-solid fa-location-dot"></i> Ubicación</h3>
              <p class="location-main">{{ event.location }}</p>
              <p class="location-detail">Edificio Xima, local #02.<br>(atrás de la Clínica Kennedy)</p>
            </div>
            
            <div class="info-block" v-if="event.prices && event.prices.length">
              <h3><i class="fa-solid fa-ticket"></i> Precios por Zona</h3>
              <div class="zone-cards">
                <div 
                  v-for="p in event.prices" 
                  :key="p.zone" 
                  class="zone-card"
                  :class="{ 'zone-card--selected': selectedZoneName === p.zone }"
                  @click="onSelectZone(p.zone)"
                >
                  <div class="zone-header">
                    <span class="radio-indicator"></span>
                    <span class="zone-name">{{ p.zone }}</span>
                  </div>
                  <div class="zone-price">${{ p.price }}</div>
                  <div class="zone-detail">
                    <span class="cost-breakdown">(${{ p.price - p.cover }} consumibles + ${{ p.cover }} cover)</span>
                    <div v-if="p.zone === 'VIP'" class="zone-restriction">
                      <i class="fa-solid fa-users"></i> Mínimo 10 - Máximo 15 personas
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="info-block" v-else-if="event.price">
              <h3><i class="fa-solid fa-ticket"></i> Precio</h3>
              <p>{{ event.price }}</p>
            </div>
          </div>
        </div>

        <aside class="event-sidebar">
          <div class="reservation-card">
            <h3>Reserva tu lugar</h3>
            <p>Asegura tu asistencia a este evento exclusivo.</p>
            
            <div class="guest-selector">
              <label class="selector-label">Personas:</label>
              <div class="counter-wrapper">
                <button @click="decrementGuests" :disabled="guestCount <= minGuests" class="btn-counter" aria-label="Disminuir">-</button>
                <span class="guest-count">{{ guestCount }}</span>
                <button @click="incrementGuests" :disabled="guestCount >= maxGuests" class="btn-counter" aria-label="Aumentar">+</button>
              </div>
            </div>
            
            <div v-if="selectedZoneName" class="selected-summary">
              <div class="summary-row">
                <span>Zona:</span>
                <strong>{{ selectedZoneName }}</strong>
              </div>
              <div class="summary-row">
                <span>Total ({{ guestCount }} pers):</span>
                <strong>${{ numericPrice * guestCount }}</strong>
              </div>
            </div>

            <button v-if="event.price || (event.prices && event.prices.length > 0)" @click="handleBuyTicket" class="btn-reserve btn-pay">
              <i class="fa-regular fa-credit-card"></i> Pagar con Tarjeta / Reservar
            </button>

            <button @click="handleWhatsappReservation" class="btn-reserve btn-whatsapp">
              <i class="fa-brands fa-whatsapp"></i> Reservar por WhatsApp
            </button>
          </div>

          <div class="help-center-teaser">
            <div class="teaser-icon">
              <i class="fa-solid fa-circle-question"></i>
            </div>
            <div class="teaser-content">
              <h4>¿Ya tienes una reserva?</h4>
              <p>Gestiona tus tarjetas, revisa tus consumos o solicita reembolsos.</p>
              <button @click="handleHelpRequest" class="btn-text-help">
                Ir al Centro de Ayuda <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Modal para redirección a WhatsApp / Pago -->
          <ReservationModal 
            :is-open="showReservationModal" 
            :event-name="event.title"
            :event-date="event.date"
            :event-time="event.time"
            :guest-count="guestCount"
            :initial-mode="reservationMode"
            :event-price="numericPrice"
            :ticket-type="selectedZoneName"
            @close="showReservationModal = false"
          />
        </aside>
      </div>
    </article>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;
@use 'sass:color';

.event-detail {
  min-height: 100vh;
  background-color: colors.$background-light;

  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 1rem;
    color: colors.$text-light;
  }
}

.event-header {
  position: relative;
  height: 60vh;
  min-height: 400px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.3) 100%);
  }

  &__content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem 4rem 1rem;
    color: colors.$white;
  }
}

.btn-back-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: none;
  color: colors.$white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.event-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.event-meta-hero {
  display: flex;
  gap: 2rem;
  font-size: 1.1rem;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.event-body-container {
  max-width: 1200px;
  margin: -3rem auto 0;
  padding: 0 1rem 4rem;
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    margin-top: 2rem;
  }
}

.event-main-info {
  background: colors.$white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.event-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: colors.$text-dark;
  margin-bottom: 2.5rem;
  white-space: pre-line;
}

.event-additional-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid colors.$border-light;

  .info-block {
    h3 {
      font-size: 1rem;
      color: colors.$text-light;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    p.location-main {
      font-size: 1.2rem;
      font-weight: 600;
      color: colors.$text-dark;
      margin-bottom: 0.2rem;
    }

    p.location-detail {
      font-size: 0.95rem;
      color: colors.$text-light;
      line-height: 1.4;
    }
  }
}

.reservation-card {
  background: colors.$BRAND-PRIMARY;
  color: colors.$white;
  padding: 2rem;
  border-radius: 8px;
  position: sticky;
  top: 100px;
  text-align: center;

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }
}

.guest-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 4px;

  .selector-label {
    font-weight: 600;
    font-size: 1rem;
  }
}

.counter-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-counter {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: colors.$white;
  color: colors.$BRAND-PRIMARY;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background 0.2s;

  &:hover:not(:disabled) {
    transform: scale(1.1);
    background: colors.$accent-gold;
    color: colors.$text-dark;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.guest-count {
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 1.5rem;
  text-align: center;
}

.btn-reserve {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
  gap: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  appearance: none;
  /* Elimina estilos nativos del SO para botones */
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  &.btn-pay {
    background: colors.$accent-gold;
    color: colors.$text-dark;
  }

  &.btn-whatsapp {
    background: #25D366;
    color: colors.$white;
  }
}

.help-center-teaser {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  border-left: 4px solid colors.$BRAND-PRIMARY;

  .teaser-icon {
    font-size: 1.5rem;
    color: colors.$BRAND-PRIMARY;
    margin-top: 0.2rem;
  }

  .teaser-content {
    h4 {
      font-size: 1rem;
      color: colors.$text-dark;
      margin-bottom: 0.3rem;
      font-weight: 700;
    }

    p {
      font-size: 0.85rem;
      color: colors.$text-light;
      line-height: 1.4;
      margin-bottom: 1rem;
    }
  }
}

.btn-text-help {
  background: none;
  border: none;
  color: colors.$BRAND-PRIMARY;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: gap 0.2s;

  &:hover {
    gap: 0.6rem;
    text-decoration: underline;
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid colors.$gray-200;
  border-top-color: colors.$BRAND-PRIMARY;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.zone-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.zone-card {
  background: colors.$background-light;
  border: 2px solid transparent;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: color.scale(colors.$background-light, $lightness: -3%);
  }

  &--selected {
    border-color: colors.$BRAND-PRIMARY;
    background: rgba(colors.$BRAND-PRIMARY, 0.05);

    .radio-indicator {
      background: colors.$BRAND-PRIMARY;
      border-color: colors.$BRAND-PRIMARY;
      box-shadow: inset 0 0 0 3px white;
    }
  }
}

.zone-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

.radio-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid colors.$gray-300;
  display: inline-block;
  transition: all 0.2s;
}

.zone-name {
  font-weight: 700;
  color: colors.$text-dark;
  font-size: 1rem;
}

.zone-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: colors.$BRAND-PRIMARY;
  margin-left: 2.1rem;
  /* align with text */
  margin-bottom: 0.2rem;
}

.zone-detail {
  font-size: 0.85rem;
  color: colors.$text-light;
  margin-left: 2.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.zone-restriction {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: rgba(colors.$accent-gold, 0.15);
  color: color.scale(colors.$accent-gold, $lightness: -20%);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.8rem;
  width: fit-content;
}

.selected-summary {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;

    &:last-child {
      margin-bottom: 0;
      padding-top: 0.5rem;
      border-top: 1px dashed rgba(255, 255, 255, 0.3);
      font-size: 1.1rem;
    }
  }
}
</style>
