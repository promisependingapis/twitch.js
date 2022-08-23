export = WSMananger;
/**
 * The manager for all things than envolve WebSocket.
 * @private
 */
declare class WSMananger {
    constructor(client: any);
    client: any;
    methods: WSMethods;
}
import WSMethods = require("./WSMethods");
//# sourceMappingURL=WSManager.d.ts.map