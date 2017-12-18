const { Redis, redisCluster } = require('../dbconfig/redis');

module.exports.getUserInfoFromRedisByUserId = userId => {
    return redisCluster.hgetall(`user:hm:user:${userId}`).then(res => {
        return res;
    });
};

module.exports.updateProduceVideoNumByUserId = ( userId, inc )=> {
    return redisCluster.hincrby(`user:hm:user:${userId}`, `producedVideoNum`, inc ).then(res =>{
        redisCluster.hincrby(`user:hm:user:${userId}`, `notPassVideoNum`, -inc );
        return res;
    })
}