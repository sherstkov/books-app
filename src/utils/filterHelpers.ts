/**
 * Groups an array of objects by a key. If the key maps to an array, it uses groupByArray,
 * otherwise it uses groupByPrimitive.
 * @template T - The type of the objects in the array.
 * @template K - The key of the property to group by, which is a keyof T.
 * @param {K} key - The key to group the items by.
 * @param {T[]} items - The array of items to group.
 * @returns {Map<T[K], T[]>} A map of arrays of items grouped by the given key.
 */
export const groupBy = <T, K extends keyof T>(key: K, items: T[]): Map<T[K], T[]> => {
  if (items.length && Array.isArray(items[0][key])) {
    return groupByArray(key, items);
  } else {
    return groupByPrimitive(key, items);
  }
};

/**
 * Groups an array of objects by a primitive key.
 * @template T - The type of the objects in the array.
 * @template K - The key of the property to group by, which is a keyof T.
 * @param {K} key - The key to group the items by.
 * @param {T[]} items - The array of items to group.
 * @returns {Map<T[K], T[]>} A map of arrays of items grouped by the given key.
 */
const groupByPrimitive = <T, K extends keyof T>(key: K, items: T[]): Map<T[K], T[]> => {
  const resultMap = new Map<T[K], T[]>();

  items.forEach(item => {
    const keyValue = item[key];
    setMapValue(resultMap, keyValue, item);
  });

  return sortMapByNumber(resultMap);
};

/**
 * Groups an array of objects by a nested array key.
 * @template T - The type of the objects in the array.
 * @template K - The key of the property to group by, which is a keyof T.
 * @param {K} key - The key to group the items by.
 * @param {T[]} items - The array of items to group.
 * @returns {Map<T[K], T[]>} A map of arrays of items grouped by the values of the nested array key.
 */
const groupByArray = <T, K extends keyof T>(key: K, items: T[]): Map<T[K], T[]> => {
  const resultMap = new Map<T[K], T[]>();

  items.forEach(item => {
    const nestedItems = item[key] as T[K][];

    nestedItems.forEach(nestedItem => {
      setMapValue(resultMap, nestedItem, item);
    });
  });

  return sortMapDefault(resultMap);
};

/**
 * Sets a value in a map with a key. If the key doesn't exist, it initializes an array with the value.
 * If the key exists, it pushes the value to the existing array.
 * @template T - The type of the value in the array.
 * @template K - The type of the key in the map.
 * @param {Map<K, T[]>} map - The map to set the value in.
 * @param {K} key - The key to set the value for.
 * @param {T} value - The value to set.
 */
const setMapValue = <T, K>(map: Map<K, T[]>, key: K, value: T) => {
  if (!map.has(key)) {
    map.set(key, [value]);
  } else {
    map.get(key)!.push(value);
  }
};

/**
 * Sorts a map by the keys which are numbers in descending order.
 *
 * @param {Map<K, V[]>} map - The map to be sorted by number keys.
 * @return {Map<K, V[]>} A new map sorted by number keys in descending order.
 */
const sortMapByNumber = <K, V>(map: Map<K, V[]>): Map<K, V[]> => {
  return new Map(Array.from(map).sort(([a], [b]) => Number(b) - Number(a)));
};

/**
 * Sorts the given map by its keys in ascending order.
 *
 * @param {Map<K, V[]>} map - The map to be sorted
 * @return {Map<K, V[]>} A new map with the sorted entries
 */
const sortMapDefault = <K, V>(map: Map<K, V[]>): Map<K, V[]> => {
  return new Map(Array.from(map).sort());
};
