<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Storyblok from '@/services/storyblok';
import type { Event } from '@/types/event';

const events = ref<Event[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const mapStoryToEvent = (story: any): Event => {
  const content = story.content;
  const dateObj = new Date(content.fecha || new Date());

  // Format: "30 ENERO" (approximate to previous look)
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
  const formattedDate = `${day} ${month}`;

  const time = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  let imageUrl = '';
  if (content.foto) {
    if (typeof content.foto === 'string') imageUrl = content.foto;
    else if (content.foto.filename) imageUrl = content.foto.filename;
  }

  const prices = [];
  if (content.priceTerraza) {
    prices.push({ zone: 'Terraza', price: parseFloat(content.priceTerraza), cover: parseFloat(content.priceTerrazaCover) || 0 });
  }
  if (content.priceSalonPrincipal) {
    prices.push({ zone: 'Salón Principal', price: parseFloat(content.priceSalonPrincipal), cover: parseFloat(content.priceSalonPrincipalCover) || 0 });
  }
  if (content.priceVip) {
    prices.push({ zone: 'VIP', price: parseFloat(content.priceVip), cover: parseFloat(content.priceVipCover) || 0 });
  }

  return {
    id: story.uuid,
    slug: story.slug,
    title: content.title || story.name,
    date: formattedDate,
    time: time,
    description: content.description || '',
    imageUrl: imageUrl,
    prices: prices.length ? prices : undefined,
    price: content.price
  };
};

const fetchEvents = async () => {
  try {
    loading.value = true;
    const stories = await Storyblok.getEvents();
    events.value = stories.map(mapStoryToEvent);
  } catch (e) {
    console.error(e);
    error.value = 'No se pudieron cargar los eventos.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEvents();
});

// Helper to format price text for display
const formatPriceText = (p: { price: number; cover: number }) => {
  const consumable = p.price - p.cover;
  return `$${p.price} ($${consumable} consumibles y $${p.cover} cover)`;
};
</script>

<template>
  <main class="events-page">
    <div class="events-page__header">
      <h1 class="events-page__title">Próximos Eventos</h1>
      <p class="events-page__subtitle">Descubre las experiencias exclusivas que hemos preparado para ti.</p>
    </div>

    <div v-if="loading" class="state-message">Cargando eventos...</div>
    <div v-else-if="error" class="state-message error">{{ error }}</div>

    <section v-else class="events-page__grid icon-center">
      <div v-if="events.length === 0" class="state-message">No hay eventos próximos.</div>
      
      <article v-for="event in events" :key="event.id" class="event-card">
        <div class="event-card__image-wrapper">
          <img v-if="event.imageUrl" :src="event.imageUrl" :alt="event.title" class="event-card__image" />
          <div v-else class="event-card__image-placeholder"></div>
        </div>
        
        <div class="event-card__content">
            <div class="event-date">{{ event.date }}</div>
            <h2 class="event-title">{{ event.title }}</h2>
            <p class="event-desc">{{ event.description }}</p>
            
            <div class="event-prices" v-if="event.prices && event.prices.length">
                <h3>Precios:</h3>
                <ul>
                    <li v-for="p in event.prices" :key="p.zone">
                        <strong>{{ p.zone }}:</strong> {{ formatPriceText(p) }}
                    </li>
                </ul>
            </div>
            <div class="event-prices" v-else-if="event.price">
               <h3>Precio:</h3>
               <p>{{ event.price }}</p>
            </div>
            
            <router-link :to="{ name: 'event-detail', params: { slug: event.slug } }" class="event-cta">
              RESERVAR AHORA
            </router-link>
        </div>
      </article>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;
@use 'sass:color';

.events-page {
  padding: 4rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 80vh;

  &__header {
    text-align: center;
    margin-bottom: 4rem;
  }

  &__title {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: colors.$accent-gold;
    margin-bottom: 1rem;
  }

  &__subtitle {
    font-size: 1.1rem;
    color: colors.$white;
    max-width: 600px;
    margin: 0 auto;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }
}

.state-message {
  color: colors.$white;
  text-align: center;
  font-size: 1.2rem;
  padding: 2rem;

  &.error {
    color: #ff6b6b;
  }
}

.event-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(colors.$accent-gold, 0.3);
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  color: colors.$white;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  &__image-wrapper {
    flex: 1;
    min-height: 300px;
    background: #000;

    @media (max-width: 768px) {
      min-height: 250px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
  }

  &__content {
    flex: 1.2;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

.event-date {
  color: colors.$accent-gold;
  font-weight: bold;
  letter-spacing: 2px;
  font-size: 1.1rem;
}

.event-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: colors.$white;
  margin: 0;
  line-height: 1.2;
}

.event-desc {
  color: colors.$gray-300;
  line-height: 1.6;
  font-size: 0.95rem;
}

.event-prices {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: auto;

  h3 {
    color: colors.$accent-gold;
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.5rem;
      color: colors.$gray-300;
      font-size: 0.95rem;

      strong {
        color: colors.$white;
        margin-right: 0.5rem;
      }
    }
  }
}

.event-cta {
  display: inline-block;
  background: colors.$BRAND-BURGUNDY;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  align-self: flex-start;
  transition: all 0.3s ease;
  margin-top: 1rem;
  border: 1px solid transparent;

  &:hover {
    background: color.scale(colors.$BRAND-BURGUNDY, $lightness: 10%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(colors.$BRAND-BURGUNDY, 0.3);
  }
}
</style>
