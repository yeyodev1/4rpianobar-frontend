<script setup lang="ts"></script>

<template>
  <section class="hero">
    <div class="overlay-hero">
      <h1 class="title">SIEMPRE TIENES LA RAZÓN</h1>
      <div class="subtitle-container">
        <p class="subtitle">Salir hoy.</p>
        <p class="subtitle">Brindar hoy.</p>
        <p class="subtitle">Celebrar hoy.</p>
        <p class="subtitle">Venir a 4R.</p>
        <p class="subtitle-highlight">Y sí: es una buena idea.</p>
      </div>
      <div class="hero__actions">
        <a href="https://wa.me/593979279877" target="_blank" class="hero__btn hero__btn--primary">
          RESERVAR MESA
        </a>
        <a href="#cartelera" class="hero__btn hero__btn--secondary">
          VER CARTELERA
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.hero {
  position: relative;
  min-height: 90vh;
  background-image: linear-gradient(rgba(10, 10, 10, 0.4), rgba(10, 10, 10, 0.6)), url('@/assets/static/restaurant/hero.png');
  background-size: cover;
  background-position: center;
  display: grid;
  place-items: center;
}

.overlay-hero {
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

