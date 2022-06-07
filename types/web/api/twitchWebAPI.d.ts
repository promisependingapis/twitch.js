export = twitchRequest;
/**
 * Api for making http requests to twitch
 * @class TwitchWebAPI
 * @param {Object} options - Options for the twitch http request api
 */
declare class twitchRequest {
    constructor(options: any);
    /**
     * Do a http request to twitch web api
     * @param {string} [method] The http method to use
     * @param {string} [path] The path to the api endpoint
     * @param {object} [options] The options for the request
     */
    request(method?: string, path?: string, options?: object): any;
}
//# sourceMappingURL=twitchWebAPI.d.ts.map