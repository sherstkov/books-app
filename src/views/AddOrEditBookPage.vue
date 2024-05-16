<template>
  <section class="add-or-edit-book-page">
    <p v-if="store.loading">Loading...</p>
    <p v-else-if="store.error">{{ store.error }}</p>
    <form v-else @submit="onSubmit">
      <base-card>
        <template #content>
          <article class="book-form">
            <div>
              <label for="name">Book Name</label>
              <input id="name" name="name" v-model="name" type="text" placeholder="The Pragmatic Programmer" />
              <span>{{ errors.name }}</span>
            </div>

            <div>
              <label for="authors">Authors</label>
              <input
                id="authors"
                name="authors"
                v-model="authors"
                type="text"
                placeholder="Andrew Hunt, David Thomas"
              />
              <span>{{ errors.authors }}</span>
            </div>

            <div>
              <label for="publicationYear">Publication Year</label>
              <input
                id="publicationYear"
                name="publicationYear"
                v-model="publicationYear"
                type="number"
                placeholder="1999"
              />
              <span>{{ errors.publicationYear }}</span>
            </div>

            <div>
              <label>Rating</label>
              <rating-component :rating="rating" @update:rating="setRating" />
              <span>{{ errors.rating }}</span>
            </div>

            <div>
              <label for="isbn">ISBN</label>
              <input id="isbn" name="isbn" v-model="isbn" type="text" placeholder="9780132119177" />
              <span>{{ errors.isbn }}</span>
            </div>

            <base-button type="submit">{{ editingBookId ? 'Update' : 'Submit' }}</base-button>
          </article>
        </template>
      </base-card>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import * as zod from 'zod';
import { useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { authorsRegex, isbnRegex } from '@/utils/regexHelpers';
import RatingComponent from '@/components/RatingComponent.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { useBooksStore } from '@/stores/booksStore';
import { Book } from '@/types/common';
import { useRouter } from 'vue-router';
import { routeTo } from '@/router';

const store = useBooksStore();
const router = useRouter();

const editingBookId = computed(() => router.currentRoute.value.params.id);

const validationSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(1, 'Book name is required').max(100),
    authors: zod.string().regex(authorsRegex, 'Invalid author/authors name').min(1),
    publicationYear: zod.number().int().min(1800, 'Number should be greater than 1800').nullable(),
    rating: zod.number().int().min(0).max(10).default(0),
    isbn: zod.string().regex(isbnRegex, 'Invalid ISBN').default(''),
  })
);

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema,
});

const { value: name, setValue: setName } = useField<Book['name']>('name');
const { value: authors, setValue: setAuthors } = useField<string>('authors');
const { value: publicationYear, setValue: setPublicationYear } = useField<Book['publicationYear']>('publicationYear');
const { value: rating, setValue: setRating } = useField<Book['rating']>('rating');
const { value: isbn, setValue: setIsbn } = useField<Book['ISBN']>('isbn');

const loadBookData = (bookId: string) => {
  /* getting book data from store */
  const book = store.getBookById(bookId);

  if (book) {
    setName(book.name);
    setAuthors(book.authors.join(', '));
    setPublicationYear(book.publicationYear || null);
    setRating(book.rating || 0);
    setIsbn(book.ISBN || '');
  } else router.push({ name: routeTo('AddBook') });
  /* if book not found, redirect to add book page */
};

const onSubmit = handleSubmit(async values => {
  const bookData = {
    name: values.name,
    /* Get splited string by comma to array of authors */
    authors: values.authors.split(',').map(author => author.trim()),
    publicationYear: values.publicationYear ? values.publicationYear : null,
    rating: values.rating,
    ISBN: values.isbn,
  } as Omit<Book, 'id'>;

  if (editingBookId.value) {
    await store.updateBook({ ...bookData, id: editingBookId.value as string });
  } else {
    await store.addBook(bookData);
  }
  await router.push({ name: routeTo('BooksList') });
});

/**
 * Checks if the current route is an edit route or add route and resets the form accordingly
 */
function resetFormCheck() {
  if (!editingBookId.value) {
    resetForm();
  } else {
    loadBookData(editingBookId.value as string);
  }
}

/** Watch for route changes and reset the form if needed  */
watch(() => editingBookId.value, resetFormCheck, { immediate: true });
</script>

<style lang="scss" scoped>
.add-or-edit-book-page {
  max-width: 400px;
  margin: 10em auto 0;
}
form .book-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  label {
    padding-bottom: 0.5rem;
  }
}

@media screen and (max-width: 48em) {
  .add-or-edit-book-page {
    max-width: 100%;
    margin: 0 auto;
  }
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:focus {
  outline: none;
  border-color: var(--clr-accent);
}

span {
  color: red;
  font-size: 14px;
}
</style>
