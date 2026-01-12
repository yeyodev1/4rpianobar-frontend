<script setup lang="ts">
type DisplayImage = { src: string; alt: string }

const eyebrow = 'UNA NOCHE ÚNICA'
const title = 'TRANSFORMAMOS TUS MOMENTOS EN RECUERDOS'
const body = 'Descubre una experiencia donde la música, el sabor y la elegancia se encuentran para crear la atmósfera perfecta que estabas buscando.'

const images: DisplayImage[] = [
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171204/Foto_001_5_qtz4ad.jpg', alt: 'Cena entre amigos con bengalas' },
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171485/Imagen_002_1_nkcu4w.jpg', alt: 'Show de bailarina de fuego' },
]

const mainImage = images[0]!
const whatsappHref = 'https://wa.me/593979279877'
const scheduleText = '7:00 PM – 3:00 AM'
const mapsHref = 'https://www.google.com/maps/place/4R+Piano+Bar/@-2.1384612,-79.8679898,17z/data=!3m1!4b1!4m6!3m5!1s0x902d6d6036bace83:0xcaf52612d9eac4a9!8m2!3d-2.1384666!4d-79.8654149!16s%2Fg%2F11ty26g7n1?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D'
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
      <div class="intro__bar">
        <div class="intro__bar-inner">
          <ul class="intro__bar-grid">
            <li>
              <a :href="whatsappHref" class="intro__bar-link" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
                <span class="intro__bar-label">WhatsApp</span>
                <span class="intro__bar-detail">+593 97 927 9877</span>
              </a>
            </li>
            <li>
              <div class="intro__bar-link">
                <i class="fa-solid fa-clock" aria-hidden="true"></i>
                <span class="intro__bar-label">Horarios</span>
                <span class="intro__bar-detail">{{ scheduleText }}</span>
              </div>
            </li>
            <li>
              <a :href="mapsHref" class="intro__bar-link" target="_blank" rel="noopener noreferrer">
                <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                <span class="intro__bar-label">Ubicación</span>
                <span class="intro__bar-detail">Abrir mapa</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
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
  gap: 0;
}

.intro__text {
  display: grid;
  gap: 10px;
  padding: 24px 16px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
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

.intro__bar {
  background: $BRAND-GARNET;
  color: $white;
  width: 100vw;
  margin-inline: calc(50% - 50vw)
}

.intro__bar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 24px
}

.intro__bar-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center
}

.intro__bar-grid>li {
  flex: 1 1 280px;
}

.intro__bar-link {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  gap: 6px 8px;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: $white
}

.intro__bar-link i {
  font-size: 20px;
  color: $accent-gold;
  grid-row: 1;
  grid-column: 1
}

.intro__bar-detail {
  color: $gray-400;
  font-size: 1rem;
  grid-column: 1 / -1;
  grid-row: 2;
  justify-self: center;
  text-align: center
}

.intro__bar-label {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  font-size: 1rem;
  color: $white;
  grid-row: 1;
  grid-column: 2
}

@media(min-width:1024px) {
  .intro__bar-grid {
    gap: 24px
  }

  .intro__bar-grid>li {
    flex: 0 0 340px
  }
}
</style>
