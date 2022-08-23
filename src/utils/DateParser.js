// eslint-disable-next-line strict
'use strict';

/**
 * @returns {string} - Returns the current time in the format HH:MM:SS
 * @private
 */
function getTime() {
    const time = getTimeRaw();
    const separatedTime = time.split(':');
    separatedTime.forEach((element, index) => {
        if (element.length < 2) {
            separatedTime[index] = `0${separatedTime[index]}`;
        }
    });
    return separatedTime.join(':');
}

/**
 * @returns {string} - Returns the current time in the format H:M:S
 * @private
 */
function getTimeRaw() {
    return `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
}

module.exports = {
    getTime: getTime,
};
