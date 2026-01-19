<script setup lang="ts">
import { ref, onMounted } from 'vue';
import EventCard from '@/components/events/EventCard.vue';
import Storyblok from '@/services/storyblok';

const stories = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchEvents = async () => {
  try {
    loading.value = true;
    const data = await Storyblok.getEvents();

    if (data) {
      stories.value = data;
    }
  } catch (err) {
    console.error('Error fetching events:', err);
    error.value = 'No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <main class="events-page">
    <div class="events-page__header">
      <h1 class="events-page__title">Próximos Eventos</h1>
      <p class="events-page__subtitle">Descubre las experiencias exclusivas que hemos preparado para ti.</p>
    </div>

    <div v-if="loading" class="events-page__state">
      <p>Cargando eventos...</p>
    </div>
    
    <div v-else-if="error" class="events-page__state events-page__state--error">
      <p>{{ error }}</p>
    </div>

    <section v-else class="events-page__grid">
      <EventCard 
        v-for="story in stories" 
        :key="story.uuid" 
        :story="story" 
      />
      <div v-if="stories.length === 0" class="events-page__state">
        <p>No hay eventos próximos programados en este momento.</p>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.events-page {
  padding: 4rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 80vh; // Ensure it takes up space even with few items

  &__header {
    text-align: center;
    margin-bottom: 4rem;
  }

  &__title {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: colors.$accent-gold;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      font-size: 3.5rem;
    }
  }

  &__subtitle {
    font-size: 1.1rem;
    color: colors.$white;
    max-width: 600px;
    margin: 0 auto;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__state {
    text-align: center;
    padding: 3rem;
    font-size: 1.2rem;
    color: colors.$text-light;
    grid-column: 1 / -1;

    &--error {
      color: colors.$error;
    }
  }
}
</style>
