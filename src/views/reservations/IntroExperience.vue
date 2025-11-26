<script setup lang="ts">
type DisplayImage = { src: string; alt: string }

const eyebrow = 'MEJORES RESTAURANTES EN CIUDAD'
const title = 'LA EXPERIENCIA GASTRONÓMICA LATINA DEFINITIVA'
const body = 'Descubre una experiencia gastronómica única donde la arquitectura vanguardista se fusiona con la excelencia culinaria, creando momentos inolvidables en el corazón de la ciudad.'

const images: DisplayImage[] = [
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171204/Foto_001_5_qtz4ad.jpg', alt: 'Cena entre amigos con bengalas' },
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171485/Imagen_002_1_nkcu4w.jpg', alt: 'Show de bailarina de fuego' },
]

const mainImage = images[0]!
</script>

<template>
  <section class="intro">
    <div class="intro__container">
      <div class="intro__text">
        <span class="intro__eyebrow">{{ eyebrow }}</span>
        <h2 class="intro__title">{{ title }}</h2>
        <p class="intro__body">{{ body }}</p>
      </div>

      <figure class="intro__media">
        <img :src="mainImage.src" :alt="mainImage.alt" class="intro__image" />
      </figure>
    </div>

    <button type="button" class="intro__nye" aria-label="New Year Eve">
      <i class="fa-solid fa-champagne-glasses"></i>
      <span>NYE</span>
    </button>
  </section>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.intro {
  position: relative;
  background: $text-dark
}

.intro__container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

.intro__text {
  display: grid;
  gap: 10px;
  padding: 20px 8px;
  max-width: 1440px;
}

.intro__eyebrow {
  font-family: $font-interface;
  color: color.scale($accent-gold, $lightness: -10%);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: .8rem
}

.intro__title {
  font-family: $font-principal;
  color: $accent-gold;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.1;
  font-size: 1.6rem
}

.intro__body {
  color: $gray-300;
  font-size: .95rem;
  line-height: 1.7
}

.intro__media {
  border-radius: 0;
  overflow: visible;
  background: $gray-900;
  width: 100vw;
  margin-inline: calc(50% - 50vw);
  margin-bottom: 0
}

.intro__image {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  display: block
}

.intro__nye {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  background: $BRAND-BURGUNDY;
  color: $white;
  border: 1px solid rgba($accent-gold, 0.4);
  border-radius: 12px;
  padding: 12px 16px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(0, 0, 0, .4)
}

.intro__nye i {
  font-size: 18px
}

.intro__bar {
  background: $BRAND-GARNET;
  color: $white
}

.intro__bar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 16px
}

.intro__bar-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px
}

.intro__bar-link {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  text-decoration: none;
  color: $white
}

.intro__bar-link i {
  font-size: 16px
}

.intro__bar-detail {
  color: $gray-400;
  font-size: .9rem
}

@media(min-width:1024px) {
  .intro__bar-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px
  }
}
</style>
