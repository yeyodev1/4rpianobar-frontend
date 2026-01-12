<script setup lang="ts">

const locations = [
  { id: 1, name: 'PIANO EN VIVO', image: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764170027/Foto_001_ztlntr.jpg' },
  { id: 2, name: 'CANTANTES', image: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171485/Imagen_002_1_nkcu4w.jpg' },
  { id: 3, name: 'TRIBUTOS', image: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764169930/food3_fmy8ca.jpg' },
  { id: 4, name: 'DJs & FIESTA', image: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171204/Foto_001_5_qtz4ad.jpg' },
]
</script>

<template>
  <section class="locations" id="cartelera">
    <h2 class="locations__title">MÚSICA & SHOW</h2>
    <div class="locations__intro">
      <p>Aquí no pones una playlist y listo. Cada noche tiene su propia energía.</p>
    </div>
    <div class="cards">
      <div
        v-for="loc in locations"
        :key="loc.id"
        class="card"
        :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${loc.image}')` }"
      >
        <div class="card__label">{{ loc.name }}</div>
      </div>
    </div>
    <div class="locations__footer">
      <p>Algunas son para cantar. Otras para bailar. Otras para mirar a alguien y brindar sin decir nada.</p>
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

.locations__intro,
.locations__footer {
  text-align: center;
  color: $gray-300;
  max-width: 60ch;
  margin: 16px auto;
  font-size: 1rem;
  line-height: 1.6;
}

.locations__footer {
  margin-top: 32px;
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
