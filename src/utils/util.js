class util {
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }
    /**
     * Sets default properties on an object that aren't already specified.
     * @param {Object} def Default properties
     * @param {Object} given Object to assign defaults to
     * @returns {Object}
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
    static arr_diff(a1, a2) {

        var a = [], diff = [];
    
        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
    
        for (var o = 0; o < a2.length; o++) {
            if (a[a2[o]]) {
                delete a[a2[o]];
            } else {
                a[a2[o]] = true;
            }
        }
    
        for (var k in a) {
            diff.push(k);
        }
    
        return diff;
    }
}

module.exports = util;
