<script setup lang="ts">
import FeaturedDish from './FeaturedDish.vue'
import HeroSection from './HeroSection.vue'
import LocationsSection from './LocationsSection.vue'
import AtmosphereSection from './AtmosphereSection.vue'
import FooterSection from './FooterSection.vue'
</script>

<template>
  <HeroSection />

  <main>
    <section class="intro">
      <div class="intro__group">
        <h2>¿QUÉ ES 4R?</h2>
        <p>
          4R es ese lugar al que vas cuando no quieres lo de siempre. <br>
          Cuando no te provoca ni la disco, ni el bar ruidoso, ni quedarte en casa. <br>
          Cuando quieres música en vivo, algo que se sienta especial, un trago bien hecho y una noche que tenga historia.
        </p>
        <p>
          Aquí hay piano. Hay voces en vivo. Hay cocteles. Hay gente celebrando cosas pequeñas y grandes. Y todo pasa muy cerca de ti.
        </p>
      </div>

      <div class="intro__group">
        <h2>LA IDEA DETRÁS DE 4R</h2>
        <p>
          No necesitas una excusa para venir. No necesitas que sea viernes. No necesitas que sea tu cumpleaños.
        </p>
        <p>
          Si quieres salir, esa ya es una razón. Y si eliges 4R, es una buena. Por eso aquí decimos: <strong>Siempre tienes la razón.</strong>
        </p>
      </div>
    </section>

    <FeaturedDish />

    <LocationsSection />

    <section class="night-phases">
      <div class="container">
        <h2 class="section-title">CÓMO CAMBIA LA NOCHE</h2>
        <div class="phases-grid">
          <div class="phase-card">
            <h3>Temprano</h3>
            <p>Para conversar, empezar tranquilo, mirarse de cerca.</p>
          </div>
          <div class="phase-card">
            <h3>Más tarde</h3>
            <p>Para el show, el piano, los coros y los brindis.</p>
          </div>
          <div class="phase-card">
            <h3>Muy tarde</h3>
            <p>Para quedarte un rato más… aunque ya habías dicho que te ibas.</p>
          </div>
        </div>
      </div>
    </section>

    <AtmosphereSection/>

    <section class="reasons">
      <div class="container">
        <h2>PARA QUÉ VENIR</h2>
        <p>A 4R vienes:</p>
        <ul class="reasons-list">
          <li>A celebrar algo</li>
          <li>A olvidar algo</li>
          <li>A impresionar a alguien</li>
          <li>A cantar</li>
          <li>A brindar</li>
          <li>A salir sin motivo</li>
        </ul>
        <p class="reasons-footer">Todas son buenas razones.</p>
      </div>
    </section>
  </main>

  <FooterSection />
</template>

<style lang="scss" scoped>
@use 'sass:color';

main {
  display: grid;
  gap: 48px;
}

.intro {
  padding: 48px 20px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.intro__group h2 {
  font-family: $font-principal;
  color: $BRAND-BURGUNDY;
  font-size: 1.6rem;
  line-height: 1.2;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.intro__group p {
  color: $gray-300;
  font-size: 0.95rem;
  line-height: 1.7;
  max-width: 60ch;
  width: 100%;
  margin: 12px 0;
}

.section-title {
  font-family: $font-principal;
  color: $accent-gold;
  text-align: center;
  margin-bottom: 32px;
  font-size: 1.8rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.night-phases,
.reasons,
.events-cta,
.booking-section {
  padding: 64px 0;
  text-align: center;
}

.phases-grid {
  display: grid;
  gap: 24px;
}

.phase-card {
  background: rgba($white, 0.05);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba($accent-gold, 0.2);
}

.phase-card h3 {
  color: $accent-gold;
  margin-bottom: 12px;
  font-family: $font-principal;
}

.reasons h2,
.events-cta h2,
.booking-section h2 {
  font-family: $font-principal;
  color: $accent-gold;
  font-size: 1.8rem;
  margin-bottom: 24px;
}

.reasons-list {
  list-style: none;
  padding: 0;
  margin: 24px 0;
  display: grid;
  gap: 12px;
}

.reasons-list li {
  color: $white;
  font-size: 1.1rem;

  &::before {
    content: "•";
    color: $accent-gold;
    margin-right: 12px;
  }
}

.reasons-footer {
  font-weight: 600;
  color: $accent-gold;
}

.cta-btn {
  display: inline-block;
  margin-top: 24px;
  padding: 14px 32px;
  background: $BRAND-BURGUNDY;
  color: $white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.3s ease;
}

.cta-btn:hover {
  background: color.scale($BRAND-BURGUNDY, $lightness: 10%);
}

@media (min-width: 768px) {
  .intro {
    text-align: center;
    padding: 80px 24px;
    align-items: center;
  }

  .intro__group p {
    margin: 12px auto;
  }

  .phases-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .reasons-list {
    grid-template-columns: repeat(2, 1fr);
    max-width: 600px;
    margin: 32px auto;
    text-align: left;
  }
}
</style>
