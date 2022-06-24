"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const interface_1 = require("../interface");
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor({ prefix, debug, defaultLevel }) {
        this.defaultLevel = interface_1.ILoggerLevel.LOG;
        this.debugActive = false;
        this.prefix = prefix !== null && prefix !== void 0 ? prefix : '';
        this.debugActive = debug !== null && debug !== void 0 ? debug : false;
        this.defaultLevel = defaultLevel !== null && defaultLevel !== void 0 ? defaultLevel : interface_1.ILoggerLevel.INFO;
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
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk_1.default.blueBright(this.getTime());
        textConstructor += ' Info: ';
        textConstructor += text;
        console.log(textConstructor, args);
    }
    warn(text, ...args) {
        var textConstructor = '';
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk_1.default.hex('#ff8a1c')(this.getTime());
        textConstructor += ` ${text.toString().toLowerCase().split(' ')[0].includes('warn') ? '' : 'Warn:'} `;
        textConstructor += text;
        console.warn(textConstructor, args);
    }
    error(text, ...args) {
        var textConstructor = '';
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk_1.default.red(this.getTime());
        textConstructor += ` ${text.toString().toLowerCase().split(' ')[0].includes('error') ? '' : 'Error:'} `;
        textConstructor += text;
        console.error(textConstructor, args);
    }
    fatal(text, ...args) {
        var textConstructor = '';
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk_1.default.hex('#ff8a1c')(this.getTime());
        textConstructor += ` Fatal ${text.toString().toLowerCase().split(' ')[0].includes('error') ? '' : ':'} `;
        textConstructor += text;
        textConstructor = chalk_1.default.bgWhite(textConstructor);
        console.trace(textConstructor, args);
        process.exit(5);
    }
    debug(text, ...args) {
        if (!this.debugActive)
            return;
        var textConstructor = '';
        textConstructor += this.getFormattedPrefix();
        textConstructor += chalk_1.default.hex('#ff8a1c')(this.getTime());
        textConstructor += ` ${text.toString().toLowerCase().split(' ')[0].includes('debug') ? '' : 'Debug:'} `;
        textConstructor += text;
        console.debug(textConstructor, args);
    }
    log(message, level, ...args) {
        level = level !== null && level !== void 0 ? level : this.defaultLevel;
        switch (level) {
            case interface_1.ILoggerLevel.DEBUG:
                this.debug(message, args);
                break;
            case interface_1.ILoggerLevel.WARN:
            case interface_1.ILoggerLevel.ALERT:
                this.warn(message, args);
                break;
            case interface_1.ILoggerLevel.ERROR:
            case interface_1.ILoggerLevel.SEVERE:
                this.error(message, args);
                break;
            case interface_1.ILoggerLevel.FATAL:
                this.fatal(message, args);
                break;
            case interface_1.ILoggerLevel.INFO:
            case interface_1.ILoggerLevel.LOG:
            default:
                this.info(message, args);
                break;
        }
    }
}
exports.Logger = Logger;
