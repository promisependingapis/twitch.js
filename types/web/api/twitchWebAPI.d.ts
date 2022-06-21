export = TwitchRequest;
/**
 * Api for making http requests to twitch
 */
declare class TwitchRequest {
    /**
     * @class
     * @param {object} [options] - Options for the twitch http request api
     */
    constructor(options?: object);
    /**
     * Do a http request to twitch web api
     * @param {string} [method] The http method to use
     * @param {string} [path] The path to the api endpoint
     * @param {object} [options] The options for the request
     * @returns {Promise<any>} A promise that resolves to the response from twitch
     */
    request(method?: string, path?: string, options?: object): Promise<any>;
}
//# sourceMappingURL=twitchWebAPI.d.ts.map