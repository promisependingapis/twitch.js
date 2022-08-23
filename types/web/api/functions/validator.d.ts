export = validator;
/**
 * The class for the validator function
 */
declare class validator {
    /**
     * @class
     * @param {object} [options] - The options for the validator
     */
    constructor(options?: object);
    /**
     * validate the token on twitch's servers
     * @param {string} token the token to validate
     * @returns {Promise<any>} a promise that resolves to the token if valid, or rejects with an error
     */
    validate(token: string): Promise<any>;
}
//# sourceMappingURL=validator.d.ts.map