<script setup lang="ts">
import { ref } from 'vue'
import FeaturedDish from './FeaturedDish.vue'
import HeroSection from './HeroSection.vue'
import HeaderBar from '../../components/layout/HeaderBar.vue'

const menuOpen = ref(false)
function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }
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
        <h2>MENU</h2>
        <h2>RESERVATIONS</h2>
      </div>
    </div>
  </transition>

  <HeroSection />

  <main>
    <section class="intro">
      <h2>SIENTE LA FIESTA, VIVE LA EXPERIENCIA</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga sint expedita facilis optio odit, velit blanditiis autem labore laborum similique sit quaerat eum natus temporibus accusamus, voluptatum dicta delectus modi?
        Doloribus aut vitae repellat id odit praesentium rem hic accusantium amet, earum ipsa nostrum repudiandae eius, facere cum? Aliquam culpa maxime laboriosam omnis maiores asperiores modi tempore aliquid quam saepe?
        Doloribus nam vitae eveniet dignissimos facilis a iste consequatur vero veniam sed esse, aliquam blanditiis impedit tenetur fugit hic? Eaque, iste? Consequuntur, id nihil. Omnis quo impedit rem quam itaque!
      </p>
    </section>

    <FeaturedDish />

    <section class="gallery">
      <div class="card" /><div class="card" /><div class="card" />
    </section>
  </main>
</template>

<style lang="scss" scoped>
/* navbar styles moved to HeaderBar.vue */

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
  background-image: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url('@/assets/static/restaurant/hero.jpg');
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
}

.content h2 {
  font-family: $font-principal;
  color: $accent-gold;
  font-size: 32px;
  letter-spacing: 3px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


main {
  display: grid;
  gap: 48px;
}

.intro {
  padding: 16px 20px;
}

.intro h2 {
  font-family: $font-principal;
  color: $BRAND-BURGUNDY;
  font-size: 1.6rem;
  line-height: 1.2;
}

.intro p {
  color: $gray-300;
  font-size: 0.95rem;
  line-height: 1.7;
  max-width: 60ch;
  width: 100%;
  margin: 12px auto 0;
  overflow-wrap: anywhere;
  hyphens: auto;
}


.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 24px;
}

.gallery .card {
  min-height: 160px;
  background-image: linear-gradient(rgba(10, 10, 10, 0.5), rgba(10, 10, 10, 0.7)), url('@/assets/static/restaurant/hero.jpg');
  background-size: cover;
  background-position: center;
}

@media (min-width: 768px) {
  .content h2 {
    font-size: 48px;
  }



  .intro {
    text-align: center;
    padding: 24px;
  }

  .intro h2 {
    font-size: 2.25rem;
  }

  .intro p {
    font-size: 1.05rem;
    max-width: 70ch;
  }
}
</style>
