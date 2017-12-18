const user = require('../models/userModel');
const report = require('../models/reportModel')
const check = require('./check.js');
module.exports.queryUserDetail = params => {
    const uid = check.parseJSON(params).uid;
    const errorCallback = e => {
        return { code: 1, msg: '', data: '' };
    };
    return user
        .queryUserDetail(uid)
        .then(data => {
            return { code: 0, msg: '查询成功', data };
        })
        .catch(errorHandle(errorCallback));
};
module.exports.searchUser = function(params) {
    const body = check.parseJSON(params);
    const querys = body.querys || {};
    const sort = body.sort || {};
    const pagination = body.pagination || {};

    const errorCallback = e => {
        return { code: 1, msg: '', data: '' };
    };
    return user
        .searchUser(querys, sort, pagination)
        .then(results => {
            const data = {
                docs: results.docs,
                pagination: {
                    limit: results.pageSize,
                    total: results.total,
                    page: results.current,
                },
            };
            return { code: 0, msg: '查询成功', data };
        })
        .catch(errorHandle(errorCallback));
};

module.exports.searchUserManager = params => {
    const errorCallback = e => {
        return { code: 1, msg: '', data: '' };
    };
    return check
        .controllerFlow(params)
        .then(check.parseJSON)
        .then(user.searchUserManager)
        .then(results => {
            // throw new Error(1)
            const data = {
                docs: results.docs,
                pagination: {
                    limit: results.pageSize,
                    total: results.total,
                    page: results.current,
                },
            };
            return { code: 0, msg: '查询成功', data };
        })
        .catch(errorHandle(errorCallback));
};

module.exports.addUserManager = params => {
    const errorCallback = e => {
        return { code: 1, msg: '', data: '' };
    };

    let _body = paramsbody => {
        return check
            .controllerFlow(paramsbody)
            .then(parseJSON)
    };

    return _body(params)
        .then(user.addUserManager)
        .then(results => ({ code: 0, msg: '添加管理员成功', data: results }))
        .catch(errorHandle(errorCallback));
};

module.exports.checkUserManager = params => {
    const errorCallback = e => {
        return { code: 1, msg: '系统错误', data: ''};
    };

    return check.controllerFlow(params)
        .then(parseJSON)
        .then(user.checkUserManager)
        .then(results => {
            if (results.length == 0) {
                return { code: 0, data: { msg: '管理员不存在', exist: 0 } };
            } else {
                return { code: 0, data: { msg: '管理员已存在', exist: 1 } };
            }
        })
        .catch(errorHandle(errorCallback));
};

const parseJSON = jsonString => {
    return check.parseJSON(jsonString);
};

function errorHandle(fn) {
    return check.errorHandler(fn);
}

// 修改管理员权限
module.exports.changeManagerPermission = params => {
    const body = check.parseJSON(params);
    return user.changeManagerPermission(body);
};

// 搜索修改资料用户
module.exports.searchEditUser = params => {
    const errorCallback = e => {
        return { code: 1, msg: '', data: '' };
    };
    return check
        .controllerFlow(params)
        .then(parseJSON)
        .then(user.searchEditUser)
        .then(results => {
            // throw new Error(1)
            const data = {
                docs: results.docs,
                pagination: {
                    limit: results.pageSize,
                    total: results.total,
                    page: results.current,
                },
            };
            return { code: 0, msg: '查询成功', data };
        })
        .catch(errorHandle(errorCallback));
};

// 返回所有修改资料用户
module.exports.queryallEditUser = params => {
    const errorCallback = e => {
        return { code: 1, msg: '', data: '' };
    };
    return check
        .controllerFlow(params)
        .then(parseJSON)
        .then(user.queryallEditUser)
        .then(results => {
            // throw new Error(1)
            const data = {
                docs: results.docs,
                pagination: {
                    limit: results.pageSize,
                    total: results.total,
                    page: results.current,
                },
            };
            return { code: 0, msg: '查询成功', data };
        })
        .catch(errorHandle(errorCallback));
};
// module.exports.updateProductVideoNum = params => {
//     const body = check.parseJSON(params);
//     return user.updateProductVideoNum(body);
// }
module.exports.updateProductVideoNum = params => {
    const param = check.parseJSON(params);
    const errorCallback = e => {
        return { code: 1, msg: '', data: '' };
    };
    return user
        .updateProductVideoNum(param)
        .then(data => {
            return { code: 0, msg: '更改成功', data };
        })
        .catch(errorHandle(errorCallback));
};

// 搜索举报信息
module.exports.searchReportInfo = params => {
    const errorCallback = e => {
        return { code: 1, msg: '', data: '' };
    };
    return check
        .controllerFlow(params)
        .then(parseJSON)
        .then(report.searchReportInfo)
        .then(results => {
            // throw new Error(1)
            const data = {
                docs: results.docs,
                pagination: {
                    limit: results.pageSize,
                    total: results.total,
                    page: results.current,
                },
            };
            return { code: 0, msg: '查询成功', data };
        })
        .catch(errorHandle(errorCallback));
};
// 修改举报信息
module.exports.changeReportInfo = params => {
    const body = check.parseJSON(params);
    return report.changeReportInfo(body);
};