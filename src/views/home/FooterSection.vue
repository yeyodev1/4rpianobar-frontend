<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  showNewsletter: { type: Boolean, default: true },
})

const email = ref('')

function sendToWhatsapp() {
  const value = email.value.trim()
  if (!value) return
  const message = `Hola, mi correo es ${value}, deseo ser agregado para recibir novedades y ofertas exclusivas.`
  const url = `https://wa.me/593979279877?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
</script>

<template>
  <footer class="footer">
    <section v-if="props.showNewsletter" class="footer__newsletter">
      <div class="footer__container">
        <h2 class="footer__title">NEWSLETTER</h2>
        <p class="footer__subtitle">Suscríbete para recibir novedades, eventos y ofertas exclusivas.</p>
        <div class="footer__form">
          <input v-model="email" type="email" class="footer__input" placeholder="Tu correo electrónico" />
          <button type="button" class="footer__btn" @click="sendToWhatsapp">Enviar</button>
        </div>
      </div>
    </section>

    <section class="footer__bottom">
      <div class="footer__container">
        <div class="footer__row footer__row--top">
          <span class="footer__copy">© 2025 4R Piano Bar</span>
          <div class="footer__socials">
            <a href="https://www.facebook.com/4Rpianobar.ec" aria-label="Facebook" class="footer__social"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/4rpianobar.ec/" aria-label="Instagram" class="footer__social"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>

        <div class="footer__legal">
          <span class="footer__legal-item">Razón Social: <strong>4REGIONES S.A.S.</strong></span>
          <span class="footer__legal-sep">·</span>
          <span class="footer__legal-item">RUC: 0993258571001</span>
          <span class="footer__legal-sep">·</span>
          <span class="footer__legal-item">Dirección: Av. Los Arcos S/N y Vía Samborondón Km 1.5, Edificio Xima, Oficina 002, Samborondón, Guayas, Ecuador</span>
          <span class="footer__legal-sep">·</span>
          <span class="footer__legal-item">Teléfono: <a href="tel:+593992950939" class="footer__legal-link">+593 99 295 0939</a></span>
          <span class="footer__legal-sep">·</span>
          <span class="footer__legal-item">Correo: <a href="mailto:4rpianobar@gmail.com" class="footer__legal-link">4rpianobar@gmail.com</a></span>
        </div>

        <div class="footer__row footer__dev">
          <span class="footer__made">Desarrollado por
            <a href="https://yeyo.dev/" target="_blank" rel="noopener noreferrer" class="footer__dev-link">yeyodev</a>
          </span>
        </div>
      </div>
    </section>
  </footer>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.footer {
  display: grid;
  gap: 0;

  &__container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  &__newsletter {
    background: $BRAND-GARNET;
    padding: 3rem 1rem;
    text-align: center;
    display: grid;
    gap: 1rem;
  }

  &__title {
    font-family: $font-principal;
    color: $accent-gold;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 1.5rem;
    line-height: 1.2;
  }

  &__subtitle {
    color: $gray-300;
    font-size: 0.95rem;
  }

  &__form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 700px;
    margin: 0 auto;
  }

  &__input {
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid rgba($white, 0.18);
    background: rgba(0, 0, 0, 0.3);
    color: $white;
    outline: none;
  }

  &__btn {
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    border: none;
    background: $BRAND-CREAM;
    color: #000000;
    font-weight: 600;
    cursor: pointer;
    transition: background 200ms ease;
  }

  &__btn:hover {
    background: color.scale($BRAND-CREAM, $lightness: -8%);
  }

  &__bottom {
    background: $text-dark;
    color: $white;
    display: grid;
    gap: 1rem;
    padding: 1.5rem 1rem;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  &__row--top {
    flex-direction: column;
    gap: 12px;
  }

  &__copy {
    color: $gray-400;
    font-size: 0.9rem;
  }

  &__legal {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px 10px;
    color: $gray-400;
    font-size: 0.85rem;
    line-height: 1.6;
    text-align: center;
  }

  &__legal-item {
    color: $gray-400;
  }

  &__legal-sep {
    color: $gray-700;
  }

  &__legal-link {
    color: $accent-gold;
    text-decoration: none;
  }

  &__socials {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__social {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: $gray-800;
    color: $white;
    text-decoration: none;
    transition: filter 200ms ease;
  }

  &__social:hover {
    filter: brightness(1.2);
  }

  &__brands {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px 20px;
  }

  &__brand {
    color: $gray-300;
    font-size: 0.95rem;
    text-decoration: none;
  }

  &__dev {
    justify-content: center;
  }

  &__made {
    color: $gray-500;
    font-size: 0.9rem;
  }

  &__dev-link {
    color: $accent-gold;
    text-decoration: none;
    margin-left: 6px;
  }
}

@media (min-width: 768px) {
  .footer {
    &__title {
      font-size: 2.25rem;
    }

    &__form {
      grid-template-columns: minmax(280px, 520px) auto;
      justify-content: center;
    }

    &__btn {
      width: auto;
    }

    &__row--top {
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>
