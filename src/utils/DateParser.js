function getTime() {
    var time = getTimeRaw();
    var separatedTime = time.split(':');
    separatedTime.forEach((element, index) => {
        if (element.length < 2) {
            separatedTime[index] = `0${separatedTime[index]}`;
        }
    });
    return separatedTime.join(':');
}

function getTimeRaw() {
    return `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
}

module.exports = {
    getTime: getTime,
};
