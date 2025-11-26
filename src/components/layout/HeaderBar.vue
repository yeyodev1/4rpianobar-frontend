<script setup lang="ts">
const props = defineProps({
  phoneHref: { type: String, required: false },
})
const emit = defineEmits(['toggle-menu'])
function onToggle() { emit('toggle-menu') }
</script>

<template>
  <header class="navbar">
    <div class="navbar__inner">
      <div class="left">
        <button class="reserve">RESERVAR AHORA</button>
      </div>
      <div class="center">
        <div class="brand">4R PIANO BAR</div>
        <div class="subtitle">COCINA LATINOAMERICANA</div>
      </div>
      <div class="right">
        <a :href="phoneHref || 'tel:+000000000'" aria-label="Teléfono" class="icon">
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
}

.brand {
  font-family: $font-principal;
  letter-spacing: 2px;
  font-size: 16px;
  color: $white;
}

.subtitle {
  font-size: 10px;
  letter-spacing: 2px;
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

  .brand {
    font-size: 18px;
  }

  .subtitle {
    font-size: 12px;
  }
}
</style>
