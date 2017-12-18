const video = require('../models/videoModel');
const check = require('./check.js');

module.exports.queryVideosByNickname = params => {
    return video.queryVideosByNickname(params);
};

module.exports.searchVideo = params => {
    const errorCallback = e => {
        return { code: 1, msg: '', data: '' };
    };
    return check
        .controllerFlow(params)
        .then(parseJSON)
        .then(video.searchVideo)
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

module.exports.playVideo = params => {
    return video.playVideo(params);
};

module.exports.changeVideoChallengementByVid = params => {
    const body = check.parseJSON(params);
    let vid = body.vid;
    let splitVidAndCidAndCName = params => {
        return { params, vid };
    }
    return video.returnChallengeID(body)
        .then(splitVidAndCidAndCName)
        .then(video.changeVideoChallengementByVid)
        .catch(err=>{
            console.log(err);
        });
};

module.exports.changeVideoStatus = params => {
    const body = check.parseJSON(params);
    return video.changeVideoStatus(body);
};

module.exports.addChallengeUserRelation = params => {
    const body = check.parseJSON(params);
    return video.addChallengeUserRelation(body);
}

module.exports.delChallengeUserRelation = params => {
    const body = check.parseJSON(params);
    return video.delChallengeUserRelation(body);
}

module.exports.updateChallengeVideoRelation = params => {
    const body = check.parseJSON(params);
    return video.updateChallengeVideoRelation(body);
}

module.exports.delChallengeVideoRelation = params => {
    const body = check.parseJSON(params);
    return video.delChallengeVideoRelation(body);
}

module.exports.videoNumWithUidAndChallengeId = params => {
    const body = check.parseJSON(params);
    return video.videoNumWithUidAndChallengeId(body);
}

const parseJSON = jsonString => {
    return check.parseJSON(jsonString);
};

function errorHandle(fn) {
    return check.errorHandler(fn);
}
module.exports.queryVideoCreator = () => {
    return video.queryVideoCreator();
}