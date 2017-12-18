/**
 *
 * @param {Strong} url 请求的地址，如果是get请求，会把参数拼在这后面
 * @param {String} method 请求的方式，
 * @param {Object} body 如果是post请求，参数采用object形式传入
 * @return {Promise} 返回一个promise对象。
 * 对于错误的处理，会将返回结果序列化以后抛出去，
 * 对于参数的处理，也要跟后端确认方案以后，统一处理。
 */
export default async function request(url, method = 'GET', body = {}) {
    if (method.toLocaleUpperCase() === 'POST') {
        body = { body };
    }

    let response;

    if (method.toLocaleUpperCase() === 'GET') {
        response = await fetch(url, {
            method,
        });
    } else {
        response = await fetch(url, {
            method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }
    let result = await response.json();
    let a;
    if (result.code != undefined) {
        a = result.code;
    } else {
        a = result.data.code;
    }
    switch (a) {
        case 0:
            return result.data.data;
            break;
        case 1:
            alert('系统错误');
            break;
        case 200:
            return result.data;
            break;
        case -1:
            alert(result.msg);
            throw new Error(JSON.stringify(result));
            break;
        case 401:
            alert('用户身份过期，请重新登录');
            store.dispatch(createLogoutAction({}));
            throw new Error(JSON.stringify(result));
            // 这里要调用登出的action
            break;
        case 403:
            alert('您没有权限，如需要进行该操作，请切换用户');
            throw new Error(JSON.stringify(result));
            break;
        case 500:
            throw new Error(JSON.stringify(result));
            break;
        case 700:
            // alert('该消息与之前的新用户消息的生效时间存在重叠时间区域,请重新选择!!!');
            throw new Error(JSON.stringify(result));
            break;
        default:
            throw new Error(JSON.stringify(result));
            break;
    }
}
