'use strict';
const Promise = require('bluebird');
// const dbtemplate = new DBTemplate('article_source_management_system.mysql.nyx');
const userModel = require('../models/userModel');
const config = require('../config.json');

module.exports.controllerFlow = function(data) {
    return Promise.resolve(data);
};

module.exports.parseJSON = params => {
    try {
        return JSON.parse(params.body);
    } catch (e) {
        throw new Error('10001');
    }
};

/**
 * 是否登录
 * @param  {[type]}  user [description]
 * @return {Boolean}      [description]
 */
module.exports.isLogin = function(user) {
    // return user;
    if (!user || !user.userId) {
        // 用户未登陆
        throw new Error('10001');
    } else {
        return user;
    }
};

/**
 * 是否有权限
 * @param  {[type]} auth [description]
 * @return {[type]}      [description]
 */
module.exports.checkAuth = auth => _user => {
    // return 10000
    return userModel.getUserByUser(_user.userId).then(function(user) {
        let admin = config.admin || 'admin';
        console.log(auth, user.auth_group);
        console.log(Array.isArray(auth) ? auth.includes(user.auth_group) : false);
        if (
            user.auth_group == admin ||
            user.auth_group == auth ||
            (user.auth_group == 'marketer' && auth == config.financer) ||
            (Array.isArray(auth) ? auth.includes(user.auth_group) : false)
        ) {
            // 有权限
            // throw new Error('10003');
            return 10000;
        } else {
            // 没权限
            console.log(`10002`);
            throw new Error('10002');
        }
    });
};

/**
 * 参数是否正确
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
module.exports.validator = (fn, params) => () => {
    if (!fn) return true;

    if (fn(params) == false) {
        throw new Error('10003');
    }

    return fn(params);
};

module.exports.errorHandler = function(fn) {
    return err => {
        console.log(`stack===========>${JSON.stringify(err.stack)}`);
        let code = '',
            msg = '',
            data = '';
        let _error = config.ERROR || {};

        // this.log.info("error=======> " + err)
        // this.log.info(typeof _error)
        // this.log.info(_error[err.Error])
        console.log(err.message)
        if (_error[err.message] && _error[err.message].alarm == 1) {
            return { code: err.message, msg: _error[err.message].msg, data: _error[err.message].data };
        } else {
            // return sendMail
            //     .sendMail({
            //         leaderMail: 'xiazw@ifeng.com',
            //         subject: '稿源系统报警',
            //         html: err.stack,
            //     })
            //     .then(res => {
            //         if (_error[err.message]) {
            //             return { code: err.message, msg: _error[err.message].msg, data: _error[err.message].data };
            //         }

            //         return fn(err);
            //     });
                return fn(err);
        }
    };
};
