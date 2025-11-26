<script setup lang="ts"></script>

<template>
  <section class="hero">
    <div class="overlay-hero">
      <h1 class="title">UN TRIBUTO A LA CULTURA LATINOAMERICANA</h1>
      <p><i class="fa-solid fa-music"></i> POR GRUPO 4R</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 70vh;
  background-image: linear-gradient(rgba(10, 10, 10, 0.4), rgba(10, 10, 10, 0.6)), url('@/assets/static/restaurant/hero.jpg');
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
  font-size: 28px;
}

.overlay-hero p {
  color: $accent-gold;
  letter-spacing: 3px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.overlay-hero p i {
  font-size: 12px;
}

@media (min-width: 768px) {
  .overlay-hero .title {
    font-size: 42px;
  }

  .overlay-hero p {
    font-size: 14px;
  }
}
</style>

