const UserAgentManager = require('./UserAgentManager')

class SLEEPTMananger {
    constructor(client) {
        this.client = client;
        this.handlers = {};
        this.userAgentManager = new UserAgentManager(this);
    }
}