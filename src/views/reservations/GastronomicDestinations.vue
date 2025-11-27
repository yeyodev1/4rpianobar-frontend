<script setup lang="ts">
type Destination = { name: string; image: string }

const title = 'DESTINO GASTRONÓMICO DE EXCELENCIA CON GRUPO 4R'

const destinations: Destination[] = [
  { name: 'NOCHES DE PIANO BAR', image: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764170856/Imagen_001_2_lltzgr.jpg' },
  { name: 'ENTRADA EMBLEMÁTICA', image: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764170812/Imagen_001_1_oyksp0.jpg' },
  { name: 'COCINA ITALIANA CLÁSICA', image: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764170779/Foto_001_4_bii8jj.jpg' },
  { name: 'EXPERIENCIA LATINA CONTEMPORÁNEA', image: 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171006/007_Julio_yovh85.jpg' },
]

const whatsappNumber = '593979279877'
function whatsappHrefFor(name: string) {
  const msg = `Hola, quiero más información sobre ${name} en 4R Piano Bar`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
}
</script>

<template>
  <section class="destinations">
    <h2 class="destinations__title">{{ title }}</h2>
    <p class="destinations__tagline">GUAYAQUIL · ECUADOR — EXPERIENCIA PARA VIAJEROS INTERNACIONALES</p>
    <div class="destinations__grid">
      <article v-for="d in destinations" :key="d.name" class="card">
        <figure class="card__media">
          <img :src="d.image" :alt="d.name" class="card__image" />
        </figure>
        <div class="card__footer">
          <div class="card__left">
            <div class="card__name">{{ d.name }}</div>
            <div class="card__meta">Guayaquil, Ecuador</div>
          </div>
          <a :href="whatsappHrefFor(d.name)" target="_blank" rel="noopener" class="card__btn" aria-label="Descubre más en WhatsApp">DESCUBRE MÁS</a>
        </div>
      </article>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.destinations {
  background: $text-dark;
  padding: 24px 16px;
  position: relative
}

.destinations__title {
  font-family: $font-principal;
  color: $accent-gold;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 2px;
  margin: 0 0 16px;
  font-size: 20px
}

.destinations__tagline {
  color: $gray-400;
  text-align: center;
  letter-spacing: 1px;
  margin: 0 0 20px;
  font-size: .95rem
}

.destinations__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 1280px;
  margin: 0 auto
}

.card {
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, .25)
}

.card__media {
  width: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
  background: $gray-900
}

.card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block
}

.card__footer {
  background: $gray-900;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px
}

.card__left {
  display: grid;
  gap: 6px
}

.card__name {
  font-family: $font-principal;
  color: $white;
  text-transform: uppercase;
  letter-spacing: 2px
}

.card__meta {
  color: $gray-400;
  font-size: .85rem
}

.card__btn {
  text-decoration: none;
  background: $white;
  color: $text-dark;
  border: none;
  padding: 10px 14px;
  border-radius: 2px;
  font-size: .8rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background .2s ease, color .2s ease
}

.card__btn:hover {
  background: $accent-gold;
  color: $text-dark
}


@media(min-width:768px) {
  .destinations__grid {
    grid-template-columns: repeat(2, 1fr)
  }
}

@media(min-width:1280px) {
  .destinations__grid {
    grid-template-columns: repeat(4, 1fr)
  }
}
</style>
