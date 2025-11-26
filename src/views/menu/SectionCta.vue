<script setup lang="ts">
</script>

<template>
  <section class="cta-final">
    <div class="cta-final__container">
      <h2 class="cta-final__title">RESERVA TU VIAJE CULINARIO</h2>
      <p class="cta-final__subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in ligula nec lectus porta imperdiet.</p>
      <a
        class="cta-final__btn"
        href="https://wa.me/?text=Quiero%20reservar%20en%204R%20Piano%20Bar"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Reservar ahora por WhatsApp"
      >
        <i class="fa-brands fa-whatsapp"></i>
        RESERVAR AHORA
      </a>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.cta-final {
  background: $text-dark;
  padding: 3rem 1rem 4rem;

  &__container {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
    display: grid;
    gap: 1rem;
  }

  &__title {
    font-family: $font-principal;
    color: $accent-gold;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 1.6rem;
  }

  &__subtitle {
    color: $gray-300;
    font-size: 0.95rem;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 24px;
    border-radius: 999px;
    text-decoration: none;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: $white;
    background: linear-gradient(135deg, $BRAND-GARNET 0%, $BRAND-BURGUNDY 100%);
    border: 1px solid rgba($accent-gold, 0.6);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35), 0 0 0 2px rgba($white, 0.02) inset;
    transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease;
    cursor: pointer;
  }

  &__btn:hover {
    filter: brightness(1.06);
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.4);
  }

  &__btn:active {
    transform: translateY(1px);
  }
}

@media (min-width: 768px) {
  .cta-final {
    padding: 4rem 2rem 6rem;

    &__title {
      font-size: 2.25rem;
    }

    &__subtitle {
      font-size: 1.05rem;
    }

    &__btn {
      padding: 14px 30px;
      font-size: 0.95rem;
      max-width: 400px;
      margin: 0 auto;
    }
  }
}
</style>
