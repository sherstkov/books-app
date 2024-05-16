/**
 * Regular expression for validating a string containing authors' names separated by commas.
 */
export const authorsRegex =
  /^(?:(?:[a-zA-Z\u0401\u0451\u0410-\u044f]+(?:\.\s[a-zA-Z\u0401\u0451\u0410-\u044f]+|\-|\s[a-zA-Z\u0401\u0451\u0410-\u044f]+)*)(?:(?:,\s)?|$))+/g;

/**
 * Regular expression pattern for validating ISBN.
 */
export const isbnRegex =
  /^$|^(?=[0-9]{10}$|(?=(?:[0-9]+[-●]){3})[-●0-9]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[-●]){4})[-●0-9]{17}$)(?:97[89][-●]?)?[0-9]{0,5}[-●]?[0-9]*[-●]?[0-9]*[-●]?[0-9]*$/g;
