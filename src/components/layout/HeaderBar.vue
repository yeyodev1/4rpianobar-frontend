<script setup lang="ts">
const props = defineProps({
  phoneHref: { type: String, required: false },
})
const emit = defineEmits(['toggle-menu'])
function onToggle() { emit('toggle-menu') }

const whatsappNumber = '593979279877'
const whatsappMessage = 'Hola, deseo reservar en 4R Piano Bar'
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
const phoneLink = props.phoneHref || whatsappHref
</script>

<template>
  <header class="navbar">
    <div class="navbar__inner">
      <div class="left">
        <a :href="whatsappHref" target="_blank" rel="noopener" class="reserve">RESERVAR AHORA</a>
      </div>
      <div class="center">
        <router-link :to="{ name: 'home' }">
          <img src="@/assets/static/logo-light.png" alt="4R Piano Bar" class="logo-horizontal" />
        </router-link>
      </div>
      <div class="right">
        <a :href="phoneLink" target="_blank" rel="noopener" aria-label="WhatsApp" class="icon">
          <i class="fa-solid fa-phone"></i>
        </a>
        <button class="icon" aria-label="Menú" @click="onToggle">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba($text-dark, 0.9);
  backdrop-filter: blur(6px);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.left {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.center {
  flex: 0 0 auto;
  text-align: center;
  color: $accent-gold;
}

.right {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.reserve {
  background: $BRAND-BURGUNDY;
  color: $white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
}

.logo-horizontal {
  height: 40px;
  width: auto;
  display: block;
}

.icon {
  background: transparent;
  border: none;
  color: $white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon i {
  font-size: 20px;
}

@media (min-width: 768px) {
  .navbar__inner {
    padding: 14px 24px;
    max-width: 1280px;
  }

  .logo-horizontal {
    height: 50px;
  }
}
</style>
