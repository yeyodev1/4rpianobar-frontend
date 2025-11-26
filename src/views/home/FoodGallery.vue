<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type GalleryItem = { src: string; alt: string }

const items: GalleryItem[] = [
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764169930/food3_fmy8ca.jpg', alt: 'Plato gourmet de pescado' },
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764169855/food2_bhirci.jpg', alt: 'Cóctel tropical naranja' },
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764169852/food_erplqo.jpg', alt: 'Corte de carne asada' },
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764170027/Foto_001_ztlntr.jpg', alt: 'Baterista en música en vivo' }
]
const track = ref<HTMLDivElement | null>(null)
const canLeft = ref(false)
const canRight = ref(true)
const clickedIndex = ref<number | null>(null)

function updateControls() {
  const el = track.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  const x = el.scrollLeft
  canLeft.value = x > 0
  canRight.value = x < max - 1
}

function scrollRight() {
  if (track.value) {
    track.value.scrollBy({ left: 340, behavior: 'smooth' })
    setTimeout(updateControls, 200)
  }
}

function scrollLeft() {
  if (track.value) {
    track.value.scrollBy({ left: -340, behavior: 'smooth' })
    setTimeout(updateControls, 200)
  }
}

function onCardClick(i: number) {
  clickedIndex.value = i
  setTimeout(() => { if (clickedIndex.value === i) clickedIndex.value = null }, 280)
}

onMounted(() => {
  updateControls()
  const el = track.value
  if (el) el.addEventListener('scroll', updateControls, { passive: true })
  window.addEventListener('resize', updateControls)
})

onUnmounted(() => {
  const el = track.value
  if (el) el.removeEventListener('scroll', updateControls)
  window.removeEventListener('resize', updateControls)
})
</script>

<template>
  <section class="food-gallery">
    <div class="food-gallery__container">
      <h2 class="food-gallery__title">DEVOCIÓN POR LA GRAN COMIDA</h2>

      <div ref="track" class="food-gallery__track">
        <figure
          v-for="(item, i) in items"
          :key="i"
          class="food-gallery__card"
          :class="{ 'is-zoomed': clickedIndex === i }"
          @click="onCardClick(i)"
        >
          <img :src="item.src" :alt="item.alt" class="food-gallery__image" loading="lazy" />
        </figure>
      </div>

      <button class="food-gallery__nav food-gallery__nav--left" aria-label="Anterior" @click="scrollLeft" v-show="canLeft">
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <button class="food-gallery__nav food-gallery__nav--right" aria-label="Siguiente" @click="scrollRight" v-show="canRight">
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.food-gallery {
  position: relative;
  background: $text-dark;
  padding: 0 1rem 1.5rem;
  display: grid;
  gap: 1.5rem;

  &__container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

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

  &__track {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  &__track::-webkit-scrollbar {
    display: none;
  }

  &__card {
    flex: 0 0 auto;
    min-width: 82%;
    scroll-snap-align: center;
    border-radius: 16px;
    overflow: hidden;
    background: $gray-900;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    cursor: pointer;
  }

  &__image {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 1 / 1.1;
    object-fit: cover;
    transition: transform 260ms ease, filter 260ms ease;
  }

  &__card:hover &__image {
    transform: scale(1.015);
    filter: brightness(1.02);
  }

  .is-zoomed &__image {
    transform: scale(1.06);
    filter: brightness(1.06);
  }

  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: none;
    align-items: center;
    justify-content: center;
    border: none;
    background: $white;
    color: #000000;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
    border: 1px solid rgba($gray-300, 0.35);
    cursor: pointer;
  }

  &__nav--left {
    left: 16px;
  }

  &__nav--right {
    right: 16px;
  }
}

@media (min-width: 768px) {
  .food-gallery {
    padding: 0 2rem 2rem;

    &__title {
      font-size: 2rem;
      margin-bottom: 2rem;
      letter-spacing: 3px;
    }

    &__track {
      overflow-x: hidden;
    }

    &__card {
      min-width: 0;
      width: 300px;
      height: 300px;
    }

    &__nav {
      display: flex;
      width: 48px;
      height: 48px;
    }

    &__nav--left {
      left: 24px;
    }

    &__nav--right {
      right: 24px;
    }
  }
}
</style>
