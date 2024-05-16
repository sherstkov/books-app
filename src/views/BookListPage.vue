<template>
  <main>
    <h1>Books List</h1>

    <BookFilter />
    <p v-if="store.loading">Loading...</p>
    <p v-else-if="store.error">{{ store.error }}</p>
    <!-- Check if groupedBooks is not empty -->
    <p v-else-if="!store.groupedBooksByFilter.size">No books has been found</p>
    <BookList v-else :groupedBooks="store.groupedBooksByFilter" />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBooksStore } from '@/stores/booksStore';

import BookFilter from '@/components/bookList/BookFilter.vue';
import BookList from '@/components/bookList/BookList.vue';

const store = useBooksStore();

onMounted(() => {
  store.fetchBooks();
});
</script>
