<template>
  <button :class="['base-button', sizeClass, colorClass]" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script lang="ts">
export default {
  name: 'BaseButton',
  props: {
    size: {
      type: String,
      default: 'md',
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
  computed: {
    sizeClass() {
      return 'base-button--' + this.size;
    },
    colorClass() {
      return 'base-button--' + this.color;
    },
  },
};
</script>

<style lang="scss" scoped>
.base-button {
  display: block;
  width: 100%;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  text-transform: capitalize;

  &:hover,
  &:active {
    opacity: 0.8;
  }

  /* Sizes */
  &--md {
    font-size: 1rem;
    padding: 0.625rem;
    font-weight: 400;
    font-weight: var(--fw-normal);
  }

  &--sm {
    font-size: 0.875rem;
    padding: 0.5rem;
    font-weight: var(--fw-normal);
  }

  &--lg {
    font-size: 1.25rem;
    padding: 0.75rem;
    font-weight: var(--fw-medium);
  }

  /* Colors */
  &--primary {
    background-color: var(--clr-primary);
    color: var(--clr-text);
  }

  &--brand {
    background-color: var(--clr-brand);
    color: var(--clr-text);
  }
}
</style>
