"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const interfaces_1 = require("../interfaces");
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor({ prefix, debug, defaultLevel, coloredBackground, disableFatalCrash }) {
        this.defaultLevel = interfaces_1.ELoggerLevel.LOG;
        this.debugActive = false;
        this.prefix = prefix !== null && prefix !== void 0 ? prefix : '';
        this.debugActive = debug !== null && debug !== void 0 ? debug : false;
        this.defaultLevel = defaultLevel !== null && defaultLevel !== void 0 ? defaultLevel : interfaces_1.ELoggerLevel.INFO;
        this.coloredBackground = coloredBackground !== null && coloredBackground !== void 0 ? coloredBackground : false;
        this.disableFatalCrash = disableFatalCrash !== null && disableFatalCrash !== void 0 ? disableFatalCrash : false;
        this.colors = {
            info: '#cc80ff',
            warn: '#ff8a1c',
            error: '#ff4a4a',
        };
    }
    getFormattedPrefix() {
        var prefix = '';
        prefix += chalk_1.default.hex('#5c5c5c')('[');
        prefix += chalk_1.default.gray(this.prefix);
        prefix += chalk_1.default.hex('#5c5c5c')(']');
        return this.prefix !== '' ? prefix : '';
    }
    getTime() {
        const time = new Date(Date.now());
        const seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
        const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        const hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        return `[${hours}:${minutes}:${seconds}]`;
    }
    info(text, ...args) {
        var textConstructor = '';
        textConstructor += this.coloredBackground ? this.getTime() : chalk_1.default.hex(this.colors.info)(this.getTime());
        textConstructor += this.coloredBackground ? `[${this.prefix}]` : this.getFormattedPrefix();
        textConstructor += ' Info:';
        if (this.coloredBackground) {
            textConstructor = chalk_1.default.bgHex(this.colors.info)(chalk_1.default.black(textConstructor));
        }
        textConstructor += ' ' + text;
        if ((!args && !(args instanceof Boolean)) || ((args instanceof Array) && args.length === 0)) {
            console.log(textConstructor);
        }
        else {
            console.log(textConstructor, args);
        }
    }
    warn(text, ...args) {
        var textConstructor = '';
        textConstructor += this.coloredBackground ? this.getTime() : chalk_1.default.hex(this.colors.warn)(this.getTime());
        textConstructor += this.coloredBackground ? `[${this.prefix}]` : this.getFormattedPrefix();
        textConstructor += ` ${text.toString().toLowerCase().split(' ')[0].includes('warn') ? '' : 'Warn:'}`;
        if (this.coloredBackground) {
            textConstructor = chalk_1.default.bgHex(this.colors.warn)(chalk_1.default.black(textConstructor));
        }
        textConstructor += ' ' + text;
        if ((!args && !(args instanceof Boolean)) || ((args instanceof Array) && args.length === 0)) {
            console.warn(textConstructor);
        }
        else {
            console.warn(textConstructor, args);
        }
    }
    error(text, ...args) {
        var textConstructor = '';
        textConstructor += this.coloredBackground ? this.getTime() : chalk_1.default.hex(this.colors.error)(this.getTime());
        textConstructor += this.coloredBackground ? `[${this.prefix}]` : this.getFormattedPrefix();
        textConstructor += `${text.toString().toLowerCase().split(' ')[0].includes('error') ? '' : ' Error:'}`;
        if (this.coloredBackground) {
            textConstructor = chalk_1.default.bgHex(this.colors.error)(chalk_1.default.black(textConstructor));
        }
        textConstructor += ' ' + text;
        if ((!args && !(args instanceof Boolean)) || ((args instanceof Array) && args.length === 0)) {
            console.error(textConstructor);
        }
        else {
            console.error(textConstructor, args);
        }
    }
    fatal(text, ...args) {
        var textConstructor = '';
        textConstructor += chalk_1.default.hex('#ff5647')(this.getTime());
        textConstructor += this.getFormattedPrefix();
        textConstructor += ` Fatal${text.toString().toLowerCase().split(' ')[0].includes('error') ? '' : ':'} `;
        textConstructor += text.toString().split('\n')[0];
        textConstructor = chalk_1.default.bgWhite(chalk_1.default.red(textConstructor));
        textConstructor += '\n';
        textConstructor += text.toString().split('\n').slice(1).join('\n');
        if ((!args && !(args instanceof Boolean)) || ((args instanceof Array) && args.length === 0)) {
            console.error(textConstructor);
        }
        else {
            console.error(textConstructor, args);
        }
        if (!this.disableFatalCrash) {
            process.exit(5);
        }
    }
    debug(text, ...args) {
        if (!this.debugActive)
            return;
        var textConstructor = '';
        textConstructor += chalk_1.default.hex('#555555')(this.getTime());
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk_1.default.hex('#555555')(`${text.toString().toLowerCase().split(' ')[0].includes('debug') ? '' : ' Debug:'} `);
        textConstructor += chalk_1.default.hex('#555555')(text);
        if (((!args && !(args instanceof Boolean)) || ((args instanceof Array) && args.length === 0)) || ((args instanceof Array) && args.length === 0)) {
            console.debug(textConstructor);
        }
        else {
            console.debug(textConstructor, args);
        }
    }
    log(message, level, ...args) {
        level = level !== null && level !== void 0 ? level : this.defaultLevel;
        switch (level) {
            case interfaces_1.ELoggerLevel.DEBUG:
                this.debug(message, args);
                break;
            case interfaces_1.ELoggerLevel.WARN:
            case interfaces_1.ELoggerLevel.ALERT:
                this.warn(message, args);
                break;
            case interfaces_1.ELoggerLevel.ERROR:
            case interfaces_1.ELoggerLevel.SEVERE:
                this.error(message, args);
                break;
            case interfaces_1.ELoggerLevel.FATAL:
                this.fatal(message, args);
                break;
            case interfaces_1.ELoggerLevel.INFO:
            case interfaces_1.ELoggerLevel.LOG:
            default:
                this.info(message, args);
                break;
        }
    }
}
exports.Logger = Logger;
