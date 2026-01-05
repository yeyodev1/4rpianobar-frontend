<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  eventName: {
    type: String,
    default: ''
  },
  guestCount: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['close']);

const whatsappUrl = computed(() => {
  const peopleText = props.guestCount > 1 ? ` para ${props.guestCount} personas` : ' para 1 persona';
  const text = `Hola, deseo reservar${peopleText} para el evento${props.eventName ? `: ${props.eventName}` : ''}.`;
  return `https://wa.me/593979279877?text=${encodeURIComponent(text)}`;
});

const close = () => {
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-backdrop" @click="close">
        <div class="modal-container" @click.stop>
          <button class="btn-close" @click="close" aria-label="Cerrar">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="modal-content">
            <div class="icon-wrapper">
              <i class="fa-brands fa-whatsapp"></i>
            </div>
            
            <h2 class="modal-title">Reserva Exclusiva</h2>
            
            <div class="modal-body">
              <p>
                Actualmente estamos optimizando nuestra pasarela de pagos.
              </p>
              <p class="highlight">
                Para garantizar tu asistencia, gestionaremos tu reserva personalmente a través de nuestro canal oficial de WhatsApp.
              </p>
            </div>
            
            <a :href="whatsappUrl" target="_blank" class="btn-whatsapp-action" @click="close">
              <span>Continuar a WhatsApp</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background-color: colors.$white;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(colors.$BRAND-PRIMARY, 0.1);
}

.btn-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: colors.$text-light;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 10;

  &:hover {
    color: colors.$BRAND-PRIMARY;
  }
}

.modal-content {
  padding: 2.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  background-color: #25D366;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
}

.modal-title {
  font-family: 'Playfair Display', serif;
  color: colors.$BRAND-PRIMARY;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.modal-body {
  color: colors.$text-dark;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;

  p {
    margin-bottom: 0.8rem;
  }

  .highlight {
    font-weight: 600;
    color: colors.$text-dark;
  }
}

.btn-whatsapp-action {
  background-color: #25D366;
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
    background-color: #1faf53;
  }
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: modal-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-leave-active .modal-container {
  animation: modal-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}

@keyframes modal-slide-in {
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
