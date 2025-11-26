<script setup lang="ts">
const props = defineProps({
  imageSrc: { type: String, required: true },
})
</script>

<template>
  <section class="culinary-section culinary-section--dessert">
    <div class="culinary-section__grid culinary-section__grid--reverse">
      <div class="culinary-section__text">
        <h2 class="culinary-section__title">FINALES TAN DULCES</h2>
        <p class="culinary-section__body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum, arcu non dictum condimentum, lorem nunc congue lacus, nec dictum lacus arcu at orci. Donec placerat, sapien at efficitur fermentum, justo nulla aliquet nibh.</p>
      </div>
      <figure class="culinary-section__media">
        <img :src="props.imageSrc" alt="Postre" class="culinary-section__image" loading="lazy" />
      </figure>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.culinary-section {
  background: $text-dark;
  padding: 2.5rem 1rem;

  &__grid { display: grid; gap: 16px; }
  &__grid--reverse { }

  &__media { border-radius: 16px; overflow: hidden; background: $gray-900; }
  &__image { width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; display: block; }

  &__text { display: grid; gap: 8px; }
  &__title { font-family: $font-principal; color: $accent-gold; font-size: 1.4rem; letter-spacing: 2px; text-transform: uppercase; }
  &__body { color: $gray-300; font-size: 0.95rem; line-height: 1.7; }
}

@media (min-width: 768px) {
  .culinary-section {
    padding: 3.5rem 2rem;
    &__grid { grid-template-columns: 0.85fr 1.15fr; align-items: center; gap: 24px; }
    &__title { font-size: 2rem; letter-spacing: 3px; }
  }
}
</style>

