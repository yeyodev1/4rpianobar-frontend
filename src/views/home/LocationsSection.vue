<script setup lang="ts">
import heroImg from '@/assets/static/restaurant/hero.jpg'

const locations = [
  { id: 1, name: 'POLANCO', image: heroImg },
  { id: 2, name: 'CANCÚN', image: heroImg },
  { id: 3, name: 'TULUM', image: heroImg },
  { id: 4, name: 'LOS CABOS', image: heroImg },
]
</script>

<template>
  <section class="locations">
    <h2 class="locations__title">NUESTRAS UBICACIONES</h2>
    <div class="cards">
      <div
        v-for="loc in locations"
        :key="loc.id"
        class="card"
        :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${loc.image}')` }"
      >
        <div class="card__label">{{ loc.name }}</div>
      </div>
    </div>
  </section>
  
</template>

<style lang="scss" scoped>
.locations {
  padding: 24px 16px;
}

.locations__title {
  font-family: $font-principal;
  color: $accent-gold;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 2px;
  margin: 0 0 16px;
  font-size: 20px;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  position: relative;
  border-radius: 12px;
  min-height: 180px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card__label {
  font-family: $font-principal;
  color: $white;
  font-size: 18px;
  letter-spacing: 2px;
}

@media (min-width: 768px) {
  .locations__title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .card {
    min-height: 220px;
  }
}

@media (min-width: 1024px) {
  .cards {
    flex-direction: row;
    align-items: stretch;
  }

  .card {
    flex: 1 1 0;
    transition: all 0.5s ease;
    min-height: 520px;
  }

  .cards:hover .card:not(:hover) {
    flex: 0.85 1 0;
  }

  .card:hover {
    flex: 2 1 0;
  }

  .card__label {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    font-size: 22px;
    color: $accent-gold;
  }
}
</style>

