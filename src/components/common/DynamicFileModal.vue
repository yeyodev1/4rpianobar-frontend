<script setup lang="ts">
import { useDynamicFilesStore } from '@/stores/dynamicFiles'

const dynamicFiles = useDynamicFilesStore()
</script>

<template>
  <transition name="fade">
    <div v-if="dynamicFiles.showModal" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" @click="dynamicFiles.closeModal">
          <i class="fa-solid fa-xmark"></i>
        </button>
        
        <div v-if="dynamicFiles.loading" class="modal-body loading-state">
          <div class="spinner"></div>
          <p>Buscando {{ dynamicFiles.modalType === 'menu' ? 'menú' : 'cartelera' }} actual...</p>
        </div>
        
        <div v-else class="modal-body ready-state">
          <i class="fa-solid fa-circle-check icon-success"></i>
          <h3>¡Encontrado!</h3>
          <p class="info-text">Abriendo {{ dynamicFiles.modalType === 'menu' ? 'el menú' : 'la cartelera' }}...</p>
          
          <div class="warning-box">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <p>Si no se abrió automáticamente, es posible que tengas un bloqueador de anuncios.</p>
          </div>
          
          <a :href="dynamicFiles.currentUrl" target="_blank" class="manual-btn" @click="dynamicFiles.closeModal">
            ABRIR MANUALMENTE
          </a>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000; // Above everything
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal-content {
  background: #111;
  border: 1px solid $accent-gold;
  border-radius: 16px;
  padding: 32px 24px;
  width: 100%;
  max-width: 400px;
  position: relative;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: $gray-400;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: $white;
  }
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba($accent-gold, 0.3);
  border-radius: 50%;
  border-top-color: $accent-gold;
  animation: spin 1s ease-in-out infinite;
}

.loading-state p {
  color: $white;
  font-size: 1.1rem;
  margin: 0;
}

.icon-success {
  font-size: 3rem;
  color: $accent-gold;
  margin-bottom: 8px;
}

.ready-state h3 {
  font-family: $font-principal;
  color: $white;
  font-size: 1.5rem;
  margin: 0;
}

.info-text {
  color: $gray-300;
  margin: 0;
}

.warning-box {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
  text-align: left;
  margin: 8px 0;

  i {
    color: #FFC107;
    font-size: 1.2rem;
  }

  p {
    color: $gray-300;
    font-size: 0.85rem;
    margin: 0;
    line-height: 1.4;
  }
}

.manual-btn {
  display: inline-block;
  background: $BRAND-BURGUNDY;
  color: $white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 8px;
  width: 100%;
  transition: background 0.3s;

  &:hover {
    background: color.scale($BRAND-BURGUNDY, $lightness: 10%);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
