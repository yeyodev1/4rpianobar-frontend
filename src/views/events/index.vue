<script setup lang="ts">
import { computed } from 'vue';

const event = {
  slug: 'show-tropical-en-vivo',
  date: '30 DE ENERO',
  title: 'Show Tropical en Vivo',
  description: 'Empieza el Show trae un espectáculo especial de bailarines profesionales de salsa, que encenderán la pista con coreografías llenas de sabor, fuerza y movimiento. Después del show de baile, la noche continúa con un artista en vivo, creando el ambiente perfecto para seguir disfrutando, cantar, bailar y vivir una experiencia completa. Una noche donde el espectáculo se vive desde el primer minuto, música y show… todo en una sola noche',
  image: 'https://a.storyblok.com/f/289340927670052/1080x1350/d1e996775e/arte-enero-30.png',
  prices: [
    { zone: 'Terraza', price: 25, cover: 5 },
    { zone: 'Salón Principal', price: 35, cover: 5 },
    { zone: 'VIP', price: 40, cover: 2 }
  ]
};

const processedPrices = computed(() => {
  return event.prices.map(p => {
    const consumable = p.price - p.cover;
    return {
      zone: p.zone,
      text: `$${p.price} ($${consumable} consumibles y $${p.cover} cover)`
    };
  });
});
</script>

<template>
  <main class="events-page">
    <div class="events-page__header">
      <h1 class="events-page__title">Próximos Eventos</h1>
      <p class="events-page__subtitle">Descubre las experiencias exclusivas que hemos preparado para ti.</p>
    </div>

    <section class="events-page__grid icon-center">
      <article class="event-card">
        <div class="event-card__image-wrapper">
          <img :src="event.image" :alt="event.title" class="event-card__image" />
        </div>
        
        <div class="event-card__content">
            <div class="event-date">{{ event.date }}</div>
            <h2 class="event-title">{{ event.title }}</h2>
            <p class="event-desc">{{ event.description }}</p>
            
            <div class="event-prices">
                <h3>Precios:</h3>
                <ul>
                    <li v-for="p in processedPrices" :key="p.zone">
                        <strong>{{ p.zone }}:</strong> {{ p.text }}
                    </li>
                </ul>
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
    justify-content: center;
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
