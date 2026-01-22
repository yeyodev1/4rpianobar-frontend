<script setup lang="ts">
</script>

<template>
  <article class="card">
    <div class="card__image-container">
      <img src="https://res.cloudinary.com/dpimsaaa4/image/upload/v1769110887/Co%CC%81ctel_de_Autor_2_hht2wh.jpg" alt="Cocteles en 4R" class="card__image" />
    </div>
    <div class="card__content">
      <h3 class="card__title">LOS TRAGOS</h3>
      <p class="card__text">
        Los tragos no son solo para tomar. Son parte del show. Hay clásicos bien hechos. Hay cocteles que salen humeando.
      </p>
      <p class="card__text">
        Hay otros que llegan encendidos, perfumados, contados. Te los sirven, te los explican, los ves nacer. Y sí… saben tan bien como se ven.
      </p>
      <a href="https://drive.google.com/file/d/191kOyrBYhkcpR1BsyJsu16-L_yjgdgmY/view" target="_blank" rel="noopener" class="card__link" aria-label="Ver carta de tragos">
        Ver carta <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.card {
  display: flex;
  flex-direction: column;
  width: 92%;
  max-width: 1420px;
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
    max-width: 1420px;
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
