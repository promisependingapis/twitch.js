// eslint-disable-next-line strict
'use strict';

/**
 * @private
 * @returns {string} - Returns the current time in the format HH:MM:SS
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
 * @private
 * @returns {string} - Returns the current time in the format H:M:S
 */
function getTimeRaw() {
    return `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
}

module.exports = {
    getTime: getTime,
};
