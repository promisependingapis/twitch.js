exports.Package = require('../../package.json');

exports.Errors = {
    INVALID_RATE_LIMIT_METHOD: 'Unknown rate limiting method.',
    INVALID_TOKEN: 'An invalid token was provided.'
};

exports.Events = {
    RATE_LIMIT: 'rateLimit',
    READY: 'ready'
};

/** @todo: Endpoints */