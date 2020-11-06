function colorParser(Text, color) {
    
}


var DateParser = require('./DateParser');

var debug = false;

function log(Gravity) {
    return function(message) {
        console.log(`%c[${DateParser.getTime()}] `, 'color: #FF0000')
    }
}

function logger(Gravity) {
    if (debug && Gravity === 'Debug') {

    } else {
        if (Gravity !== 'Debug') {
            return log(Gravity)
        }
    }
}

module.exports = {
    Error: logger('Error'),
    Warn: logger('Warn'),
    Info: logger('Info'),
    Debug: logger('Debug')
}