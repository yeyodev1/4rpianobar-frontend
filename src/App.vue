<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import HeaderBar from './components/layout/HeaderBar.vue'

const menuOpen = ref(false)
function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }
const router = useRouter()
const route = useRoute()
function gotoEvents() { closeMenu(); router.push({ name: 'events' }) }
function gotoHome() { closeMenu(); router.push({ name: 'home' }) }
function gotoCorporateEvents() { closeMenu(); router.push({ name: 'corporate-events' }) }
</script>

<template>
  <HeaderBar @toggle-menu="toggleMenu" />
  <div class="spacer" />

  <transition name="fade">
    <div v-if="menuOpen" class="overlay">
      <button class="close" aria-label="Cerrar" @click="closeMenu">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="content">
        <button v-if="route.name !== 'home'" class="overlay__link" @click="gotoHome">INICIO</button>
        <a href="https://drive.google.com/file/d/191kOyrBYhkcpR1BsyJsu16-L_yjgdgmY/view" target="_blank" class="overlay__link">MENÚ</a>
        <button v-if="route.name !== 'events'" class="overlay__link" @click="gotoEvents">EVENTOS</button>
        <button v-if="route.name !== 'corporate-events'" class="overlay__link" @click="gotoCorporateEvents">CORPORATIVO</button>
      </div>
    </div>
  </transition>

  <RouterView />
</template>

<style lang="scss" scoped>
.spacer {
  height: 64px;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.96);
  display: grid;
  place-items: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url('@/assets/static/restaurant/hero.png');
  background-size: cover;
  background-position: center;
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: $white;
}

.close i {
  font-size: 28px;
}

.content {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

.content h2 {
  font-family: $font-principal;
  color: $accent-gold;
  font-size: 32px;
  letter-spacing: 3px;
}

.overlay__link {
  font-family: $font-principal;
  color: $accent-gold;
  font-size: 32px;
  letter-spacing: 3px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
