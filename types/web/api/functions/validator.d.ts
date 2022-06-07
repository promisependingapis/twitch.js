export = validator;
/**
 * The class for the validator function
 * @class Validator
 * @param {Object} options - The options for the validator
 */
declare class validator {
    constructor(options: any);
    /**
     * validate the token on twitch's servers
     * @param {string} token the token to validate
     * @returns {Promise<any} a promise that resolves to the token if valid, or rejects with an error
     */
    validate(token: string): Promise<any>;
}
//# sourceMappingURL=validator.d.ts.map