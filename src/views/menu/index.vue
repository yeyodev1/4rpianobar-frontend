<script setup lang="ts">
import ExperienceHero from './ExperienceHero.vue'
import MenuCategory from './MenuCategory.vue'
import MenuTieredDrink from './MenuTieredDrink.vue'
import FooterSection from '../home/FooterSection.vue'
import { menuData } from '@/constants/menu'

const heroImage = 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764169930/food3_fmy8ca.jpg'
</script>

<template>
  <div class="menu-page">
    <ExperienceHero :image-src="heroImage" />

    <main class="menu-content">
      <template v-for="(cat, idx) in menuData" :key="idx">
        <MenuCategory 
          v-if="cat.type === 'standard' || cat.type === 'specials'" 
          :category="cat" 
        />
        <MenuTieredDrink 
          v-else-if="cat.type === 'tiered-drink'" 
          :category="cat" 
        />
      </template>

      <div class="menu-footer-note">
        <p>Precios incluyen impuestos y servicio</p>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<style lang="scss" scoped>
.menu-page {
  background: $text-dark;
  min-height: 100vh;
}

.menu-content {
  padding: 2rem 0;
  display: grid;
  gap: 2rem;
}

.menu-footer-note {
  text-align: center;
  padding: 2rem;
  color: $gray-500;
  font-size: 0.9rem;
  font-style: italic;
  border-top: 1px solid rgba($accent-gold, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .menu-content {
    padding: 4rem 0;
    gap: 4rem;
  }
}
</style>
