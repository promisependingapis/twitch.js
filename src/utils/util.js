// eslint-disable-next-line strict
'use strict';

/**
 * Utility Class
 * @private
 */
class util {
    /**
     * @class
     */
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }
    /**
     * Sets default properties on an object that aren't already specified.
     * @param {object} [def] Default properties
     * @param {object} [given] Object to assign defaults to
     * @returns {object}
     * @private
     */
    static mergeDefault(def, given) {
        if (!given) return def;
        for (const key in def) {
            if (!{}.hasOwnProperty.call(given, key)) {
                given[key] = def[key];
            } else if (given[key] === Object(given[key])) {
                given[key] = this.mergeDefault(def[key], given[key]);
            }
        }
        return given;
    }
}

module.exports = util;
