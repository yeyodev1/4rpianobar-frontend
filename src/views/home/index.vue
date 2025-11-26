<script setup lang="ts">
import FeaturedDish from './FeaturedDish.vue'
import HeroSection from './HeroSection.vue'
import HeaderBar from '../../components/layout/HeaderBar.vue'
import LocationsSection from './LocationsSection.vue'
import AtmosphereSection from './AtmosphereSection.vue'
import FoodGallery from './FoodGallery.vue'
import FooterSection from './FooterSection.vue'
</script>

<template>
  <HeroSection />

  <main>
    <section class="intro">
      <h2>SIENTE LA FIESTA, VIVE LA EXPERIENCIA</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga sint expedita facilis optio odit, velit blanditiis autem labore laborum similique sit quaerat eum natus temporibus accusamus, voluptatum dicta delectus modi?
        Doloribus aut vitae repellat id odit praesentium rem hic accusantium amet, earum ipsa nostrum repudiandae eius, facere cum? Aliquam culpa maxime laboriosam omnis maiores asperiores modi tempore aliquid quam saepe?
        Doloribus nam vitae eveniet dignissimos facilis a iste consequatur vero veniam sed esse, aliquam blanditiis impedit tenetur fugit hic? Eaque, iste? Consequuntur, id nihil. Omnis quo impedit rem quam itaque!
      </p>
    </section>

    <FeaturedDish />

    <LocationsSection />

    <AtmosphereSection/>

    <FoodGallery />
  </main>

  <FooterSection />
</template>

<style lang="scss" scoped>
main {
  display: grid;
  gap: 48px;
}

.intro {
  padding: 16px 20px;
}

.intro h2 {
  font-family: $font-principal;
  color: $BRAND-BURGUNDY;
  font-size: 1.6rem;
  line-height: 1.2;
}

.intro p {
  color: $gray-300;
  font-size: 0.95rem;
  line-height: 1.7;
  max-width: 60ch;
  width: 100%;
  margin: 12px auto 0;
  overflow-wrap: anywhere;
  hyphens: auto;
}


/* gallery styles moved to GalleryGrid.vue */

@media (min-width: 768px) {
  .content h2 {
    font-size: 48px;
  }



  .intro {
    text-align: center;
    padding: 24px;
  }

  .intro h2 {
    font-size: 2.25rem;
  }

  .intro p {
    font-size: 1.05rem;
    max-width: 70ch;
  }
}
</style>
