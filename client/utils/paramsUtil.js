// 参数处理部分，需要根据服务器端对于参数的接收方案来进行调整。

export const paramsEncode = (param, key, encode) => {
    if (param === null) return '';
    let paramStr = '';
    let t = typeof param;
    if (t === 'string' || t === 'number' || t === 'boolean') {
        paramStr += '&' + key + '=' + (encode === null || !encode ? encodeURIComponent(param) : param);
    } else {
        for (let i in param) {
            let k = key === null || !key ? i : key + '[' + i + ']';
            paramStr += paramsEncode(param[i], k, encode);
        }
    }
    return paramStr;
};
export const arrParamsEncode = list => {
    let paramStr = '';
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        for (let j in item) {
            let key = j + '[' + i + ']';
            paramStr += '&' + key + '=' + encodeURIComponent(item[j]);
        }
    }
    return paramStr;
};

