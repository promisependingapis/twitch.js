/**
 * A base class for different types of rate limiting handlers for the REST API.
 * @private
 */

class RequestHandler {
  /**
   * @param {SLEEPTMananger} sleeptMananger The SleepT to use
   */
  constructor(sleeptMananger) {
    /**
     * The RESTManager that instantiated this RequestHandler
     * @type {SLEEPTManager}
     */
    this.restManager = sleeptMananger;

    /**
     * A list of requests that have yet to be processed
     * @type {APIRequest[]}
     */
    this.queue = [];
  }
  /**
   * Whether or not the client is being rate limited on every endpoint
   * @type {boolean}
   * @readonly
   */
  get globalLimit() {
    return this.sleeptMananger.globallyRateLimited;
  }

  set globalLimit(value) {
    this.sleeptMananger.globallyRateLimited = value;
  }

  /**
   * Push a new API request into this bucket.
   * @param {APIRequest} request The new request to push into the queue
   */
  push(request) {
    this.queue.push(request);
  }

  /**
   * Attempts to get this RequestHandler to process its current queue.
   */
  handle() {} // eslint-disable-line no-empty-function

  destroy() {
    this.queue = [];
  }
}

module.exports = RequestHandler;
