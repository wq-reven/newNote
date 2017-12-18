'use strict';
const { db } = require('../dbconfig/mongoose');
const Promise = require('bluebird');
const userDb = db.useDb('users');
const reportSchema = require('../models/reportSchema');
const mongoosePaginate = require('./paginate');
reportSchema.plugin( mongoosePaginate);
const Report = userDb.model('report', reportSchema);


const returnreportparams = `
informId
informedId
type
vid
url
content
status
processResult
processor
created
updated
`;
// 搜索举报信息
exports.searchReportInfo = params => {
    const page = Number(params.pagination.current);
    const limit = Number(params.pagination.pageSize);
    let sort = {};
    if (params.sort && params.sort.key) {
        sort = {
            [params.sort.key]: params.sort.order == 'ascend' ? 1 : -1,
        };
    }
    let videoParams = {
        select: returnreportparams,
        page,
        limit,
        sort,
    };
    const searchParams = ['informId', 'informedId', 'type', 'content', 'created'];
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
                if (data.key == 'created') {
                    starttime = Date.parse(data.value[0]);
                    endtime = Date.parse(data.value[1]);
                    searchRules['created'] = { $gte: starttime, $lte: endtime };
                } else {
                    searchRules[data.key] = data.value;
                }
            }
        });
    console.log(searchRules);
    return Report.paginate(searchRules, videoParams)
        .then(results => {
            return results;
        })
        .catch(err => {
            console.log(err);
        });
};

// 更改举报信息
exports.changeReportInfo = params => {
    let status = params.reportStatus;
    let processResult = params.processResult;
    let processor = params.processor;
    const conditions = { _id: params._id };
    const update = { $set: { status: status, processResult: processResult, processor: processor } };
    const options = { upsert: true };
    return Report.update(conditions, update, options)
        .then(results => {
            return Report.find({ _id: params._id }, returnreportparams)
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
