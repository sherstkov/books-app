import { defineStore } from 'pinia';
import { firestore } from '@/services/firebase/firebase';
import {
  collectionGroup,
  getDocs,
  query,
  orderBy,
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
} from '@firebase/firestore';

import { groupBy } from '@/utils/filterHelpers';

import type { Book, Filter, FilterUnion } from '@/types/common';

export const useBooksStore = defineStore({
  id: 'books',
  state: () => ({
    /** @type {Book[]} An array of books */
    books: [] as Book[],

    /** @type {boolean} Loading state for books manipulations */
    loading: false,

    /** @type {string} Error message if action fails */
    error: '',

    /** @type {Filter} The current filter value */
    filter: 'publicationYear' as Filter,
  }),
  getters: {
    /**
     * Returns a Map object that groups the books by the current filter value.
     *
     * @return {Map<FilterUnion, Book[]>} A Map object where the keys are the filter values and the values are arrays of books.
     */
    groupedBooksByFilter(): Map<FilterUnion, Book[]> {
      return groupBy(this.filter, this.books);
    },

    /**
     * Returns a book object by its id.
     *
     * @param {string} id - The id of the book to retrieve.
     * @return {Book | undefined} The book object if found, otherwise undefined.
     */
    getBookById:
      state =>
      (id: string): Book | undefined => {
        return state.books.find(book => book.id === id);
      },

    /**
     * Returns a randomly selected book from highly rated books published 3 or more years ago.
     *
     * @return {Book | undefined} A randomly selected book matching the criteria, or undefined if no match is found.
     */
    getRecommendedBook: state => {
      /* Find books published 3+ years ago */
      const currentYear = new Date().getFullYear();
      const oldEnoughBooks = state.books.filter(book => {
        return book.publicationYear !== null && currentYear - book.publicationYear >= 3;
      });

      if (oldEnoughBooks.length === 0) return undefined;

      /* Find the highest rated books published 3+ years ago */
      let maxRating = 0,
        highestRatedBooks: Book[] = [];
      oldEnoughBooks.map(book => {
        if (book.rating > maxRating) {
          maxRating = book.rating;
          highestRatedBooks = [book];
        } else if (maxRating == book.rating) {
          highestRatedBooks.push(book);
        }
      });

      /* Randomly select a book from the highest rated books */
      const randomIndex = Math.floor(Math.random() * highestRatedBooks.length);
      return highestRatedBooks[randomIndex];
    },
  },
  actions: {
    /**
     * Helper function that executes a task with loading and error handling.
     *
     * @param {() => Promise<T>} task - The task to be executed.
     */
    async withLoadingAndErrorHandling<T>(task: () => Promise<T>) {
      try {
        this.loading = true;
        this.error = '';

        /** Task execution */
        await task();
      } catch (error) {
        console.error('Error: ', error);

        /** Error handling */
        if (typeof error === 'string') {
          this.error = error;
        } else if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Something went wrong';
        }
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetches a list of books from Firestore database, orders them by name,
     * and sets the result to the `books` state property. It handles loading state
     * and possible errors during the fetch operation.
     */
    async fetchBooks() {
      this.withLoadingAndErrorHandling(async () => {
        const ref = collectionGroup(firestore, 'books');
        const booksQuery = query(ref, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(booksQuery);
        this.books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Book[];
      });
    },

    /**
     * Adds a new book to the Firestore database. After using make sure bookList is fetched again. It handles loading state
     * and possible errors during the fetch operation.
     * @param {Book} newBook - The new book to add. Book type but without ID param.
     */

    async addBook(newBook: Omit<Book, 'id'>) {
      this.withLoadingAndErrorHandling(async () => {
        await addDoc(collection(firestore, 'books'), newBook);
      });
    },

    /**
     * Updates an existing book in the Firestore database. After updating, make sure to fetch the book list again. It handles loading state
     * and possible errors during the update operation.
     * @param {Book} updatedBook - The updated book object.
     */
    async updateBook(updatedBook: Book) {
      /* Find the index of the book to update */
      const index = this.books.findIndex(book => book.id === updatedBook.id);
      if (index === -1) {
        throw new Error('Book not found');
      }

      /* Update the book from Firestore */
      this.withLoadingAndErrorHandling(async () => {
        const docRef = doc(collection(firestore, 'books'), updatedBook.id);
        await updateDoc(docRef, updatedBook);
      });

      /* Update the book in the store */
      this.books[index] = updatedBook;
    },

    /**
     * Deletes a book from the Firestore database. After deletion, make sure to fetch the book list again. It handles loading state
     * and possible errors during the deletion operation.
     * @param {string} bookId - The ID of the book to delete.
     */
    async deleteBook(bookId: string) {
      /* Find the index of the book to delete */
      const index = this.books.findIndex(book => book.id === bookId);
      if (index === -1) {
        throw new Error('Book not found');
      }

      /* Delete the book from Firestore */
      this.withLoadingAndErrorHandling(async () => {
        const docRef = doc(collection(firestore, 'books'), bookId);
        await deleteDoc(docRef);
      });

      /* Remove the book from the store */
      this.books.splice(index, 1);
    },
  },
});
