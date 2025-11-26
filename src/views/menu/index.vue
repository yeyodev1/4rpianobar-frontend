<script setup lang="ts">
</script>

<template>
  <section class="menu">
    <div class="menu__container">
      <h1 class="menu__title">MENÚ</h1>
      <p class="menu__subtitle">Explora nuestra selección latina de comidas y bebidas.</p>

      <div class="menu__grid">
        <article class="menu__card">
          <h3 class="menu__card-title">Entradas</h3>
          <p class="menu__card-text">Ceviches, arepas, tapas latinas.</p>
        </article>
        <article class="menu__card">
          <h3 class="menu__card-title">Platos Fuertes</h3>
          <p class="menu__card-text">Cortes, pescados, especialidades de la casa.</p>
        </article>
        <article class="menu__card">
          <h3 class="menu__card-title">Cócteles</h3>
          <p class="menu__card-text">Recetas originales y clásicos con giro latino.</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.menu {
  background: $text-dark;
  padding: 3rem 1rem 4rem;

  &__container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    gap: 1.5rem;
    text-align: center;
  }

  &__title {
    font-family: $font-principal;
    color: $accent-gold;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 1.75rem;
  }

  &__subtitle {
    color: $gray-300;
    font-size: 1rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  &__card {
    background: $gray-900;
    border-radius: 12px;
    padding: 16px;
    text-align: left;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
  }

  &__card-title {
    color: $white;
    font-weight: 700;
    margin-bottom: 6px;
  }

  &__card-text {
    color: $gray-400;
    font-size: 0.95rem;
  }
}

@media (min-width: 768px) {
  .menu {
    padding: 4rem 2rem 6rem;

    &__title {
      font-size: 2.25rem;
    }

    &__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.25rem;
    }
  }
}
</style>

