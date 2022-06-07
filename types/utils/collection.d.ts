export = Collection;
/**
 * A Map with additional utility methods. This is used throughout twitch.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 */
declare class Collection {
    constructor(iterable: any);
    set(key: any, val: any): any;
    _array: any[];
    _keyArray: any[];
    delete(key: any): any;
    /**
     * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behavior, use `[...collection.values()]` or
     * `Array.from(collection.values())` instead.
     * @returns {Array}
     */
    array(): any[];
    /**
     * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behavior, use `[...collection.keys()]` or
     * `Array.from(collection.keys())` instead.
     * @returns {Array}
     */
    keyArray(): any[];
    /**
     * Obtains the first value(s) in this collection.
     * @param {number} [count] Number of values to obtain from the beginning
     * @returns {*|Array<*>} The single value if `count` is undefined, or an array of values of `count` length
     */
    first(count?: number): any | Array<any>;
    /**
     * Obtains the first key(s) in this collection.
     * @param {number} [count] Number of keys to obtain from the beginning
     * @returns {*|Array<*>} The single key if `count` is undefined, or an array of keys of `count` length
     */
    firstKey(count?: number): any | Array<any>;
    /**
     * Obtains the last value(s) in this collection. This relies on {@link Collection#array}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [count] Number of values to obtain from the end
     * @returns {*|Array<*>} The single value if `count` is undefined, or an array of values of `count` length
     */
    last(count?: number): any | Array<any>;
    /**
     * Obtains the last key(s) in this collection. This relies on {@link Collection#keyArray}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [count] Number of keys to obtain from the end
     * @returns {*|Array<*>} The single key if `count` is undefined, or an array of keys of `count` length
     */
    lastKey(count?: number): any | Array<any>;
    /**
     * Obtains random value(s) from this collection. This relies on {@link Collection#array}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [count] Number of values to obtain randomly
     * @returns {*|Array<*>} The single value if `count` is undefined, or an array of values of `count` length
     */
    random(count?: number): any | Array<any>;
    /**
     * Obtains random key(s) from this collection. This relies on {@link Collection#keyArray}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [count] Number of keys to obtain randomly
     * @returns {*|Array<*>} The single key if `count` is undefined, or an array of keys of `count` length
     */
    randomKey(count?: number): any | Array<any>;
    /**
     * Searches for a single item where its specified property's value is identical to the given value
     * (`item[prop] === value`), or the given function returns a truthy value. In the latter case, this is identical to
     * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
     * <warn>All collections used in twitch.js are mapped using their `id` property, and if you want to find by id you
     * should use the `get` method. See
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) for details.</warn>
     * @param {string|Function} propOrFn The property to test against, or the function to test with
     * @param {*} [value] The expected value - only applicable and required if using a property for the first argument
     * @returns {*}
     * @example
     * collection.find('username', 'Bob');
     * @example
     * collection.find(val => val.username === 'Bob');
     */
    find(propOrFn: string | Function, value?: any): any;
    /**
     * Searches for the key of a single item where its specified property's value is identical to the given value
     * (`item[prop] === value`), or the given function returns a truthy value. In the latter case, this is identical to
     * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex).
     * @param {string|Function} propOrFn The property to test against, or the function to test with
     * @param {*} [value] The expected value - only applicable and required if using a property for the first argument
     * @returns {*}
     * @example
     * collection.findKey('username', 'Bob');
     * @example
     * collection.findKey(val => val.username === 'Bob');
     */
    findKey(propOrFn: string | Function, value?: any): any;
    /**
     * Removes entries that satisfy the provided filter function.
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {Object} [thisArg] Value to use as `this` when executing function
     * @returns {number} The number of removed entries
     */
    sweep(fn: Function, thisArg?: any): number;
    /**
     * Identical to
     * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
     * but returns a Collection instead of an Array.
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {Object} [thisArg] Value to use as `this` when executing function
     * @returns {Collection}
     */
    filter(fn: Function, thisArg?: any): Collection;
    /**
     * Partitions the collection into two collections where the first collection
     * contains the items that passed and the second contains the items that failed.
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {Collection[]}
     * @example const [big, small] = collection.partition(guild => guild.memberCount > 250);
     */
    partition(fn: Function, thisArg?: any): Collection[];
    /**
     * Identical to
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     * @param {Function} fn Function that produces an element of the new array, taking three arguments
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {Array}
     */
    map(fn: Function, thisArg?: any): any[];
    /**
     * Identical to
     * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {Object} [thisArg] Value to use as `this` when executing function
     * @returns {boolean}
     */
    some(fn: Function, thisArg?: any): boolean;
    /**
     * Identical to
     * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {Object} [thisArg] Value to use as `this` when executing function
     * @returns {boolean}
     */
    every(fn: Function, thisArg?: any): boolean;
    /**
     * Identical to
     * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
     * and `collection`
     * @param {*} [initialValue] Starting value for the accumulator
     * @returns {*}
     */
    reduce(fn: Function, initialValue?: any): any;
    /**
     * Identical to
     * [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach),
     * but returns the collection instead of undefined.
     * @param {Function} fn Function to execute for each element
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {Collection}
     * @example
     * collection
     *  .tap(user => console.log(user.username))
     *  .filter(user => user.bot)
     *  .tap(user => console.log(user.username));
     */
    tap(fn: Function, thisArg?: any): Collection;
    /**
     * Creates an identical shallow copy of this collection.
     * @returns {Collection}
     * @example const newColl = someColl.clone();
     */
    clone(): Collection;
    /**
     * Combines this collection with others into a new collection. None of the source collections are modified.
     * @param {...Collection} collections Collections to merge
     * @returns {Collection}
     * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
     */
    concat(...collections: Collection[]): Collection;
    /**
     * Calls the `delete()` method on all items that have it.
     * @returns {Promise[]}
     */
    deleteAll(): Promise<any>[];
    /**
     * Checks if this collection shares identical key-value pairings with another.
     * This is different to checking for equality using equal-signs, because
     * the collections may be different objects, but contain the same data.
     * @param {Collection} collection Collection to compare with
     * @returns {boolean} Whether the collections have identical contents
     */
    equals(collection: Collection): boolean;
    /**
     * The sort() method sorts the elements of a collection in place and returns the collection.
     * The sort is not necessarily stable. The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * if omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     */
    sort(compareFunction?: Function): Collection;
}
//# sourceMappingURL=collection.d.ts.map