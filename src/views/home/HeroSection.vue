<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const hero1 = 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1769120623/Foto_3_de_FOTOS_WEB_ab65vz.png'
import hero2 from '@/assets/static/restaurant/hero2.jpg'
import hero3 from '@/assets/static/restaurant/hero3.jpg'

const images = [hero1, hero2, hero3]
const currentImageIndex = ref(0)
let intervalId: number | undefined

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length
}

onMounted(() => {
  intervalId = setInterval(nextImage, 5000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <section class="hero">
    <div class="hero__carousel">
      <transition-group name="fade">
        <div
          v-for="(img, index) in images"
          :key="img"
          v-show="currentImageIndex === index"
          class="hero__slide"
          :style="{ backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.4), rgba(10, 10, 10, 0.6)), url('${img}')` }"
        ></div>
      </transition-group>
    </div>

    <div class="overlay-hero">
      <h1 class="title">AQUÍ SIEMPRE TIENES LA RAZÓN</h1>
      <div class="hero__actions">
        <a href="https://wa.me/593979279877" target="_blank" class="hero__btn hero__btn--primary">
          RESERVAR MESA
        </a>
        <a href="https://script.google.com/macros/s/AKfycbzftqJLMjTB_ufEOLR27V8NRYwN3xEx1DnJjVgYhPM2-IVWULZ2dT7jH0wK1iBv7T-T/exec" target="_blank" class="hero__btn hero__btn--secondary">
          VER CARTELERA
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.hero {
  position: relative;
  min-height: 90vh;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.hero__carousel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero__slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.overlay-hero {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 24px;
}

@media (max-width: 419px) {
  .overlay-hero {
    padding: 0;
  }
}

.overlay-hero .title {
  font-family: $font-principal;
  color: $white;
  letter-spacing: 2px;
  font-size: 32px;
  margin-bottom: 24px;
}

.subtitle-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}

.subtitle {
  color: $gray-300;
  letter-spacing: 2px;
  font-size: 16px;
  margin: 0;
}

.subtitle-highlight {
  color: $accent-gold;
  letter-spacing: 2px;
  font-size: 18px;
  font-weight: 600;
  margin-top: 8px;
}

.hero__actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.hero__btn {
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 1px;
  text-decoration: none;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 240px;
  font-size: 14px;
}

.hero__btn--primary {
  background: $BRAND-BURGUNDY;
  color: $white;
}

.hero__btn--primary:hover {
  background: color.scale($BRAND-BURGUNDY, $lightness: 10%);
}

.hero__btn--secondary {
  border: 1px solid $accent-gold;
  color: $accent-gold;
}

.hero__btn--secondary:hover {
  background: rgba($accent-gold, 0.1);
}

/* Transition Effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .overlay-hero .title {
    font-size: 56px;
  }

  .subtitle {
    font-size: 20px;
  }

  .subtitle-highlight {
    font-size: 24px;
  }

  .hero__actions {
    flex-direction: row;
    justify-content: center;
  }

  .hero__btn {
    width: auto;
  }
}
</style>
