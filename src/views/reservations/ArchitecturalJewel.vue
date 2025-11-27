<script setup lang="ts">
type JewelImage = { src: string; alt: string }

const header = 'UNA JOYA ARQUITECTÓNICA'
const subtitle = 'COCINA LATINA REDEFINIDA'
const paragraph = 'Cada plato es una obra maestra que combina técnicas contemporáneas con sabores auténticos latinoamericanos.'

const images: JewelImage[] = [
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764170812/Imagen_001_1_oyksp0.jpg', alt: 'Plato gourmet' },
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764170856/Imagen_001_2_lltzgr.jpg', alt: 'Chef emplatando' },
  { src: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764170779/Foto_001_4_bii8jj.jpg', alt: 'Salmón a la parrilla' },
]
</script>

<template>
  <section class="jewel">
    <h2 class="jewel__header">{{ header }}</h2>
    <div class="jewel__container">
      <div class="jewel__images">
        <div v-for="(img, i) in images" :key="i" class="jewel__card">
          <img :src="img.src" :alt="img.alt" class="jewel__image" />
        </div>
      </div>
      <div class="jewel__text">
        <h3 class="jewel__subtitle">{{ subtitle }}</h3>
        <p class="jewel__paragraph">{{ paragraph }}</p>
        <RouterLink to="/menu" class="jewel__btn" aria-label="Ver menú completo">MENÚ COMPLETO →</RouterLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.jewel {
  background: $text-dark;
  position: relative
}

.jewel__header {
  font-family: $font-principal;
  color: $accent-gold;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  margin: 0 0 16px;
  font-size: 20px
}

.jewel__container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
  padding: 0 16px 24px
}

.jewel__images {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
  scroll-snap-type: x mandatory
}

.jewel__card {
  flex: 0 0 80vw;
  border-radius: 12px;
  overflow: hidden;
  background: $gray-900;
  scroll-snap-align: center
}

.jewel__image {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 3/4;
  object-fit: cover
}

.jewel__text {
  display: grid;
  gap: 12px;
  text-align: center
}

.jewel__subtitle {
  font-family: $font-principal;
  color: $accent-gold;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.1rem
}

.jewel__paragraph {
  color: $gray-300;
  line-height: 1.8;
  font-size: 1rem
}

.jewel__btn {
  background: color.scale($accent-gold, $lightness: 15%);
  color: $text-dark;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer
}

.jewel__nye {
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

.jewel__nye i {
  font-size: 18px
}

@media(min-width:1024px) {
  .jewel__header {
    font-size: 24px;
    margin-bottom: 20px
  }

  .jewel__container {
    grid-template-columns: 3fr 2fr;
    align-items: center;
    gap: 24px;
    padding: 0 24px 32px
  }

  .jewel__images {
    overflow: visible;
    gap: 16px;
    display: grid;
    grid-template-columns: repeat(3, 1fr)
  }

  .jewel__card {
    flex: 0 0 auto;
    width: auto
  }

  .jewel__text {
    text-align: left;
    align-content: center;
    padding-left: 32px
  }

  .jewel__subtitle {
    font-size: 1.25rem;
    letter-spacing: 3px
  }
}
</style>
