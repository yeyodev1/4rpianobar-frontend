<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const hero1 = 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1769120623/Foto_3_de_FOTOS_WEB_ab65vz.png'
import hero2 from '@/assets/static/restaurant/hero2.jpg'
import hero3 from '@/assets/static/restaurant/hero3.jpg'

const images = [hero1, hero2, hero3]
const currentImageIndex = ref(0)
let intervalId: number | undefined

// Cartelera State
const showCarteleraModal = ref(false)
const loadingCartelera = ref(false)
const finalCarteleraUrl = ref('')
const folderUrl = 'https://drive.google.com/drive/folders/1pyQuPLgBbwE-IoFxDj9aFfsIAObM7Lur?usp=sharing'

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length
}

const openCartelera = async () => {
  showCarteleraModal.value = true
  loadingCartelera.value = true
  finalCarteleraUrl.value = '' // Reset previous

  const scriptUrl = 'https://script.google.com/macros/s/AKfycbyhgd1WUBvN4_L422E-tFP4hNWluKKDgiJdkZ0EYJ_hQzfp44N4AQOdsK6QGHoB-sy7/exec'

  try {
    const response = await fetch(scriptUrl)
    const data = await response.json()

    if (data && data.url) {
      finalCarteleraUrl.value = data.url
      // Intentamos abrirlo automáticamente
      const popup = window.open(data.url, '_blank')

      // Si el popup es bloqueado (popup es null o tiene propiedades restringidas), el modal se mantiene útil
      if (!popup || popup.closed || typeof popup.closed == 'undefined') {
        console.warn('Posible bloqueo de popup')
      }
    } else {
      throw new Error('No se obtuvo URL válida')
    }
  } catch (error) {
    console.warn('Falló la obtención, usando respaldo', error)
    finalCarteleraUrl.value = folderUrl
    // window.open(folderUrl, '_blank') // Opcional: auto-abrir fallback
  } finally {
    loadingCartelera.value = false
  }
}

const closeModal = () => {
  showCarteleraModal.value = false
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
        <button @click="openCartelera" class="hero__btn hero__btn--secondary cartelera-btn">
          VER CARTELERA
        </button>
      </div>
    </div>
    
    <!-- Modal de Carga / Confirmación -->
    <transition name="fade">
      <div v-if="showCarteleraModal" class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
          
          <div v-if="loadingCartelera" class="modal-body loading-state">
            <div class="spinner"></div>
            <p>Buscando cartelera actual...</p>
          </div>
          
          <div v-else class="modal-body ready-state">
            <i class="fa-solid fa-circle-check icon-success"></i>
            <h3>¡Encontrada!</h3>
            <p class="info-text">Abriendo cartelera...</p>
            
            <div class="warning-box">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <p>Si no se abrió automáticamente, es posible que tengas un bloqueador de anuncios.</p>
            </div>
            
            <a :href="finalCarteleraUrl" target="_blank" class="manual-btn" @click="closeModal">
              ABRIR MANUALMENTE
            </a>
          </div>
        </div>
      </div>
    </transition>
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

.cartelera-btn {
  cursor: pointer;
  display: inline-block;
  text-align: center;
  background: transparent;
  font-family: inherit;
  /* Inherit font from parent/button reset if needed, mostly handled by hero__btn */
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal-content {
  background: #111;
  border: 1px solid $accent-gold;
  border-radius: 16px;
  padding: 32px 24px;
  width: 100%;
  max-width: 400px;
  position: relative;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: $gray-400;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: $white;
  }
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba($accent-gold, 0.3);
  border-radius: 50%;
  border-top-color: $accent-gold;
  animation: spin 1s ease-in-out infinite;
}

.loading-state p {
  color: $white;
  font-size: 1.1rem;
  margin: 0;
}

.icon-success {
  font-size: 3rem;
  color: $accent-gold;
  margin-bottom: 8px;
}

.ready-state h3 {
  font-family: $font-principal;
  color: $white;
  font-size: 1.5rem;
  margin: 0;
}

.info-text {
  color: $gray-300;
  margin: 0;
}

.warning-box {
  background: rgba(255, 193, 7, 0.1);
  /* Gold/Amber with opacity */
  border: 1px solid rgba(255, 193, 7, 0.3);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
  text-align: left;
  margin: 8px 0;

  i {
    color: #FFC107;
    font-size: 1.2rem;
  }

  p {
    color: $gray-300;
    font-size: 0.85rem;
    margin: 0;
    line-height: 1.4;
  }
}

.manual-btn {
  display: inline-block;
  background: $BRAND-BURGUNDY;
  color: $white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 8px;
  width: 100%;
  transition: background 0.3s;

  &:hover {
    background: color.scale($BRAND-BURGUNDY, $lightness: 10%);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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
