<template>
  <div class="layout-wrapper">
    <TheHeader />
    <main class="layout-wrapper__main"><router-view /></main>
    <TheFooter />
  </div>
</template>

<script lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
export default {
  name: 'MainLayout',
  components: {
    TheHeader,
    TheFooter,
  },
};
</script>

<style lang="scss" scoped>
.layout-wrapper {
  min-height: 100vh;
  /* fallback for old browsers */
  min-height: 100dvh;

  display: grid;
  grid-template-rows: auto 1fr auto;

  &__main {
    width: min(1160px, 100% - 4rem);
    margin-inline: auto;
  }
}
</style>
