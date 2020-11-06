function getTime() {
    var Time = getTimeRaw();
    var SeparatedTime = Time.split(':');
    SeparatedTime.forEach((element, index)=> {
        if (element.length < 2) {
            SeparatedTime[index] = `0${SeparatedTime[index]}`
        }
    })
    return SeparatedTime.join(':')
}

function getTimeRaw() {
    return (`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
}

module.exports = {
    getTime: getTime,
}