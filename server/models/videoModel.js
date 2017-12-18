const { db } = require('../dbconfig/mongoose');

// 视频表
const videoDb = db.useDb('videos');
const videoSchema = require('../models/videoSchema');
const mongoosePaginate = require('./paginate');
videoSchema.plugin(mongoosePaginate);
const Video = videoDb.model('video', videoSchema);

// 挑战管理表
const challengeDb = db.useDb('videos');
const challengeSchema = require('../models/challengeSchema');
const Challenge = challengeDb.model('challenge', challengeSchema);

// 用户与挑战关系表
const challengeUserRelationDb = db.useDb('videos');
const challengeUserRelationSchema = require('../models/challengeUserRelationSchema');
const ChallengeUserRelation = challengeUserRelationDb.model('challengeUserRelation', challengeUserRelationSchema);

// 视频与挑战关系表
const challengeVideoRelationDb = db.useDb('videos');
const challengeVideoRelationSchema = require('../models/challengeVideoRelationSchema');
const ChallengeVideoRelation = challengeVideoRelationDb.model('challengeVideoRelation', challengeVideoRelationSchema);


// 返回的视频json字段
const returnvideoparams = `
    vid
    uniqueVideoId
    originalTitle
    title
    musicUrl
    challengeName
    challengeId
    author.uid
    author.nickname
    publishTime
    source
    cpName
    insertTime
    playCount
    likeCount
    status
    videoPlayUrl
    ownerName
    tags
    creator
`;
/**
 * 根据用户nickname查询视频，返回用户创建的视频列表json数据
 * {params.ownerName,params.page,params.limit} 前台传参，nickname及页数及多少行
 * @param {ownerName，page,limit} 传入用户nickname
 * @return {json} 用户创建的视频列表json数据
 */
exports.queryVideosByNickname = params => {
    const setpage = Number(params.page);
    const setlimit = Number(params.limit);
    let videoParams = {
        select: returnvideoparams,
        page: setpage,
        limit: setlimit,
    };
    return Video.paginate({ ownerName: params.ownerName }, videoParams)
        .then(results => {
            return { code: 0, msg: '查询成功', data: results };
        })
        .catch(err => {
            console.log(err);
        });
};
/**
 * 根据搜索框条件查询视频，返回符合条件的视频列表json数据
 * {vid,title,uid.challengeName,nickname,publishTime,type,source,page,limit}
 * @param {vid,title,uid.challengeName,nickname,publishTime,type,source,page,limit}
 * @return {json} 返回符合结果的json数据
 */
exports.searchVideo = params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order == 'ascend' ? 1 : -1,
        };
    }
    let videoParams = {
        select: returnvideoparams,
        page,
        limit,
        sort,
    };
    const searchParams = ['uniqueVideoId', 'title', 'uid', 'challengeName', 'creator', 'source', 'insertTime', 'status', 'challengeId'];
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
                if (data.key == 'uid') {
                    searchRules['author.uid'] = data.value;
                } else if (data.key == 'insertTime') {
                    starttime = Date.parse(data.value[0]);
                    endtime = Date.parse(data.value[1]);
                    searchRules['insertTime'] = { $gte: starttime, $lte: endtime };
                } else if (data.key == 'challengeName' && data.value == '0') {
                    searchRules['challengeName'] = ''
                } else if (data.key == 'challengeName' && data.value != '0') {
                    searchRules['challengeName'] = new RegExp( data.value);
                } else if (data.key == 'title') {
                    searchRules[data.key] = new RegExp( data.value);
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    return Video.paginate(searchRules, videoParams)
        .then(results => {
            return results;
        })
        .catch(err => {
            console.log(err);
        });
};
/**
 * 点击播放按钮接口，返回视频url
 * 参数{vid}
 * @return {json} 返回视频地址url
 */
exports.playVideo = params => {
    return Video.find({ uniqueVideoId: params.vid }, 'mediaFiles.videoPlayUrl')
        .then(results => {
            return { code: 0, msg: '查询成功', data: results };
        })
        .catch(err => {
            console.log(err);
        });
};
/**
 * 更改视频所属挑战
 * 参数{vid, newchallengeName}
 * @return {status}
 */
