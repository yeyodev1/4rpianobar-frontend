<script setup lang="ts">
const props = defineProps({
  imageSrc: { type: String, required: true },
})
</script>

<template>
  <section class="mixology">
    <div class="mixology__container">
      <h2 class="mixology__title">ARTE LÍQUIDO, ALMA LATINA</h2>
      <p class="mixology__body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus, turpis at dictum porttitor, justo erat viverra justo, id malesuada elit tortor id nulla. Etiam ac lorem lacus. Sed at risus et augue vulputate venenatis.</p>
      <figure class="mixology__media">
        <img :src="props.imageSrc" alt="Cóctel" class="mixology__image" loading="lazy" />
      </figure>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.mixology {
  background: $text-dark;
  padding: 3rem 1rem;

  &__container { width: 100%; max-width: 1200px; margin: 0 auto; text-align: center; display: grid; gap: 1rem; }
  &__title { font-family: $font-principal; color: $accent-gold; text-transform: uppercase; letter-spacing: 3px; font-size: 1.6rem; }
  &__body { color: $gray-300; font-size: 0.95rem; max-width: 65ch; margin: 0 auto; }

  &__media { border-radius: 16px; overflow: hidden; background: $gray-900; }
  &__image { width: 100%; height: auto; display: block; aspect-ratio: 16 / 9; object-fit: cover; }
}

@media (min-width: 768px) {
  .mixology {
    padding: 4rem 2rem;
    &__title { font-size: 2.25rem; }
    &__body { font-size: 1.05rem; }
  }
}
</style>

