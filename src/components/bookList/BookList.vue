<template>
  <section>
    <div>
      <h2 v-if="store.getRecommendedBook">Recommended book</h2>
      <div class="book-list">
        <book-component v-if="store.getRecommendedBook" :book="store.getRecommendedBook"></book-component>
      </div>
    </div>
    <div v-for="(booksInGroup, groupKey) of groupedBooks.keys()" :key="groupKey">
      <h2>{{ getNotSpecifiedParam(booksInGroup) }}</h2>
      <ul class="book-list">
        <li v-for="book in groupedBooks.get(booksInGroup)" :key="book.id">
          <book-component :book="book" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import BookComponent from './BookComponent.vue';

import { Book, FilterUnion } from '@/types/common';
import { useBooksStore } from '@/stores/booksStore';

const store = useBooksStore();

const { groupedBooks } = defineProps({
  groupedBooks: {
    type: Map<FilterUnion, Book[]>,
    required: true,
  },
});

const getNotSpecifiedParam = <T,>(param: T) => {
  if (!param) {
    return 'not specified';
  } else return param;
};
</script>

<style lang="scss" scoped>
p,
h2 {
  text-transform: capitalize;
}

.book-list {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 0.75rem;
  margin-block: 1rem;
}

@media screen and (min-width: 48em) {
  .book-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (min-width: 62em) {
  .book-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