exports.changeVideoChallengementByVid = params => {
    let challengeId = params.params.data[0].challengeId;
    let challengeName = params.params.data[0].challengeName;
    const conditions = { uniqueVideoId: params.vid };
    const update = { $set: { challengeName: challengeName, challengeId: challengeId } };
    const options = { upsert: true };
    return Video.update(conditions, update, options)
        .then(results => {
            return Video.find({ uniqueVideoId: params.vid }, returnvideoparams)
                .then(results => {
                    const _Data = {
                        code: 0,
                        docs: results,
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
/**
 * 查询视频所属挑战名和挑战id
 * 参数{vid, newchallengeName}
 * @return {status}
 */
module.exports.returnChallengeID = params => {
    return Challenge.find({ challengeName: params.challengeName, challengeStatus: 1 }, 'challengeName challengeId')
        .then(results => {
            return { code: 0, data: results, msg: '返回挑战ID' };
        })
        .catch(err => {
            console.log(err);
        });
};
/**
 * 修改视频上下线包括审核状态
 * 参数{vid，status}视频id，和需要修改成的status
 * @return {status}
 */
exports.changeVideoStatus = params => {
    const conditions = { uniqueVideoId: params.vid };
    const update = { $set: { status: params.status } };
    const options = { upsert: true };
    return Video.update(conditions, update, options)
        .then(results => {
            return Video.find({ uniqueVideoId: params.vid }, returnvideoparams)
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


/**
 * 视频上线时，插入表chellengeUserRelation
 * 参数{uid，challengeId}
 * @return {}
 */
exports.addChallengeUserRelation = params => {
    const newChallengeUserRelation = new ChallengeUserRelation({
        uid: params.uid,
        challengeId: params.challengeId,
    });
    return newChallengeUserRelation.save()
        .then( results => {
            return { code: 0, msg: '更新关系成功', data: results};
        })
        .catch(err => {
            console.log(err);
        })
};

exports.delChallengeUserRelation = params => {
    let conditions = {'uid': params.uid, 'challengeId': params.challengeId };
    return ChallengeUserRelation.remove(conditions)
        .then( results => {
            return { code: 0, msg: '删除user与挑战关联关系成功', data: results };
        })
        .catch(err => {
            console.log(err);
        });
}

/**
 * 修改视频挑战时，更新表chellengeVideoRelation
 * 参数{uniqueVideoId，challengeId}
 * @return {}
 */
exports.updateChallengeVideoRelation = params => {
    const conditions = { uniqueVideoId: params.uniqueVideoId };
    const update = { $set: { challengeId: params.challengeId } };
    const options = { upsert: true };
    return ChallengeVideoRelation.update(conditions, update, options)
        .then( results => {
            return { code: 0, msg: '更改关联关系成功', data: results };
        })
        .catch(err => {
            console.log(err);
        });
};

/**
 * 下线视频时，删除表chellengeVideoRelation中video与challenge的关系
 * 参数{uniqueVideoId，challengeId}
 * @return {}
 */
exports.delChallengeVideoRelation = params => {
    let conditions = { uniqueVideoId: params.uniqueVideoId };
    return ChallengeVideoRelation.remove(conditions)
        .then( results => {
            return { code: 0, msg: '删除video与挑战关联关系成功', data: results };
        })
        .catch(err => {
            console.log(err);
        });
};

exports.videoNumWithUidAndChallengeId = params => {
    return Video.paginate({ 'author.uid': params.uid, 'challengeId': params.challengeId })
        .then( results => {
            return { code: 0, msg: '查询用户在挑战下的视频数', data: results };
        })
        .catch(err => {
            console.log(err);
        })
}
exports.queryVideoCreator = () => {
    return Video.distinct('creator')
        .then( results => {
            return { code: 0, msg: '查询视频来源', data: results }
        })
        .catch(err => {
            console.log(err);
        })
}