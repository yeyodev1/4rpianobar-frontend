<script setup lang="ts">
const whatsappNumber = '593979279877'
const whatsappMessage = 'Hola, deseo reservar en 4R Piano Bar'
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
</script>

<template>
  <section class="not-found">
    <div class="not-found__container">
      <h1 class="not-found__title">Página no encontrada</h1>
      <p class="not-found__subtitle">La ruta solicitada no existe o fue movida.</p>

      <RouterLink to="/" class="not-found__cta" aria-label="Volver al inicio">
        Volver al inicio
      </RouterLink>

      <a :href="whatsappHref" target="_blank" rel="noopener" class="not-found__cta not-found__cta--whatsapp" aria-label="Reservar ahora">
        Reservar ahora
      </a>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.not-found {
  background: $text-dark;
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
}

.not-found__container {
  width: 100%;
  max-width: 720px;
  display: grid;
  gap: 12px;
  text-align: center;
}

.not-found__title {
  font-family: $font-principal;
  color: $accent-gold;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.6rem;
}

.not-found__subtitle {
  color: $gray-300;
}

.not-found__cta {
  display: inline-block;
  margin: 12px auto 0;
  padding: 12px 18px;
  border-radius: 10px;
  background: $BRAND-GARNET;
  color: $white;
  text-decoration: none;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, .35);
}

.not-found__cta--whatsapp {
  margin-top: 8px;
}

@media (min-width: 1024px) {
  .not-found {
    min-height: 70vh;
  }

  .not-found__title {
    font-size: 2rem;
    letter-spacing: 3px;
  }
}
</style>
