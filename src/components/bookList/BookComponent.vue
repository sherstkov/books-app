<template>
  <base-card>
    <template #title>
      {{ book.name }}
    </template>
    <template #content>
      <p class="book__authors">
        {{ getAuthorsJoined(book.authors) }}
      </p>
      <p v-if="book.publicationYear">Published in {{ book.publicationYear }}</p>
    </template>
    <template #additional>
      <rating-component v-if="book.rating" :rating="book.rating" :is-editable="false" />
      <p v-if="book.ISBN">ISBN {{ book.ISBN }}</p>
      <div class="book__buttons">
        <base-button size="lg" color="brand" @click="redirectToEditPage(book.id)">edit</base-button>
        <base-button size="lg" color="brand" @click="deleteBook(book.id)">delete</base-button>
      </div>
    </template>
  </base-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useBooksStore } from '@/stores/booksStore';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import RatingComponent from '@/components/RatingComponent.vue';

import { routeTo } from '@/router';

import type { Book } from '@/types/common';

defineProps({
  book: {
    type: Object as () => Book,
    required: true,
  },
});

const router = useRouter();
const store = useBooksStore();

const getAuthorsJoined = (authors: string[]) => {
  return authors.join(', ');
};
const redirectToEditPage = (bookId: string) => {
  router.push({ name: routeTo('EditBook'), params: { id: bookId } });
};

const deleteBook = (bookId: string) => {
  store.deleteBook(bookId);
};
</script>

<style scoped>
.book__authors {
  color: var(--clr-accent);
}

.book__buttons {
  width: 50%;
  display: flex;
  margin-top: 0.5rem;
  gap: 0.5rem;
}
</style>
