const challenge = require('../models/challengeModel');
const check = require('./check.js');

module.exports.queryAllChallenges = params => {
    const body = check.parseJSON(params);
    return challenge.queryAllChallenges(body);
};

module.exports.addChallenge = function(params) {
    const errorCallback = e => {
        return { code: 1, msg: '', data: '' };
    };
    // 解析传入参数
    let _body = paramsbody => {
        return check
            .controllerFlow(paramsbody)
            .then(parseJSON)
            .catch(errorHandle(errorCallback));
    };
    return _body(params)
        .then(challenge.checkChallengement)
        .then(results => {
            if (results.length == 0) {
                return _body(params)
                    .then(challenge.addChallenge)
                    .then(results => {
                        return { code: 0, msg: '添加挑战成功', data: results };
                    })
                    .catch(errorHandle(errorCallback));
            } else {
                return { code: 0, msg: '挑战已存在', data: { msg: '挑战已存在' } };
            }
        })
        .catch(errorHandle(errorCallback));
};

// 返回所有挑战名称
module.exports.returnAllChallengeMent = () => {
    return challenge.returnAllChallengeMent();
};
// 删除挑战
module.exports.deleteChallenge = params => {
    const body = check.parseJSON(params);
    return challenge.deleteChallengement(body);
};

// 更改挑战videoNum接口
module.exports.addchallengeVideoNum = params => {
    const body = check.parseJSON(params);
    return challenge.addchallengeVideoNum(body);
};

// 更改挑战userNum接口
module.exports.addchallengeUserNum = params => {
    const body = check.parseJSON(params);
    return challenge.addchallengeUserNum(body);
};

const parseJSON = jsonString => {
    return check.parseJSON(jsonString);
};

function errorHandle(fn) {
    return check.errorHandler(fn);
}

// 模糊搜索挑战
module.exports.vagueSearchChallenge = params => {
    const body = check.parseJSON(params);
    const query = {};
    if (body.challengeName != '') {
        query['challengeName'] = new RegExp(body.challengeName);
        console.log(1111);
        console.log(query)
        return challenge.vagueSearchChallenge(query);
    } else {
        return { code: 0, msg: '暂无', data: { msg: '暂无', code: 0} };
    }
}