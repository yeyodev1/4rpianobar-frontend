<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Storyblok from '@/services/storyblok';
import type { Event } from '@/types/event';

const route = useRoute();
const router = useRouter();
const event = ref<Event | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Reutilizamos la lógica de mapeo que ya probamos en EventCard, 
// pero adaptada aquí ya que necesitamos la data para poblar la vista completa.
// En un futuro refactor, esta función podría ir a un `utils/transformers.ts`
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

  return {
    id: story.uuid,
    title: content.title || story.name,
    date: date,
    time: time,
    description: content.description || '',
    imageUrl: imageUrl,
    location: '4R Piano Bar', // Idealmente vendría del CMS
    price: content.price ? `$${content.price}` : undefined
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
    // Asumimos que el slug en la URL corresponde al slug de Storyblok
    const story = await Storyblok.getEventBySlug(slug);
    
    if (story) {
      event.value = mapStoryToEvent(story);
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

const goBack = () => {
  router.push({ name: 'events' });
};

onMounted(() => {
  fetchEventDetail();
});
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
              <p>{{ event.location }}</p>
            </div>
            <div class="info-block" v-if="event.price">
              <h3><i class="fa-solid fa-ticket"></i> Precio</h3>
              <p>{{ event.price }}</p>
            </div>
          </div>
        </div>

        <aside class="event-sidebar">
          <div class="reservation-card">
            <h3>Reserva tu lugar</h3>
            <p>Asegura tu asistencia a este evento exclusivo.</p>
            <a href="https://wa.me/593979279877?text=Hola,%20deseo%20reservar%20para%20el%20evento" target="_blank" class="btn-reserve">
              Reservar por WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </article>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

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
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.3) 100%);
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
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
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
    p {
      font-size: 1.2rem;
      font-weight: 600;
      color: colors.$text-dark;
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

.btn-reserve {
  display: inline-block;
  background: colors.$white;
  color: colors.$BRAND-PRIMARY;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  width: 100%;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
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
  to { transform: rotate(360deg); }
}
</style>
