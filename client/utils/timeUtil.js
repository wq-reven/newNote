// 时间处理函数也需要根据业务进行整理。
export const dateConversion = function(format) {
    if (format) {
        if (format.length < 13) {
            format = format + '000';
        }
        let time = new Date(parseInt(format));
        let y = time.getFullYear();
        let m = time.getMonth() + 1 < 10 ? '0' + parseInt(time.getMonth() + 1) : time.getMonth() + 1;
        let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        let mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        let s = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
    }
};
export const rangeStart = function(start) {
    const result = [];
    for (let i = 0; i < parseInt(start); i++) {
        result.push(i);
    }
    return result;
};
export const rangeEnd = function(end, type) {
    const result = [];
    if (type === 'hours') {
        for (let i = parseInt(end + 1); i < 24; i++) {
            result.push(i);
        }
    } else {
        for (let i = parseInt(end + 1); i < 60; i++) {
            result.push(i);
        }
    }

    return result;
};
export const getTime = function(time) {
    let date_time = time.split(' ')[1];
    let hours_minutes_seconds = date_time.split(':');
    return {
        hours: parseInt(hours_minutes_seconds[0]),
        minutes: parseInt(hours_minutes_seconds[1]),
        seconds: parseInt(hours_minutes_seconds[2]),
    };
};
export const getData = function(time) {
    return time.split(' ')[0];
};
export const getDataTime = function(time) {
    return time.split(' ')[1];
};
