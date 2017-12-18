/**
 * 增加等待时间，配合async await来使用。
 * @param {Integer} val 等待时间，以毫秒计算。
 * @return {Promise} 返回一个Promise对象。
 */
export const sleep = val => {
    return new Promise(resovle => {
        setTimeout(resovle, val);
    });
};
