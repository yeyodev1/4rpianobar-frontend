<script setup lang="ts">
const props = defineProps({
  imageSrc: { type: String, required: true },
})
</script>

<template>
  <section class="experience-hero" :style="{ backgroundImage: `url(${props.imageSrc})` }">
    <div class="experience-hero__overlay">
      <div class="experience-hero__content">
        <h1 class="experience-hero__title">EL MUNDO DE 4R PIANO BAR</h1>
        <p class="experience-hero__subtitle">POR GRUPO 4R</p>
        <a
          class="experience-hero__cta"
          href="https://wa.me/?text=Quiero%20reservar%20en%204R%20Piano%20Bar"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="fa-brands fa-whatsapp"></i>
          RESERVAR AHORA
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.experience-hero {
  position: relative;
  background-size: cover;
  background-position: center;
  min-height: 90dvh;

  &__overlay {
    position: relative;
    min-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__overlay::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.25));
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 16px;
    text-align: center;
  }

  &__title {
    font-family: $font-principal;
    color: $accent-gold;
    font-size: 2rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
  }

  &__subtitle {
    color: $gray-300;
    font-size: 0.95rem;
    margin-top: 8px;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.45);
  }

  &__cta {
    margin-top: 16px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 22px;
    border-radius: 999px;
    text-decoration: none;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: $white;
    background: linear-gradient(135deg, $BRAND-GARNET 0%, $BRAND-BURGUNDY 100%);
    border: 1px solid rgba($accent-gold, 0.6);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35), 0 0 0 2px rgba($white, 0.02) inset;
    backdrop-filter: blur(2px);
  }

  &__cta i {
    font-size: 18px;
  }
}

@media (min-width: 768px) {
  .experience-hero {
    min-height: 90dvh;
    background-attachment: fixed;

    &__title {
      font-size: 3rem;
    }

    &__subtitle {
      font-size: 1.1rem;
    }

    &__cta {
      margin-top: 22px;
      padding: 14px 28px;
      font-size: 0.95rem;
      transform: translateZ(0);
    }
  }
}
</style>
