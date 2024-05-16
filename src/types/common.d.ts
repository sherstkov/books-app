import { filterOptions } from '@/constants';

/**
 * Represents a book.
 * @typedef {Object} Book
 * @property {string} id - Firebase ID of the book.
 * @property {string} name - The name of the book.
 * @property {string[]} authors - The authors of the book.
 * @property {number|null} publicationYear - The publication year of the book (nullable).
 * @property {number} rating - The rating of the book.
 * @property {string} ISBN - The ISBN of the book.
 */
export type Book = {
  id: string;
  name: string;
  authors: Array<string>;
  publicationYear: number | null;
  rating: number;
  ISBN: string;
};

/**
 * Represents a filter option.
 * @typedef {string} Filter
 */
export type Filter = (typeof filterOptions)[number]['value'];

/**
 * Represents a union of possible filters for books.
 * @typedef {string|number|null} FilterUnion
 */
export type FilterUnion = Book['publicationYear'] | Book['authors'];
