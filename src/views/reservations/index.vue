<script setup lang="ts">
import CulinaryExcellence from './CulinaryExcellence.vue';
import IntroExperience from './IntroExperience.vue'
import ArchitecturalJewel from './ArchitecturalJewel.vue'
import GastronomicDestinations from './GastronomicDestinations.vue'
import EventsAndLocation from './EventsAndLocation.vue'
import FooterSection from '../home/FooterSection.vue';

const whatsappNumber = '593979279877'
const whatsappMessage = 'Hola, deseo reservar en 4R Piano Bar'
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
</script>

<template>
  <a :href="whatsappHref" target="_blank" rel="noopener" class="reservations__cta">RESERVAR AHORA</a>
  <IntroExperience />
  <CulinaryExcellence />
  <ArchitecturalJewel />
  <GastronomicDestinations />
  <EventsAndLocation />
  <FooterSection />
</template>

<style lang="scss" scoped>
.reservations__cta {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 40;
  background: $BRAND-BURGUNDY;
  color: $white;
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, .35);
}

@media (min-width: 768px) {
  .reservations__cta {
    right: 24px;
    bottom: 24px;
  }
}
</style>
