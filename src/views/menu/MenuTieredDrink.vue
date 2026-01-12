<script setup lang="ts">
import { type MenuCategory } from '@/constants/menu'

const props = defineProps<{
  category: MenuCategory
}>()

const hasCopa = props.category.items.some(i => i.priceCopa !== undefined)
const hasVaso = props.category.items.some(i => i.priceVaso !== undefined)
const hasBotella = props.category.items.some(i => i.priceBotella !== undefined)
</script>

<template>
  <section class="tiered-drink">
    <div class="tiered-drink__header">
      <h2 class="tiered-drink__title">{{ props.category.title }}</h2>
      <div class="tiered-drink__legend">
        <span v-if="hasVaso || hasCopa">{{ hasCopa ? 'COPA' : 'VASO' }}</span>
        <span v-if="hasBotella">BOTELLA</span>
      </div>
    </div>

    <div class="tiered-drink__items">
      <div v-for="(item, idx) in props.category.items" :key="idx" class="drink-item">
        <div class="drink-item__info">
          <span class="drink-item__name">{{ item.name }}</span>
          <p v-if="item.description" class="drink-item__description">{{ item.description }}</p>
        </div>
        <div class="drink-item__prices">
          <span v-if="hasVaso || hasCopa" class="drink-item__price">
            {{ item.priceVaso ? '$' + item.priceVaso.toFixed(2) : (item.priceCopa ? '$' + item.priceCopa.toFixed(2) : '-') }}
          </span>
          <span v-if="hasBotella" class="drink-item__price">
            {{ item.priceBotella ? '$' + item.priceBotella.toFixed(2) : '-' }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.tiered-drink {
  padding: 2rem 1rem;
  max-width: 900px;
  margin: 0 auto;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid $BRAND-BURGUNDY;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
  }

  &__title {
    font-family: $font-principal;
    color: $accent-gold;
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }

  &__legend {
    display: flex;
    gap: 2rem;
    font-size: 0.8rem;
    color: $gray-400;
    font-weight: 600;
    letter-spacing: 1px;

    span {
      width: 70px;
      text-align: right;
    }
  }

  &__items {
    display: grid;
    gap: 1rem;
  }
}

.drink-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba($gray-700, 0.3);

  &:last-child {
    border-bottom: none;
  }

  &__info {
    flex: 1;
    padding-right: 1rem;
  }

  &__name {
    font-family: $font-principal;
    color: $white;
    font-size: 1rem;
    text-transform: uppercase;
  }

  &__description {
    color: $gray-500;
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }

  &__prices {
    display: flex;
    gap: 2rem;

    .drink-item__price {
      width: 70px;
      text-align: right;
      color: $accent-gold;
      font-weight: 600;
      font-size: 0.95rem;
    }
  }
}

@media (min-width: 768px) {
  .tiered-drink {
    padding: 3rem 2rem;

    &__title {
      font-size: 2rem;
    }
  }

  .drink-item {
    &__name {
      font-size: 1.1rem;
    }
  }
}
</style>
