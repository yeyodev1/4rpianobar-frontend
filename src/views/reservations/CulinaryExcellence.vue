<script setup lang="ts">
const title = 'UNA NUEVA DIMENSIÓN EN EXCELENCIA CULINARIA'
const body = 'Sumérgete en una atmósfera única donde los ritmos latinos cobran vida con DJ en vivo y percusionistas que crean la banda sonora perfecta para tu experiencia gastronómica.'

const facadeImage = 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764170812/Imagen_001_1_oyksp0.jpg'
const ambienceImage = 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764169852/food_erplqo.jpg'

const whatsappNumber = '593979279877'
const whatsappMessage = 'Hola, quiero vivir la experiencia en 4R Piano Bar'
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
</script>

<template>
  <section class="culinary">
    <div class="culinary__hero">
      <img :src="facadeImage" alt="Fachada nocturna con iluminación cálida" class="culinary__hero-image" />
    </div>

    <div class="culinary__content">
      <div class="culinary__text-col">
        <h2 class="culinary__title">{{ title }}</h2>
        <p class="culinary__paragraph">{{ body }}</p>
      </div>
      <figure class="culinary__media-col">
        <img :src="ambienceImage" alt="Percusión y ambiente nocturno" class="culinary__media-image" />
      </figure>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.culinary {
  position: relative;
  background: $text-dark
}

.culinary__hero {
  width: 100vw;
  margin-inline: calc(50% - 50vw);
  height: 300px;
  overflow: hidden;
  background: $gray-900
}

.culinary__hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block
}

.culinary__content {
  display: grid;
  gap: 16px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 16px
}

.culinary__text-col {
  display: grid;
  align-content: center;
  gap: 12px;
  text-align: center
}

.culinary__title {
  font-family: $font-principal;
  color: $accent-gold;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.1;
  font-size: 1.8rem
}

.culinary__paragraph {
  color: $gray-400;
  font-size: 1rem;
  line-height: 1.8
}

.culinary__media-col {
  border-radius: 16px;
  overflow: hidden;
  background: $gray-900
}

.culinary__media-image {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 16/10;
  object-fit: cover
}

.culinary__cta {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: $BRAND-GARNET;
  color: $white;
  border: 1px solid rgba($accent-gold, .4);
  border-radius: 12px;
  padding: 12px 16px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(0, 0, 0, .4)
}

.culinary__cta i {
  font-size: 18px
}

@media(min-width:1024px) {
  .culinary__hero {
    height: 60vh
  }

  .culinary__content {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 48px 24px
  }

  .culinary__text-col {
    text-align: left;
    padding-left: 64px
  }

  .culinary__title {
    font-size: 2.8rem;
    letter-spacing: 3px
  }

  .culinary__paragraph {
    font-size: 1.1rem
  }
}
</style>
