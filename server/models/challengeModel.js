const { db } = require('../dbconfig/mongoose');
const challengeDb = db.useDb('videos');
const challengeSchema = require('../models/challengeSchema');
const mongoosePaginate = require('./paginate');
challengeSchema.plugin(mongoosePaginate);
const Challenge = challengeDb.model('challenge', challengeSchema);

// 返回的挑战json字段
const returnchallengeparams = `
    challengeId
    challengeName
    videoNum
    userNum
    creatorInfo.nickname
    cTime
    challengeStatus
`;
/**
 * 返回挑战列表json数据。
 * {params.page,params.limit} 前台传参，页数及多少行
 * @return {json} 分页返回视频列表json数据
 */
module.exports.queryAllChallenges = params => {
    // 解析参数，强制转换成Number类型才能使用
    // const setcurrentpage = Number(params.currentpage);
    const setcurrent = Number(params.pagination.current);
    const setpageSize = Number(params.pagination.pageSize);
    let challengeParams = {
        select: returnchallengeparams,
        page: setcurrent,
        limit: setpageSize,
    };
    if (params.querys.challengeName != undefined) {
        return Challenge.paginate({ challengeName: new RegExp(params.querys.challengeName), challengeStatus: 1.0 }, challengeParams)
            .then(results => {
                const _Data = {
                    docs: results.docs,
                    pagination: {
                        limit: results.pageSize,
                        total: results.total,
                        page: results.current,
                    },
                };
                return { code: 0, msg: '查询成功', data: _Data };
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        return Challenge.paginate({ challengeStatus: 1.0 }, challengeParams)
            .then(results => {
                const _Data = {
                    docs: results.docs,
                    pagination: {
                        limit: results.pageSize,
                        total: results.total,
                        page: results.current,
                    },
                };
                return { code: 0, msg: '查询成功', data: _Data };
            })
            .catch(err => {
                console.log(err);
            });
    }
};
/**
 * 添加挑战接口
 * @param {} params
 */
module.exports.addChallenge = newchallengeInfo => {
    const newchallenge = new Challenge({
        challengeDesc: newchallengeInfo.challengeName,
        challengeName: newchallengeInfo.challengeName,
        challengeId: newchallengeInfo.challengeId,
        createSource: newchallengeInfo.createSource,
        mangerCreator: {
            creator: newchallengeInfo.userName,
            creatorid: newchallengeInfo.userId,
        },
        creatorInfo: {
            nickname: newchallengeInfo.creator,
            avatarLarger: newchallengeInfo.avatar,
            avatarMedium: newchallengeInfo.avatar,
            avatarThumb: newchallengeInfo.avatar,
            sex: newchallengeInfo.sex,
            signature: newchallengeInfo.signature,
            uid: parseInt(newchallengeInfo.creatorId),
        },
        cTime: newchallengeInfo.datenow,
        userNum: newchallengeInfo.userNum,
        videoNum: newchallengeInfo.videoNum,
        challengeStatus: newchallengeInfo.challengeStatus,
    });
    return newchallenge
        .save()
        .then(results => {
            return results;
        })
        .catch(err => {
            console.log(err);
        });
};
/**
 * 查询挑战是否存在接口
 * @param {} params
 */
module.exports.checkChallengement = params => {
    return Challenge.find({ challengeName: params.challengeName, challengeStatus: 1 }, 'challengeName challengeId')
        .then(results => {
            return results;
        })
        .catch(err => {
            console.log(err);
        });
};

/**
 * 返回所有挑战名称接口
 * @param {} params
 */
module.exports.returnAllChallengeMent = () => {
    return Challenge.find({ challengeStatus: 1 }, 'challengeId challengeName challengeStatus')
        .then(results => {
            const _Data = {
                docs: results,
            };
            return { code: 0, msg: '查询成功', data: _Data };
        })
        .catch(err => {
            console.log(err);
        });
};

/**
 * 删除挑战接口
 * @param {} params
 */
module.exports.deleteChallengement = params => {
    const conditions = { challengeId: params.challengeId };
    const challengeId = params.challengeId;
    const update = { $set: { challengeStatus: 3 } };
    const options = { upsert: true };
    return Challenge.update(conditions, update, options)
        .then(results => {
            const _Data = {
                docs: challengeId,
                code: 1,
            };
            return { code: 0, msg: '更改成功', data: _Data };
        })
        .catch(err => {
            console.log(err);
        });
};

/**
 * 更改挑战videoNum接口
 * @param {} params
 */
module.exports.addchallengeVideoNum = params => {
    const conditions = { challengeId: params.challengeId };
    const update = { $inc: { videoNum: params.inc } };
    const options = { upsert: true };
    return Challenge.update(conditions, update, options)
        .then(results => {
            return { code: 0, msg: '修改videoNum成功', data: results };
        })
        .catch(err => {
            console.log(err);
        });
};

/**
 * 更改挑战userNum接口
 * @param {} params
 */
module.exports.addchallengeUserNum = params => {
    const conditions = { challengeId: params.challengeId };
    const update = { $inc: { userNum: params.inc } };
    const options = { upsert: true };
    return Challenge.update(conditions, update, options)
        .then(results => {
            return { code: 0, msg: '修改userNum成功', data: results };
        })
        .catch(err => {
            console.log(err);
        });
};

// 模糊搜索挑战
module.exports.vagueSearchChallenge = query => {
    return Challenge.find(query, 'challengeId challengeName challengeStatus')
        .then(results => {
            const _Data = {
                docs: results,
                code: 1,
            };
            return { code: 0, msg: '查询成功', data: _Data };
        })
        .catch(err => {
            console.log(err);
        });
};