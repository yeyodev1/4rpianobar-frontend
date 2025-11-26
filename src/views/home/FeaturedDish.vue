<script setup lang="ts">
import heroImg from '@/assets/static/restaurant/hero.jpg'
</script>

<template>
  <article class="card">
    <div class="card__image-container">
      <img :src="heroImg" alt="Plato destacado" class="card__image" />
    </div>
    <div class="card__content">
      <h3 class="card__title">SABOREA LA PASIÓN DE LATINOAMÉRICA EN CADA BOCADO</h3>
      <p class="card__text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus porta, nibh quis
        interdum ultricies, urna velit placerat lectus, at cursus orci mauris nec tortor. Sed
        posuere, sapien vitae dictum tristique, nibh nisl fermentum elit, quis posuere nisl
        lectus non massa.
      </p>
      <a href="#" class="card__link">Menú completo <i class="fa-solid fa-arrow-right"></i></a>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.card {
  display: flex;
  flex-direction: column;
  width: 92%;
  max-width: 1100px;
  margin: 12px auto;
  border-radius: 24px;
  overflow: hidden;
  background: transparent;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.card__image-container {
  width: 100%;
  aspect-ratio: 4 / 3;
}

.card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card__content {
  background: linear-gradient(135deg, $BRAND-GARNET 0%, $BRAND-BURGUNDY 100%);
  color: $white;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
}

.card__title {
  font-family: 'Playfair Display', serif;
  color: #E8C889;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 24px;
  line-height: 1.2;
  margin: 0;
}

.card__text {
  color: $gray-300;
  line-height: 1.6;
  margin-top: 12px;
  max-width: 52ch;
}

.card__link {
  color: $accent-gold;
  text-decoration: none;
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.card__link:hover {
  color: color.scale($accent-gold, $lightness: 8%);
}

@media (min-width: 768px) {
  .card {
    flex-direction: row;
    min-height: 400px;
    width: 88%;
    max-width: 1200px;
    border-radius: 28px;
  }

  .card__image-container {
    flex: 0 0 48%;
  }

  .card__content {
    flex: 1;
    padding: 4rem;
    align-items: flex-start;
    text-align: left;
  }

  .card__title {
    font-size: 34px;
  }
}
</style>
