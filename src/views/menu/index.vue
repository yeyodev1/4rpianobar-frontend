<script setup lang="ts">
import ExperienceHero from './ExperienceHero.vue'
import SectionSteak from './SectionSteak.vue'
import SectionDessert from './SectionDessert.vue'
import SectionMixology from './SectionMixology.vue'
import SectionCta from './SectionCta.vue'
import FooterSection from '../home/FooterSection.vue'

const images = {
  hero: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764169930/food3_fmy8ca.jpg',
  steak: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764169852/food_erplqo.jpg',
  dessert: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764170779/Foto_001_4_bii8jj.jpg',
  cocktail: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171006/007_Julio_yovh85.jpg',
}
</script>

<template>
  <ExperienceHero :image-src="images.hero" />

  <div class="menu__container">
    <SectionSteak :image-src="images.steak" />
    <SectionDessert :image-src="images.dessert" />
  </div>

  <SectionMixology :image-src="images.cocktail" />

  <SectionCta />
  <FooterSection />
</template>

<style lang="scss" scoped>
.menu__container {
  width: 100%;
  max-width: 1420px;
  margin: 0 auto;
}
</style>
