'use strict';
const { db } = require('../dbconfig/mongoose');
const Promise = require('bluebird');
const userDb = db.useDb('users');
const userSchema = require('../models/userSchema');
const managerSchema = require('../models/manageSchema');
const mongoosePaginate = require('./paginate');
userSchema.plugin(mongoosePaginate);
managerSchema.plugin(mongoosePaginate);
const User = userDb.model('user', userSchema);
const Manager = userDb.model('manager', managerSchema);
const { getUserInfoFromRedisByUserId, updateProduceVideoNumByUserId } = require('./userRedis');

// 返回的用户简要字段
const returnuserparams = `
    uid
    nickname
    followNum
    fansNum
    producedVideoNum
    likeNum
    registerTime
`;

// 返回的修改用户用户简要字段
const returnedituserparams = `
    uid
    nickname
    signature
    checkStatus
    avatarLarger
    avatarMedium
    avatarThumb
    modifyTime
    checkTime
    userKey
`;

const returnUserManageparams = `
    nickname
    registerTime
    department
    uid
    permission
    roles
`;
/**
 * 查询用户详情，返回用户详细json数据
 * @param {uid} 传入用户id
 * @return {json} 用户详情json数据
 */
exports.queryUserDetail = uid => {
    return getUserInfoFromRedisByUserId(uid);
};

/**
 * 更新用户视频数量
 * @param {uid} 传入用户uid
 */
exports.updateProductVideoNum = params => {
    return updateProduceVideoNumByUserId(params.uid, params.inc );
}
/**
 * 根据用户ID或昵称搜索用户，返回用户简要json数据
 * @param {uid,nickname} 传入用户id或者nickname
 * @return {json} 用户详情json数据
 */
exports.searchUser = (querys, sort, pagination) => {
    const setcurrent = Number(pagination.current);
    const setpageSize = Number(pagination.pageSize);
    let setsort = {};
    if (sort && sort.key) {
        setsort = {
            [sort.key]: sort.order === 'ascend' ? 1 : -1,
        };
    }
    let userParams = {
        select: returnuserparams,
        page: setcurrent,
        limit: setpageSize,
        sort: setsort,
    };
    // 搜索规则
    const searchParams = ['uid', 'nickname'];
    let searchRules = {};
    searchParams
        .map(param => {
            if (querys[param]) {
                return {
                    key: param,
                    value: querys[param],
                };
            } else {
                return null;
            }
        })
        .forEach( data => {
            if (data) {
                if (data.key == 'nickname') {
                    searchRules['nickname'] = new RegExp( data.value);
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });

    const getUserInfo = results => {
        return Promise.map(results.docs, doc =>  {
            return getUserInfoFromRedisByUserId(doc.uid).then(res => {
                return res;
            });
        });
    };

    return User.paginate(searchRules, userParams).then(results => {
        return getUserInfo(results).then(datas => {
            console.log(datas)
            results.docs = datas;
            return results;
        });
    });
};

/**
 * 根据用户ID或昵称搜索管理员，返回用户简要json数据
 * @param {uid,nickname} 传入用户id或者nickname
 * @return {json} 用户详情json数据
 */
exports.searchUserManager = params => {
    const setcurrent = Number(params.pagination.current);
    const setpageSize = Number(params.pagination.pageSize);
    let userParams = {
        select: returnUserManageparams,
        page: setcurrent,
        limit: setpageSize,
    };
    const searchParams = ['uid', 'nickname'];
    const searchRules = {};

    searchParams
        .map(param => {
            if (params.querys[param]) {
                return {
                    key: param,
                    value: params.querys[param],
                };
            } else {
                return null;
            }
        })
        .forEach(data => {
            if (data) {
                if (data.key == 'nickname') {
                    searchRules['nickname'] = new RegExp( data.value);
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    return Manager.paginate(searchRules, userParams)
        .then(results => {
            return results;
        })
        .catch(err => {
            console.log(err);
        });
};

// 添加管理员接口
exports.addUserManager = newUserManagerInfo => {
    console.log(newUserManagerInfo);
    const uuid = Date.parse(new Date());
    const newUserManager = new Manager({
        creator: newUserManagerInfo.userName,
        nickname: newUserManagerInfo.nickname,
        registerTime: Date.parse(new Date()),
        uid: parseInt(uuid),
        permission: 1,
        roles: newUserManagerInfo.roles,
    });
    console.log(newUserManager);
    return newUserManager
        .save()
        .then(results => {
            return results;
        })
        .catch(err => {
            console.log(err);
        });
};

/**
 * 查询管理员是否存在接口
 * @param {} params
 */
exports.checkUserManager = params => {
    return Manager.find({ nickname: params.nickname }, 'nickname')
        .then(results => {
            return results;
        })
        .catch(err => {
            console.log(err);
        });
};

// 修改管理员权限
exports.changeManagerPermission = params => {
    const conditions = { uid: params.uid };
    const update = { $set: { permission: params.permission } };
    const options = { upsert: true };
    return Manager.update(conditions, update, options)
        .then(results => {
            return Manager.find({ uid: params.uid }, returnUserManageparams)
                .then(results => {
                    const _Data = {
                        docs: results,
                        code: 1,
                    };
                    return { code: 0, msg: '更改成功', data: _Data };
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

// 查询修改资料的用户
exports.searchEditUser = params => {
    const setcurrent = Number(params.pagination.current);
    const setpageSize = Number(params.pagination.pageSize);
    let userParam = {
        select: returnedituserparams,
        page: setcurrent,
        limit: setpageSize,
    };
    const searchParams = ['uid', 'checkStatus', 'modifyTime'];
    const searchRules = {};
    let starttime = '';
    let endtime = '';
    searchParams
        .map(param => {
            if (params.querys[param]) {
                return {
                    key: param,
                    value: params.querys[param],
                };
            } else {
                return null;
            }
        })
        .forEach(data => {
            if (data) {
                if (data.key == 'modifyTime') {
                    starttime = data.value[0];
                    endtime = data.value[1];
                    searchRules['modifyTime'] = { $gte: starttime, $lte: endtime };
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    return User.paginate(searchRules, userParam)
        .then(results => {
            return results;
            console.log(1232345677);
            console.log(results);
        })
        .catch(err => {
            console.log(err);
        });
};
/**
 * 返回所有修改资料的用户
 * @return 返回查找结果
 */
exports.queryallEditUser = params => {
    const setcurrent = Number(params.pagination.current);
    const setpageSize = Number(params.pagination.pageSize);
    let userParam = {
        select: returnedituserparams,
        page: setcurrent,
        limit: setpageSize,
    };
    return User.paginate({ checkStatus: 3 }, userParam)
        .then(results => {
            return results;
        })
        .catch(err => {
            console.log(err);
        });
};

/**
 * 查询登入人员是否有权限登入
 * @param {uid} 传入登入人员昵称
 * @return 返回查找结果
 */
exports.getUserByUserNickName = params => {
    return Manager.find({ nickname: params, permission: 1 })
        .then(results => {
            return results;
        })
        .catch(err => {
            console.log(err);
        });
};
