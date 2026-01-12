<script setup lang="ts">
import { type MenuCategory } from '@/constants/menu'

const props = defineProps<{
  category: MenuCategory
}>()
</script>

<template>
  <section class="menu-category">
    <div class="menu-category__header">
      <h2 class="menu-category__title">{{ props.category.title }}</h2>
      <p v-if="props.category.subtitle" class="menu-category__subtitle">{{ props.category.subtitle }}</p>
    </div>

    <div class="menu-category__items">
      <div v-for="(item, idx) in props.category.items" :key="idx" class="menu-item">
        <div class="menu-item__main">
          <span class="menu-item__name">{{ item.name }}</span>
          <span class="menu-item__dots"></span>
          <span v-if="item.price" class="menu-item__price">${{ item.price.toFixed(2) }}</span>
        </div>
        <p v-if="item.description" class="menu-item__description">{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.menu-category {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;

  &__title {
    font-family: $font-principal;
    color: $accent-gold;
    font-size: 1.75rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 2rem;
    position: relative;
    padding-bottom: 0.75rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background: $BRAND-BURGUNDY;
    }
  }

  &__items {
    display: grid;
    gap: 1.5rem;
  }
}

.menu-item {
  &__main {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  &__name {
    font-family: $font-principal;
    color: $white;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__dots {
    flex: 1;
    border-bottom: 1px dotted rgba($gray-500, 0.4);
  }

  &__price {
    color: $accent-gold;
    font-weight: 600;
  }

  &__description {
    color: $gray-400;
    font-size: 0.9rem;
    margin-top: 0.25rem;
    font-style: italic;
    line-height: 1.4;
  }
}

@media (min-width: 768px) {
  .menu-category {
    padding: 4rem 2rem;
  }
}
</style>
