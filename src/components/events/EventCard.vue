<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Event } from '@/types/event';
import Storyblok from '@/services/storyblok';

const router = useRouter();

const props = defineProps({
  event: {
    type: Object as () => Event,
    required: false,
  },
  story: {
    type: Object,
    required: false,
  },
  uuid: {
    type: String,
    required: false,
  }
});

const fetchedEvent = ref<Event | null>(null);
const loading = ref(false);

const mapStoryToEvent = (story: any): Event => {
  const content = story.content;
  const dateObj = new Date(content.fecha || new Date());

  // Format date and time
  const date = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  const time = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  // Handle image URL (Storyblok asset object or string)
  let imageUrl = 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2000&auto=format&fit=crop'; // Default fallback
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
    location: '4R Piano Bar',
    price: content.price ? `$${content.price}` : undefined,
    slug: story.slug
  };
};

const displayEvent = computed<Event | null>(() => {
  if (props.event) return props.event;
  if (props.story) return mapStoryToEvent(props.story);
  if (fetchedEvent.value) return fetchedEvent.value;
  return null;
});

const navigateToDetail = () => {
  if (displayEvent.value && displayEvent.value.slug) {
    router.push({ name: 'event-detail', params: { slug: displayEvent.value.slug } });
  }
};

onMounted(async () => {
  if (!props.event && !props.story && props.uuid) {
    try {
      loading.value = true;
      const story = await Storyblok.getEventById(props.uuid);
      if (story) {
        fetchedEvent.value = mapStoryToEvent(story);
      }
    } catch (e) {
      console.error('EventCard: Failed to fetch event by UUID', e);
    } finally {
      loading.value = false;
    }
  }
});
</script>

<template>
  <article v-if="displayEvent" class="event-card" @click="navigateToDetail">
    <div class="event-card__image-wrapper">
      <img :src="displayEvent.imageUrl" :alt="displayEvent.title" class="event-card__image" loading="lazy" />
      <div class="event-card__date-badge">
        <span class="event-card__date">{{ displayEvent.date }}</span>
      </div>
    </div>
    <div class="event-card__content">
      <h3 class="event-card__title">
        <a @click.prevent="navigateToDetail" href="#" class="event-card__link">{{ displayEvent.title }}</a>
      </h3>
      <div class="event-card__meta">
        <span class="event-card__time" v-if="displayEvent.time">
          <i class="icon-clock"></i> {{ displayEvent.time }}
        </span>
        <span class="event-card__location" v-if="displayEvent.location">
          <i class="icon-location"></i> {{ displayEvent.location }}
        </span>
      </div>
      <p class="event-card__description">{{ displayEvent.description }}</p>
      <div class="event-card__footer" v-if="displayEvent.price">
        <span class="event-card__price">{{ displayEvent.price }}</span>
        <button class="event-card__cta">Reservar</button>
      </div>
    </div>
  </article>
  <div v-else-if="loading" class="event-card-skeleton">
    <!-- Optional: Skeleton loader style here -->
    Cargando...
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.event-card {
  background-color: colors.$white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  &__image-wrapper {
    position: relative;
    padding-top: 56.25%; // 16:9 Aspect Ratio
    overflow: hidden;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;

    .event-card:hover & {
      transform: scale(1.05);
    }
  }

  &__date-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: colors.$BRAND-PRIMARY;
    color: colors.$white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.9rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &__content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__title {
    font-family: 'Playfair Display', serif; // Assuming font is available or fallback
    font-size: 1.5rem;
    color: colors.$text-dark;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }

  &__link {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: colors.$BRAND-PRIMARY;
    }
  }

  &__meta {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: colors.$text-light;
    margin-bottom: 1rem;

    i {
      margin-right: 0.25rem;
    }
  }

  &__description {
    font-size: 1rem;
    color: colors.$text-light;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    flex-grow: 1; // Pushes footer to bottom
    display: -webkit-box;
    -webkit-line-clamp: 3; // Limit to 3 lines
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    border-top: 1px solid colors.$border-light;
    padding-top: 1rem;
  }

  &__price {
    font-weight: bold;
    color: colors.$BRAND-PRIMARY;
    font-size: 1.1rem;
  }

  &__cta {
    background-color: colors.$BRAND-PRIMARY;
    color: colors.$white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: colors.$primary-hover;
    }
  }
}
</style>
