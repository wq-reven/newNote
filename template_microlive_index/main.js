var Promise = require('bluebird');
var DBTemplate = require('nyx_db_proxy');
var user = require('../server/models/userModel');
var check = require('../server/controllers/check');
var config = require('../server/config.json');

/**
 * 得到模板数据
 * @param {String}id 模板对应的实例id,如果没有可以为空
 * @erturn {Object|Array|Promise} 如果是异步处理返回promise, 如果存在分页返回Array
 */
module.exports.getData = function(id) {
    this.log.info('thisUserInfo=======>', this.user);
    return Promise.resolve(this.user)
        .then(data => {
            return user.getUserByUserNickName(this.user.userId)
                .then(msg => {
                    this.log.info('getUserOk========>', msg);
                    return { allow: true, userId: msg[0].uid, nickname: msg[0].nickname, auth: msg[0].permission, roles: msg[0].roles };
                });
        })
        .catch(err => {
            this.log.info('getUserError======>', err);
            return { allow: false };
        });
};

/**
 * 模板的发布地址
 * @param  id  模板的id
 * @param {Object}context
 * @param {Object}context.data  模板实例的数据库数据
 * @param {Object}context.pagerInfo  //分页信息
 * @param {Object}context.requestInfo  //请求参数
 * @param {Object}context.config  //模板信息
 * @param {Object}context.project  //项目信息
 * @return {String} 发布地址的相对地址 例如  /fe/templatname/aaa.shtml
 */
module.exports.getPublishUrl = function(requestInfo, data, templateInfo) {
    throw new Error('请实现！');
};

/**
 * 模板发布的主域
 * @param  id  模板的id
 * @param {Object}context
 * @param {Object}context.data  模板实例的数据库数据
 * @param {Object}context.pagerInfo  //分页信息
 * @param {Object}context.requestInfo  //请求参数
 * @param {Object}context.config  //模板信息
 * @param {Object}context.project  //项目信息
 * @return {String} 发布地址的主域  例如 news.ifeng.com
 */
module.exports.getDomain = function(requestInfo, data, templateInfo) {
    throw new Error('请实现！');
};

/**
 * 模板发布完成后的回调方法，该方法主要处理模板发布后改写模板实例数据的状态
 * @param {String}id 模板实例id
 * @param {String}publishUrl 发布后的地址
 * @param {Object}context
 * @param {Object}context.data  模板实例的数据库数据
 * @param {Object}context.pagerInfo  //分页信息
 * @param {Object}context.requestInfo  //请求参数
 * @param {Object}context.config  //模板信息
 * @param {Object}context.project  //项目信息
 * @return any
 */
module.exports.publishComplete = function(id) {
    throw new Error('请实现！');
};

/**
 * 模板下线成功后的回调方法，该方法主要用于下线成功后修改模板实例数据的状态
 * @param {String}id 模板实例id
 */
module.exports.offlineComplete = function(id) {
    throw new Error('请实现！');
};

/************** UI 接口、服务接口

module.exports.initListData = function(id , params){}

module.exports.initFormData = function(id , params){}

module.exports.save = function(params){}

 **************/
