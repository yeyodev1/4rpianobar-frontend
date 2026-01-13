<script setup lang="ts">
import { ref } from 'vue';
import PaymentVerification from '@/components/payment/PaymentVerification.vue';
import PaymentCardList from '@/components/payment/PaymentCardList.vue';
import PaymentNewCard from '@/components/payment/PaymentNewCard.vue';
import PaymentTransactionList from '@/components/payment/PaymentTransactionList.vue';
import FooterSection from '@/views/home/FooterSection.vue';

const step = ref('identifying'); // 'identifying' -> 'managing' -> 'adding'
const userEmail = ref('');
const userName = ref('');
const userId = ref('');
const verificationCode = ref('');
const errorMessage = ref('');

const handleVerified = (data: { email: string, code: string, userId?: string | null }) => {
  errorMessage.value = '';
  userEmail.value = data.email;
  verificationCode.value = data.code;
  if (data.userId) {
    userId.value = data.userId;
  } else {
    // Generate temporary or hash
    userId.value = data.email.replace(/[@.]/g, '_');
  }
  step.value = 'managing';
};

const handleComponentError = (msg: string) => {
  errorMessage.value = msg;
  step.value = 'identifying';
};
</script>

<template>
  <div class="wallet-page">
    <div class="container">
      <header class="wallet-header">
        <h1>Mi Billetera</h1>
        <p>Gestiona tus métodos de pago guardados de forma segura.</p>
      </header>

      <main class="wallet-content">
        <div class="card shadow-sm">
          <!-- Step 1: Verification -->
          <div v-if="step === 'identifying'">
            <div class="info-banner">
              <i class="fa-solid fa-shield-halved"></i>
              <span>Para acceder a tus tarjetas, por favor verifica tu identidad.</span>
            </div>
            <PaymentVerification 
              v-model:email="userEmail"
              v-model:name="userName"
              :error="errorMessage"
              @verified="handleVerified"
            />
          </div>

          <!-- Step 2: Manage -->
          <div v-else-if="step === 'managing'">
            <div class="user-info">
              <div class="avatar">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="details">
                <span class="email">{{ userEmail }}</span>
                <span class="status">Identidad Verificada</span>
              </div>
            </div>

            <hr />

            <PaymentCardList 
              :user-id="userId"
              :email="userEmail"
              :verification-code="verificationCode"
              @add-new="step = 'adding'"
              @error="handleComponentError"
            />

            <hr />

            <div class="transactions-section">
              <PaymentTransactionList 
                :user-id="userId" 
                :email="userEmail"
                :verification-code="verificationCode"
                @error="handleComponentError"
              />
            </div>
          </div>

          <!-- Step 3: Add New -->
          <div v-else-if="step === 'adding'">
            <h3>Agregar Nueva Tarjeta</h3>
            <PaymentNewCard 
              :user-id="userId"
              :user-email="userEmail"
              @cancel="step = 'managing'"
              @tokenized="step = 'managing'"
            />
          </div>
        </div>
      </main>
    </div>
    <FooterSection />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as colors;

.wallet-page {
  min-height: 100vh;
  background-color: colors.$background-light;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  flex: 1;
}

.wallet-header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: colors.$BRAND-PRIMARY;
    margin-bottom: 0.5rem;
  }

  p {
    color: colors.$text-light;
    font-size: 1.1rem;
  }
}

.card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.info-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: rgba(colors.$BRAND-PRIMARY, 0.05);
  padding: 1rem;
  border-radius: 12px;
  color: colors.$BRAND-PRIMARY;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;

  i {
    font-size: 1.5rem;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .avatar {
    width: 50px;
    height: 50px;
    background: colors.$BRAND-PRIMARY;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .details {
    display: flex;
    flex-direction: column;

    .email {
      font-weight: 600;
      color: colors.$text-dark;
    }

    .status {
      font-size: 0.75rem;
      color: #2e7d32;
      font-weight: bold;
      text-transform: uppercase;
    }
  }
}

.transactions-section {
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: colors.$text-dark;
    margin-bottom: 1rem;
  }

  .empty-state {
    font-size: 0.9rem;
    color: colors.$text-light;
    text-align: center;
    padding: 2rem;
    border: 1px dashed colors.$border-light;
    border-radius: 12px;
  }
}

hr {
  border: none;
  border-top: 1px solid colors.$border-light;
  margin: 1.5rem 0;
}

@media (max-width: 768px) {
  .container {
    padding: 2rem 1rem;
  }

  .wallet-header h1 {
    font-size: 2rem;
  }

  .card {
    padding: 1.5rem;
  }
}
</style>
