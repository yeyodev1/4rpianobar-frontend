<script setup lang="ts">
type AtmosphereImage = { src: string; alt: string }

const images: AtmosphereImage[] = [
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171204/Foto_001_5_qtz4ad.jpg', alt: 'Cena entre amigos con bengalas' },
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171485/Imagen_002_1_nkcu4w.jpg', alt: 'Show de bailarina de fuego' }
]
</script>

<template>
  <section class="atmosphere">
    <h2 class="atmosphere__title">CENA, BAILA, DISFRUTA: AL ESTILO LATINO</h2>
    <div class="atmosphere__grid">
      <figure v-for="(img, idx) in images" :key="idx" class="atmosphere__card">
        <img :src="img.src" :alt="img.alt" class="atmosphere__image" loading="lazy" />
      </figure>
    </div>
  </section>
  
</template>

<style lang="scss" scoped>
.atmosphere {
  background: $text-dark;
  display: grid;
  gap: 1.5rem;
  width: 80%;
  margin: 0 auto;

  &__title {
    font-family: $font-principal;
    color: $accent-gold;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1.25rem;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  &__card {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    background: $gray-900;
  }

  &__image {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    transition: transform 250ms ease, filter 250ms ease;
  }

  &__card:hover &__image {
    transform: scale(1.02);
    filter: brightness(1.05);
  }
}

@media (min-width: 768px) {
  .atmosphere {

    &__title {
      font-size: 2rem;
      margin-bottom: 2rem;
      letter-spacing: 3px;
    }

    &__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
  }
}
</style>
