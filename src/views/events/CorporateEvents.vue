<script setup lang="ts">
import { ref } from 'vue';

const whatsappNumber = '593959853607';
const whatsappMessage = 'Estimados 4R Piano Bar, solicito formalmente información y presupuesto para un evento corporativo (Experiencias exclusivas). Quedo a la espera de su contacto profesional.';
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

const getWhatsAppPlanHref = (planName: string, category: string) => {
  const message = `Deseo consultar la disponibilidad y términos del "${planName}" para la categoría de "${category}". Se trata de una experiencia exclusiva. Agradecería una respuesta profesional para proceder.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const activeTab = ref('talleres');

const workshopPlans = [
  {
    name: '4R Corporate Breakfast',
    aforo: '35 PERSONAS',
    minAforo: '15 personas',
    tiempo: '3 horas',
    horario: 'Mañana/Tarde',
    price: '',
    includes: [
      'Salón Interior',
      'Desayuno y/o brunch',
      'Bebidas soft ilimitadas',
      'Proyector, equipos de audio y micrófono.',
      'Cuadernillo de notas, bolígrafo, pizarra, marcadores.'
    ]
  },
  {
    name: '4R Corporate Lunch',
    aforo: '35 PERSONAS',
    minAforo: '15 personas',
    tiempo: '3 horas',
    horario: 'Mañana/Tarde',
    price: '',
    includes: [
      'Salón Interior',
      'Almuerzo ejecutivo de 2 tiempos',
      'Bebidas soft ilimitadas',
      'Proyector, equipos de audio y micrófono.',
      'Cuadernillo de notas, bolígrafo, pizarra, marcadores.'
    ]
  }
];

const celebrationPlans = [
  {
    name: '4R Black',
    aforo: '75 PERSONAS',
    minAforo: '25 personas',
    tiempo: 'Mínimo 4 horas',
    horario: 'No Prime',
    price: '',
    includes: [
      'Salón Interior',
      '100 bocaditos a elegir',
      'Dj y/o música en vivo',
      'Decoración',
      '6 botellas de Old Parr'
    ]
  },
  {
    name: '4R Gold',
    aforo: '75 PERSONAS',
    minAforo: '25 personas',
    tiempo: 'Mínimo 4 horas',
    horario: 'No Prime',
    price: '',
    includes: [
      'Salón Interior',
      'Cena de 3 tiempos',
      'Dj y/o música en vivo',
      'Decoración',
      '6 botellas de Johnnie Black'
    ]
  }
];

const breakfastOptions = [
  'Bolón con queso, huevos revueltos y fruta picada',
  'Tortilla de verde con queso, huevo frito y fruta picada.',
  'Tortilla de maíz con queso, salchicha cuencana y fruta picada.'
];

const brunchOptions = [
  'Sandwich de pollo crispy y coles law',
  'Submarino de jamón de espalday queso provolone ahumado.',
  'Burrito de fréjol refrito con pollo o lomo'
];

const lunchOptions = [
  {
    main: 'Pechuga de pollo a la crema de limón y romero, arroz primavera, ensalada caliente de vegetales.',
    dessert: 'Ensalada de frutas con crema.'
  },
  {
    main: 'Lomo a la pimienta con vegetales gratinados (papa,zanahoria,brócoli,coliflor) acompañado de arroz al pesto con pimiento morrón.',
    dessert: 'Mousse de maracuyá'
  }
];

const snackOptions = [
  'Taquitos de lomo',
  'Flautas de pollo',
  'Croquetas de Cerdo',
  'Camarones en panko o tempura',
  'Empanadas de chistorra o provolone',
  'Bocaditos de Sushi (estilo Express)',
  'Brochetas de lomo',
  'Canastas de verde con chicharrón',
  'Arancinis de risotto a la napolitana'
];

const dinnerDetails = {
  entradas: ['Rapsodia de camarón', 'Crispi Jazz'],
  proteinas: ['Medallones de pollo con champiñones', 'Lomo de res en salsa de vino tinto'],
  carbohidratos: ['Arroz cremoso a lo pomodoro', 'Arroz cremoso al pesto', 'Arroz cremoso con maíz dulce'],
  acompanantes: ['Croquetas de papa con jamón y perejil', 'Canelón de acelga y queso ricota', 'Mil hojas de papa'],
  ensaladas: ['Ensalada César', 'Ensalada de vegetales', 'Coles Law'],
  postres: ['Mousse de frutos rojos', 'Panna cotta de maracuyá']
};
</script>

<template>
  <div class="corporate-events">
    <!-- Hero Section -->
    <section class="hero-corporate">
      <div class="hero-overlay">
        <h1 class="title">EVENTOS CORPORATIVOS</h1>
        <p class="subtitle">EXPERIENCIAS EXCLUSIVAS</p>
        <a :href="whatsappHref" target="_blank" class="cta-button">COTIZA TU EVENTO</a>
      </div>
    </section>

    <!-- Tabs Navigation -->
    <div class="tabs-container">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'talleres' }"
        @click="activeTab = 'talleres'"
      >
        TALLERES Y CAPACITACIONES
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'celebraciones' }"
        @click="activeTab = 'celebraciones'"
      >
        CELEBRACIONES
      </button>
    </div>

    <!-- Main Content -->
    <main class="content-wrapper">
      
      <!-- Workshops Section -->
      <transition name="fade" mode="out-in">
        <div v-if="activeTab === 'talleres'" key="talleres" class="tab-content">
          <div class="intro-image-container">
            <img src="https://res.cloudinary.com/dpimsaaa4/image/upload/v1769118461/Fotos_Web_Corporativo_wdbfdn.png" alt="Talleres y Capacitaciones" class="intro-img">
          </div>
          <div class="intro-text">
            <h2>¿Cansado de los salones de hotel fríos?</h2>
            <p>Cambia el chip de tu equipo en un entorno elegante, cálido y acogedor.</p>
          </div>

          <div class="plans-grid">
            <div v-for="plan in workshopPlans" :key="plan.name" class="plan-card">
              <div class="plan-header">
                <h3>{{ plan.name }}</h3>
                <span class="price">{{ plan.price }}</span>
              </div>
              <ul class="plan-details">
                <li><i class="fa-solid fa-users"></i> Aforo: {{ plan.aforo }}</li>
                <li><i class="fa-solid fa-clock"></i> Tiempo: {{ plan.tiempo }}</li>
                <li><i class="fa-solid fa-calendar-day"></i> Horario: {{ plan.horario }}</li>
              </ul>
              <p class="min-aforo" v-if="plan.minAforo">*Aforo de evento mínimo: {{ plan.minAforo }}</p>
              <div class="plan-includes">
                <h4>Incluye:</h4>
                <ul>
                  <li v-for="item in plan.includes" :key="item">
                    <i class="fa-solid fa-check"></i> {{ item }}
                  </li>
                </ul>
              </div>
              <a :href="getWhatsAppPlanHref(plan.name, 'Talleres y Capacitaciones')" target="_blank" class="plan-cta">
                COTIZAR ESTE PLAN
              </a>
            </div>
          </div>

          <!-- Menu Options for Workshops -->
          <div class="menu-sections">
            <div class="menu-category">
              <img src="@/assets/static/restaurant/gourmet-breakfast.png" alt="Desayunos" class="category-img">
              <h3>OPCIONES DE DESAYUNOS</h3>
              <ul>
                <li v-for="option in breakfastOptions" :key="option">{{ option }}</li>
              </ul>
            </div>
            <div class="menu-category">
              <img src="https://res.cloudinary.com/dpimsaaa4/image/upload/v1769118680/Brunch_Foto_uf2vs8.jpg" alt="Brunch" class="category-img">
              <h3>OPCIONES DE BRUNCH</h3>
              <ul>
                <li v-for="option in brunchOptions" :key="option">{{ option }}</li>
              </ul>
            </div>
            <div class="menu-category full-width">
              <img src="@/assets/static/restaurant/elegant-dinner.png" alt="Almuerzos" class="category-img large">
              <h3>OPCIONES DE ALMUERZOS</h3>
              <div class="lunch-grid">
                <div v-for="(lunch, index) in lunchOptions" :key="index" class="lunch-item">
                  <p class="main-dish">{{ lunch.main }}</p>
                  <p class="dessert-dish"><strong>Postre:</strong> {{ lunch.dessert }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Celebrations Section -->
        <div v-else key="celebraciones" class="tab-content">
          <div class="intro-image-container">
            <img src="@/assets/static/corporate/lobby.jpg" alt="Celebraciones" class="intro-img">
          </div>
          <div class="intro-text">
            <h2>Celebre sus momentos especiales</h2>
            <p>Nuestro espacio acogedor le brindará a usted y sus invitados una experiencia inolvidable.</p>
          </div>

          <div class="plans-grid">
            <div v-for="plan in celebrationPlans" :key="plan.name" class="plan-card highlight">
              <div class="plan-header">
                <h3>{{ plan.name }}</h3>
                <span class="price">{{ plan.price }}</span>
              </div>
              <ul class="plan-details">
                <li><i class="fa-solid fa-users"></i> Aforo: {{ plan.aforo }}</li>
                <li><i class="fa-solid fa-clock"></i> Mínimo: {{ plan.tiempo }}</li>
                <li><i class="fa-solid fa-calendar-day"></i> Horario: {{ plan.horario }}</li>
              </ul>
              <p class="min-aforo" v-if="plan.minAforo">*Aforo de evento mínimo: {{ plan.minAforo }}</p>
              <div class="plan-includes">
                <h4>Incluye:</h4>
                <ul>
                  <li v-for="item in plan.includes" :key="item">
                    <i class="fa-solid fa-check"></i> {{ item }}
                  </li>
                </ul>
              </div>
              <a :href="getWhatsAppPlanHref(plan.name, 'Celebraciones')" target="_blank" class="plan-cta secondary">
                COTIZAR ESTE PLAN
              </a>
            </div>
          </div>

          <div class="note-box">
            <p><i class="fa-solid fa-martini-glass-citrus"></i> NOTA: Contamos con opciones de barra libre en cocteles.</p>
          </div>

          <!-- Menu Options for Celebrations -->
          <div class="menu-sections">
            <div class="menu-category full-width">
              <h3>OPCIONES DE BOCADITOS</h3>
              <ul class="chips-list">
                <li v-for="snack in snackOptions" :key="snack">{{ snack }}</li>
              </ul>
            </div>
            
            <div class="menu-category full-width dinner-menu">
              <img src="@/assets/static/restaurant/elegant-dinner.png" alt="Cena" class="category-img large">
              <h3>OPCIONES DE CENA</h3>
              <div class="dinner-grid">
                <div class="dinner-col">
                  <h4>ENTRADAS</h4>
                  <ul><li v-for="i in dinnerDetails.entradas" :key="i">{{ i }}</li></ul>
                  <h4>PROTEÍNAS</h4>
                  <ul><li v-for="i in dinnerDetails.proteinas" :key="i">{{ i }}</li></ul>
                </div>
                <div class="dinner-col">
                  <h4>CARBOHIDRATOS</h4>
                  <ul><li v-for="i in dinnerDetails.carbohidratos" :key="i">{{ i }}</li></ul>
                  <h4>ACOMPAÑANTES</h4>
                  <ul><li v-for="i in dinnerDetails.acompanantes" :key="i">{{ i }}</li></ul>
                </div>
                <div class="dinner-col">
                  <h4>ENSALADAS</h4>
                  <ul><li v-for="i in dinnerDetails.ensaladas" :key="i">{{ i }}</li></ul>
                  <h4>POSTRE</h4>
                  <ul><li v-for="i in dinnerDetails.postres" :key="i">{{ i }}</li></ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Contact Footer -->
      <section class="contact-section">
        <div class="contact-info">
          <h3>Disfruta de la exclusividad de Samborondón</h3>
          <p>EDIFICIO XIMA PLANTA BAJA, LOCAL #2</p>
          <div class="contact-actions">
            <a :href="whatsappHref" target="_blank" class="whatsapp-btn">
              <i class="fa-brands fa-whatsapp"></i> +593 95 985 3607
            </a>
            <a href="mailto:comercial@4rpianobar.com" class="email-link">
              <i class="fa-solid fa-envelope"></i> comercial@4rpianobar.com
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.corporate-events {
  background-color: $BRAND-GARNET;
  color: $white;
  min-height: 100vh;
}

.hero-corporate {
  height: 60vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://res.cloudinary.com/dpimsaaa4/image/upload/v1769118078/Portada_Corporativa_r4dgb0.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;

  .hero-overlay {
    max-width: 800px;

    .title {
      font-family: $font-principal;
      font-size: clamp(2rem, 8vw, 4rem);
      margin-bottom: 1rem;
      letter-spacing: 4px;
    }

    .subtitle {
      font-size: clamp(0.9rem, 3vw, 1.2rem);
      color: $BRAND-CREAM;
      margin-bottom: 2rem;
      letter-spacing: 2px;
    }

    .cta-button {
      background-color: $BRAND-BURGUNDY;
      color: $white;
      padding: 1rem 2.5rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: bold;
      letter-spacing: 2px;
      transition: all 0.3s ease;
      display: inline-block;
      border: 1px solid $BRAND-CREAM;
      white-space: normal;
      /* Allow text wrapping on very small screens */
      text-align: center;

      &:hover {
        background-color: $BRAND-CREAM;
        color: $BRAND-BURGUNDY;
        transform: translateY(-3px);
      }

      @media (max-width: 480px) {
        padding: 0.8rem 1.5rem;
        font-size: 0.9rem;
        width: 90%;
        /* Ensure it doesn't overflow */
      }
    }
  }
}

.tabs-container {
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  position: sticky;
  top: 70px;
  z-index: 10;
  backdrop-filter: blur(10px);

  .tab-btn {
    background: transparent;
    border: none;
    color: $gray-400;
    padding: 12px 24px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
    font-size: 0.9rem;
    letter-spacing: 1px;

    &.active {
      color: $BRAND-CREAM;
      border-bottom-color: $BRAND-CREAM;
    }

    &:hover {
      color: $white;
    }
  }
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;

  @media (max-width: 480px) {
    padding: 30px 15px;
  }
}

.intro-text {
  text-align: center;
  margin-bottom: 4rem;
  margin-top: 2rem;

  h2 {
    font-family: $font-principal;
    font-size: 2rem;
    color: $BRAND-CREAM;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: $gray-300;
    max-width: 600px;
    margin: 0 auto;
  }
}

.intro-image-container {
  width: 100%;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    height: 250px;
  }

  .intro-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  /* Reduced from 300px for better mobile fit */
  gap: 30px;
  margin-bottom: 4rem;

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
    /* Single column for very small screens */
  }
}

.plan-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba($BRAND-CREAM, 0.2);
  border-radius: 12px;
  padding: 30px;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 480px) {
    padding: 20px;
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
  }

  &.highlight {
    border-color: $BRAND-CREAM;
    background: rgba($BRAND-BURGUNDY, 0.3);
  }

  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba($BRAND-CREAM, 0.2);
    padding-bottom: 1rem;
    flex-wrap: wrap;
    /* Allow wrapping of price */
    gap: 10px;

    h3 {
      font-size: 1.5rem;
      color: $BRAND-CREAM;
      margin: 0;
    }

    .price {
      font-weight: bold;
      color: $BRAND-CREAM;
      font-size: 1.2rem;
    }
  }

  .plan-details {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;

    li {
      margin-bottom: 0.8rem;
      display: flex;
      align-items: center;
      gap: 10px;
      color: $gray-300;
      font-size: 0.95rem;

      i {
        color: $BRAND-CREAM;
        width: 20px;
        flex-shrink: 0;
        /* Prevent icon shrinking */
      }
    }
  }

  .plan-includes {
    margin-bottom: 2rem;
    flex-grow: 1;

    h4 {
      margin-bottom: 1rem;
      font-size: 1rem;
      letter-spacing: 1px;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: 0.6rem;
        font-size: 0.9rem;
        line-height: 1.4;
        display: flex;
        gap: 10px;
        align-items: flex-start;
        /* Align checkmark to top */

        i {
          color: $success;
          margin-top: 3px;
          flex-shrink: 0;
        }
      }
    }
  }

  .plan-cta {
    display: flex;
    /* Use flex for centering content */
    align-items: center;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
    /* PREVENT OVERFLOW */
    padding: 12px 16px;
    background: transparent;
    border: 1px solid $BRAND-CREAM;
    color: $BRAND-CREAM;
    text-decoration: none;
    font-weight: bold;
    border-radius: 8px;
    letter-spacing: 1px;
    font-size: 0.95rem;
    line-height: 1.3;
    transition: all 0.3s ease;
    white-space: normal;
    /* Allow text wrapping */
    text-align: center;
    margin-top: auto;
    /* Push button to bottom of card */

    &:hover {
      background: $BRAND-CREAM;
      color: $BRAND-GARNET;
      transform: translateY(-2px);
    }

    &.secondary {
      background: $BRAND-BURGUNDY;
      color: $white;
      border-color: $BRAND-BURGUNDY;

      &:hover {
        background: $BRAND-CREAM;
        color: $BRAND-BURGUNDY;
        border-color: $BRAND-CREAM;
      }
    }
  }
}

.menu-sections {
  column-count: 1;
  column-gap: 30px;
  margin-top: 4rem;
  /* Adjusted back to standard spacing from hardcoded 200px if it was an issue, but keeping as is per previous logical flow. User set 200px, I'll respect user or fix if needed. Reverting to standard margin-top for consistency if user didn't explicitly ask for 200px gap, but user set 200px. I will use 6rem to be safe but cleaner. */
  margin-top: 6rem;

  @media (min-width: 900px) {
    column-count: 2;
  }
}

.menu-category {
  background: rgba(0, 0, 0, 0.2);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  break-inside: avoid;
  margin-bottom: 30px;

  @media (max-width: 480px) {
    padding: 20px;
  }

  .category-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1.5rem;

    &.large {
      height: 300px;
    }
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 1rem;
      color: $gray-300;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.lunch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  /* Reduced min width */
  gap: 30px;

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }

  .lunch-item {
    background: rgba(255, 255, 255, 0.03);
    padding: 20px;
    border-radius: 8px;

    .main-dish {
      margin-bottom: 12px;
      line-height: 1.6;
    }

    .dessert-dish {
      color: $BRAND-CREAM;
      font-style: italic;
    }
  }
}

.note-box {
  background: rgba($BRAND-BURGUNDY, 0.2);
  border: 1px dashed $BRAND-CREAM;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  margin: 2rem 0;

  p {
    margin: 0;
    font-weight: bold;
    color: $BRAND-CREAM;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    /* Allow wrapping on mobile */
  }
}

.chips-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;

  li {
    background: rgba($BRAND-CREAM, 0.1) !important;
    border: 1px solid rgba($BRAND-CREAM, 0.3) !important;
    padding: 8px 16px !important;
    border-radius: 50px !important;
    font-size: 0.9rem !important;
    color: $white !important;
  }
}

.dinner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  /* Reduced min width */
  gap: 30px;

  .dinner-col {
    h4 {
      color: $BRAND-CREAM;
      font-size: 0.9rem;
      margin: 1.5rem 0 1rem;
      letter-spacing: 2px;
      border-left: 3px solid $BRAND-CREAM;
      padding-left: 10px;

      &:first-child {
        margin-top: 0;
      }
    }

    ul li {
      font-size: 0.9rem;
    }
  }
}

.contact-section {
  margin-top: 6rem;
  padding: 60px 20px;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4));
  border-radius: 20px;
  text-align: center;

  @media (max-width: 480px) {
    padding: 40px 15px;
  }

  .contact-info {
    h3 {
      font-family: $font-principal;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: $BRAND-CREAM;
      margin-bottom: 2rem;
      letter-spacing: 1px;
    }

    .whatsapp-btn {
      background: #25d366;
      color: white;
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: bold;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 1.2rem;
      transition: transform 0.3s ease;

      @media (max-width: 480px) {
        width: 100%;
        justify-content: center;
        font-size: 1rem;
      }

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

// Animations
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Mobile Adjustments
@media (max-width: 768px) {
  .hero-corporate {
    height: 50vh;
  }

  .tabs-container {
    overflow-x: auto;
    justify-content: flex-start;
    padding: 10px 20px;

    /* Hide scrollbar */
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .tab-btn {
      white-space: nowrap;
      padding: 10px 15px;
    }
  }

  .intro-text h2 {
    font-size: 1.5rem;
  }

  // Removed .plan-card override as it's handled in main definition
}

.min-aforo {
  font-size: 0.85rem;
  color: $accent-gold;
  font-style: italic;
  margin-bottom: 1rem;
}

.contact-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
}

.email-link {
  color: $BRAND-CREAM;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s;

  &:hover {
    color: $white;
  }
}
</style>
