<script setup lang="ts">
const corporateTitle = 'EVENTOS CORPORATIVOS SOFISTICADOS'
const corporateBody = 'Crea experiencias memorables para tu empresa con un ambiente exclusivo, servicio impecable y propuestas gastronómicas diseñadas para impresionar.'
const contactEmail = 'eventos@4rpianobar.com'
const contactPhone = '+593 97 927 9877'

const directionsTitle = 'INDICACIONES'
const addressText = 'Dale click al mapa interactivo para ver nuestra ubicación exacta en google maps'
const servicesTitle = 'SERVICIOS'
const services = [
  { icon: 'fa-square-parking', text: 'Estacionamiento Privado' },
]

const corporateImage = 'https://res.cloudinary.com/dpimsaaa4/image/upload/v1764171485/Imagen_002_1_nkcu4w.jpg'

const mapUrl = 'https://www.google.com/maps/place/4R+Piano+Bar/@-2.1402047,-79.8879874,15z/data=!4m6!3m5!1s0x902d6d6036bace83:0xcaf52612d9eac4a9!8m2!3d-2.1384666!4d-79.8654149!16s%2Fg%2F11ty26g7n1?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D.'
const openMap = () => window.open(mapUrl, '_blank')
</script>

<template>
  <section class="events">
    <div class="events__container">
      <div class="events__corporate">
        <div class="events__corporate-grid">
          <div class="events__text">
            <h2 class="events__title">{{ corporateTitle }}</h2>
            <p class="events__body">{{ corporateBody }}</p>
            <ul class="events__contacts">
              <li>
                <a :href="`mailto:${contactEmail}`" class="events__contact-link">
                  <i class="fa-solid fa-envelope" aria-hidden="true"></i>
                  <span>{{ contactEmail }}</span>
                </a>
              </li>
              <li>
                <a :href="`tel:${contactPhone.replace(/\s/g, '')}`" class="events__contact-link">
                  <i class="fa-solid fa-phone" aria-hidden="true"></i>
                  <span>{{ contactPhone }}</span>
                </a>
              </li>
            </ul>
          </div>
          <figure class="events__media">
            <img :src="corporateImage" alt="Brindis con bengalas en ambiente elegante" class="events__image" />
          </figure>
        </div>
      </div>

      <div class="events__location">
        <div class="events__location-grid">
          <div class="events__text">
            <h2 class="events__title">{{ directionsTitle }}</h2>
            <p class="events__body">{{ addressText }}</p>
            <h3 class="events__subtitle">{{ servicesTitle }}</h3>
            <ul class="events__services">
              <li v-for="s in services" :key="s.text" class="events__service">
                <i class="fa-solid" :class="s.icon" aria-hidden="true"></i>
                <span>{{ s.text }}</span>
              </li>
            </ul>
          </div>

          <div class="events__map" role="button" aria-label="Abrir mapa" @click="openMap">
            <div class="events__map-center">
              <i class="fa-solid fa-location-dot"></i>
              <span>Mapa Interactivo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.events {
  background: $text-dark;
  position: relative
}

.events__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 16px;
  display: grid;
  gap: 32px
}

.events__corporate-grid {
  display: grid;
  gap: 16px
}

.events__location-grid {
  display: grid;
  gap: 16px
}

.events__text {
  display: grid;
  gap: 12px
}

.events__title {
  font-family: $font-principal;
  color: $accent-gold;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  font-size: 1.4rem
}

.events__subtitle {
  font-family: $font-principal;
  color: $accent-gold;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
  margin-top: 16px;
  font-size: 1.1rem
}

.events__body {
  color: $gray-300;
  line-height: 1.8;
  text-align: center
}

.events__contacts {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  justify-items: center
}

.events__contact-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: $white;
  text-decoration: none
}

.events__contact-link i {
  color: $accent-gold
}

.events__media {
  border-radius: 0 0 0 12px;
  overflow: hidden;
  background: $gray-900
}

.events__image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover
}

.events__services {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
  justify-items: center
}

.events__service {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: $white
}

.events__service i {
  color: $accent-gold
}

.events__map {
  background: #1c222b;
  border-radius: 12px;
  height: 400px;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(0, 0, 0, .35)
}

.events__map-center {
  display: grid;
  gap: 8px;
  justify-items: center
}

.events__map-center i {
  color: $accent-gold;
  font-size: 28px
}

.events__map-center span {
  color: $gray-300;
  letter-spacing: 1px
}

.events__map-overlay span {
  letter-spacing: 1px
}

.events__map:hover .events__map-image {
  transform: scale(1.03)
}

.events__map:hover .events__map-overlay {
  transform: translateY(0);
  opacity: 1
}

@media(min-width:1024px) {
  .events__corporate-grid {
    grid-template-columns: 2fr 3fr;
    align-items: center
  }

  .events__location-grid {
    grid-template-columns: 2fr 3fr;
    align-items: center
  }

  .events__title,
  .events__subtitle,
  .events__body {
    text-align: left
  }
}
</style>
