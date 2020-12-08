const snekfetch = require('snekfetch');
const constants = require('../../util/constants');

class APIRequest {
    constructor(rest, method, path, auth, data, files, reason) {
        this.rest = rest;
        this.client = rest.client;
        this.method = method;
        this.path = path.toString();
        this.auth = auth;
        this.data = data;
        this.files = files;
        this.route = this.getRoute(this.path);
        this.reason = reason;
    }

    getRoute(url) {
        const route = url.split('?')[0].split('/');
        const routeBucket = [];
        for (let i = 0; i < route.length; i++) {
            routeBucket.push(route[i]);
        }
        return routeBucket.join('/');
    }

    getAuth() {
        if (this.client.token && this.client.user && this.client.user.bot) {
            return `Bot ${this.client.token}`;
        } else if (this.client.token) {
            return this.client.token;
        }
        throw new Error(constants.Errors.NO_TOKEN);
    }

    gen() {
        const API = `${this.client.options.http.host}/api/v${this.client.options.http.version}`;
        const request = snekfetch[this.method](`${API}${this.path}`);
        if (this.auth) request.set('Authorization', this.getAuth());
        if (this.reason) request.set('X-Audit-Log-Reason', encodeURIComponent(this.reason));
        if (!this.rest.client.browser) request.set('User-Agent', this.sleept.userAgentManager.userAgent);
        if (this.files) {
            for (const file of this.files) if (file && file.file) request.attach(file.name, file.file, file.name);
            if (typeof this.data !== 'undefined') request.attach('payload_json', JSON.stringify(this.data));
        } else if (this.data) {
            request.send(this.data);
        }
        return request;
    }
}

module.exports = APIRequest;
