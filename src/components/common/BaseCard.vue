<template>
  <article class="base-card">
    <header>
      <p class="base-card__title"><slot name="title"></slot></p>
    </header>
    <main class="base-card__content">
      <slot name="content"></slot>
    </main>
    <footer class="base-card__additional">
      <slot name="additional"></slot>
    </footer>
  </article>
</template>

<script lang="ts">
export default {
  name: 'BaseCard',
};
</script>

<style scoped>
.base-card {
  border: 1px solid var(--clr-accent);
  border-radius: 4px;
  padding: 0.75rem;
  height: 100%;

  .base-card__title {
    font-size: var(--fs-large);
    font-weight: var(--fw-medium);
  }
}

.base-card > .base-card__additional {
  color: var(--clr-accent);
  font-size: var(--fs-small);
}
</style>
