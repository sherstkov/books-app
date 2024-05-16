<template>
  <div class="book-filter">
    <select v-model="selectedFilter" @change="handleFilterChange">
      <option v-for="option in filterOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { filterOptions } from '@/constants';
import { useBooksStore } from '@/stores/booksStore';

import type { Filter } from '@/types/common';

const router = useRouter();
const store = useBooksStore();

const getUrlFilter = (urlFilter: Filter) => {
  let filter: Filter = filterOptions[0].value;
  /** Validate filter from URL */
  if (urlFilter && filterOptions.some(option => option.value === urlFilter)) {
    filter = urlFilter;
  }

  return filter;
};

/** Extract and basically validate the filter from the route */
const selectedFilter = ref<Filter>(getUrlFilter(router.currentRoute.value.query.filter as Filter));

/** Set the filter when the component is mounted */
onMounted(handleFilterChange);

async function handleFilterChange() {
  try {
    /** Push the new route based on selected filter and patch the store */
    store.$patch({ filter: selectedFilter.value });
    await router.push({ query: { filter: selectedFilter.value } });
  } catch (error) {
    console.error('Failed to update route:', error);
  }
}
</script>

<style scoped>
.book-filter {
  display: flex;
  justify-content: flex-end;
}
</style>
