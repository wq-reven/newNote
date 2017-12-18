import { createReducers, createActions, request } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';
import { notification } from 'antd';

const urls = {
    get: APIHOST + 'searchVideo',
    playVideo: APIHOST + 'playVideo',
    searchVideo: APIHOST + 'searchVideo',
    changeVideoStatus: APIHOST + 'changeVideoStatus',
    addChallengeUserRelation: APIHOST + 'addChallengeUserRelation',
    delChallengeUserRelation: APIHOST + 'delChallengeUserRelation',
    updateChallengeVideoRelation: APIHOST + 'updateChallengeVideoRelation',
    update: APIHOST + 'changeVideoChallengementByVid',
    changeVideoChallengementOnES: 'http://local.51fa.shop/videoapi/data/updateES?dataType=video',
    getChallengeName: APIHOST + 'returnAllChallengeMent',
    changeaVideoStatusOnES: 'http://local.51fa.shop/videoapi/data/updateES?dataType=video',
    // changeVideoStatusOnRAP: 'http://172.30.157.93:8080/data/modifyTokafka',
    changeVideoStatusOnRAP: 'http://local.51fa.shop/videoapi/data/modifyToKafka',
    changeVideoStatusToRobot: 'http://local.51fa.shop/videoapi/robot/push',
    changeVideoChallengementOnRAP: 'http://local.51fa.shop/videoapi/data/modifyToKafka',
    addchallengeVideoNum: APIHOST + 'addchallengeVideoNum',
    delChallengeVideoRelation: APIHOST + 'delChallengeVideoRelation',
    addchallengeUserNum: APIHOST + 'addchallengeUserNum',
    videoNumWithUidAndChallengeId: APIHOST + 'videoNumWithUidAndChallengeId',
    updateProductVideoNum: APIHOST + 'updateProductVideoNum',
    vagueSearchChallenge: APIHOST + 'vagueSearchChallenge',
    queryVideoCreator: APIHOST + 'queryVideoCreator',
};

const path = name => `app/pages/videomanage/${name}`;

const openNotificationWithSuccess = type => {
    notification[type]({
        message: '成功',
        description: '操作已成功！',
    });
};
const openNotificationWithFail = type => {
    notification[type]({
        message: '失败',
        description: '操作失败！请重试',
    });
};
const models = {
    list: {
        data: [],
        handlers: {
            get(state, action) {
                return action.payload;
            },
            add(state, action) {
                return [...action.payload, ...state];
            },
            del(state, action) {
                return state.filter(item => item.id !== action.payload);
            },
            update(state, action) {
                return state.map(item => (item.uniqueVideoId === action.payload.uniqueVideoId ? action.payload : item));
            },
            clearData(state, action) {
                return action.payload;
            },
        },
    },
    pagination: {
        data: {
            current: 1,
            total: 0,
            pageSize: 10,
        },
        handlers: {
            changePagination(state, action) {
                return { ...state, ...action.payload };
            },
        },
    },
    playVideo: {
        data: '',
        handlers: {
            getVideo(state, action) {
                return action.payload;
            },
        },
    },
    challengeName: {
        data: '',
        handlers: {
            getChallengeName(state, action) {
                return action.payload;
            },
        },
    },
    updateChallenge: {
        data: '',
        handlers: {
            getChallenge(state, action) {
                return action.payload;
            },

        },
    },
    challengeId: {
        data: '',
        handlers: {
            getChallengeId(state, action) {
                return action.payload;
            },
        },
    },
    updateChallengeVid: {
        data: '',
        handlers: {
            getChallengeVid(state, action) {
                return action.payload;
            },
        },
    },
    updateChallengeStatus: {
        data: '',
        handlers: {
            getVideoStatus(state, action) {
                return action.payload;
            },
        },
    },
    searchValues: {
        data: {},
        handlers: {
            changeSearchValues(state, action) {
                return action.payload;
            },
        },
    },
    videoCreator: {
        data: {},
        handlers: {
            getvideoCreator(state, action) {
                return action.payload;
            },
        },
    },
    getsearchValues: {
        data: {},
        handlers: {
            getchangeSearchValues(state, action) {
                return action.payload;
            },
        },
    },
    sortValues: {
        data: {},
        handlers: {
            changeSort(state, action) {
                return action.payload;
            },
        },
    },
    uiStatus: {
        data: {
            isLoading: false,
            isViewShow: false,
            isAddShow: false,
            isAddPlusShow: false,
            isUpdateShow: false,
        },
        handlers: {
            changeUiStatus(state, action) {
                return { ...state, ...action.payload };
            },
        },
    },
    currentSelectId: {
        data: '',
        handlers: {
            changeCurrentSelectId(state, action) {
                return action.payload;
            },
        },
    },
};

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));

const formatGetParams = getState => {
    const state = getState().videomanage;
    const params = {
        querys: {
            ...state.searchValues,
        },
        sort: {
            ...state.sortValues,
        },
        pagination: {
            current: state.pagination.current,
            pageSize: state.pagination.pageSize,
        },
    };
    return '?body=' + encodeURIComponent(JSON.stringify(params));
};

// 验证是否为数字
function checkNumber(theObj) {
    let reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(theObj)) {
        return true;
    }
    return false;
};

// 页面渲染方法
export const asyncGet = urlValue => {
    return async (dispatch, getState) => {
        try {
            if (urlValue !== undefined) {
                if (checkNumber(urlValue) === true) {
                    let params = { uid: urlValue };
                    dispatch(actions.changeSearchValues(params));
                } else if (checkNumber(urlValue) == false) {
                    let challengeName = decodeURIComponent(urlValue);
                    let params = { challengeName: challengeName };
                    dispatch(actions.changeSearchValues(params));
                }
            } else {
            }
            dispatch(actions.changeUiStatus({ isLoading: true }));
            let result = await request(urls.get + formatGetParams(getState));
            dispatch(actions.get(result.docs));
            dispatch(actions.changePagination(result.pagination));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

// 修改视频上下线
export const asynchangeVideoStatus = handelInfo => {
    let uid = handelInfo.uid;
    let vid = handelInfo.vid;
    let status = handelInfo.status;
    let challengeName = handelInfo.challengeName;
    let challengeId = handelInfo.challengeId;
    let oldStatus = handelInfo.oldStatus;
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            // 更新mongodb主video表的上下线状态
            let mongodbresult = await request(
                urls.changeVideoStatus + '?body=' + encodeURIComponent(JSON.stringify({ vid: vid, status: status })),
            );
            // 更新ESsearch服务器中视频上下线状态
            const changeVideoStatusOnEsString = '{"' + vid + '":' + '"{\\"status\\":\\"' + status + '\\"}"}';
            request(urls.changeaVideoStatusOnES, 'POST', changeVideoStatusOnEsString);
            // 同步数据到机器学习消息队列
            request(urls.changeVideoStatusOnRAP + '?body=' + encodeURIComponent('[' + JSON.stringify({ 'uniqueVideoId': vid, 'status': status }) + ']'));
            // 上下线调用
            if (status == 1) {
                request(urls.changeVideoStatusToRobot + '?' + 'uid=' + uid + '&vid=' + vid, 'POST', {});
                // 更改redis用户作品数量
                request(urls.updateProductVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ uid: uid, 'inc': 1  })));
            };
            if (status == 0) {
                if (oldStatus != 2) {
                    request(urls.updateProductVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ uid: uid, 'inc': -1  })));
                }
            };
            // 更改后结果返回，刷新页面，只等待mongodb的更改成功结果
            if (mongodbresult.code === 1) {
                // 当视频上线且有所属挑战时，更新用户与挑战关系表
                if ( status === 1 && challengeName != '' ) {
                    let userChallengeRelationresult = request(urls.addChallengeUserRelation + '?body=' + encodeURIComponent(JSON.stringify({'uid': uid, 'challengeId': challengeId })));
                    // 如果user与challenge关系表插入成功了，则说明该用户与改挑战没有对应关系，则该挑战下的userNum加1
                    userChallengeRelationresult.then( result => {
                        if ( result.uid != undefined ) {
                            request(urls.addchallengeUserNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': 1 })));
                        }
                    })
                    let videoChallengeRelationresult = request(urls.updateChallengeVideoRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uniqueVideoId': vid, 'challengeId': challengeId })));
                    // 两张关系表更新成功后，challenge表里的videoNum加一
                    videoChallengeRelationresult.then( result => {
                        if ( result.ok == 1 ) {
                            request(urls.addchallengeVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': 1 })));
                        }
                    });
                } else if ( status === 0 && challengeName != '') {
                    // 在video表里根据uid和challenId查询改用户在改挑战下有几个视频
                    let VideoNumWithUidAndChallengeIdresult = request(urls.videoNumWithUidAndChallengeId + '?body=' + encodeURIComponent(JSON.stringify({'uid': uid, 'challengeId': challengeId })));
                    VideoNumWithUidAndChallengeIdresult.then( result => {
                        if ( result.total == 1) {
                            request(urls.addchallengeUserNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': -1 })));
                            request(urls.delChallengeUserRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uid': uid, 'challengeId': challengeId })));
                        }
                    });
                    let delVideoChallengeRelationResult = request(urls.delChallengeVideoRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uniqueVideoId': vid })));
                    delVideoChallengeRelationResult.then( result => {
                        if ( result.ok == 1 ) {
                            request(urls.addchallengeVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': -1 })));
                        }
                    });
                }
                dispatch(actions.update(mongodbresult.docs[0]));
                openNotificationWithSuccess('success');
            } else {
                openNotificationWithFail('error');
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncSearchVideo = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.searchVideo + formatGetParams(getState));
            dispatch(actions.get(result.docs));
            dispatch(actions.changePagination(result.pagination));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

// 修改挑战
export const asyncUpdate = function(content) {
    const challengeName = content.challengeName;
    const oldchallengeName = content.oldchallengeName;
    const oldchallengeId = content.oldchallengeNameID;
    const vid = content.vid;
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            // 更新mongodb主表video的challengeName状态
            let updateContent = await request(
                urls.update + '?body=' + encodeURIComponent(JSON.stringify({ vid: vid, challengeName: challengeName })),
            );
            // 更新ESsearch服务器中视频所属挑战
            let challenge = getState().videomanage.challengeName;
            let userInfo = getState().videomanage.list;
            let challengeId = challenge.filter(x => x.challengeName === content.challengeName).map(x => x.challengeId)[0];
            let uid = userInfo.filter(x => x.uniqueVideoId === content.vid).map(x => x.author.uid)[0];
            const changeChallengeNameOnEsString = '{"' + vid + '":' + '"{\\"challengeName\\":\\"' + challengeName + '\\",' + '\\"challengeId\\":\\"' + challengeId + '\\"}"}';
            request(urls.changeVideoChallengementOnES, 'POST', changeChallengeNameOnEsString);
            // 给机器学习组同步数据到消息队列
            request(urls.changeVideoChallengementOnRAP + '?body=' + encodeURIComponent(JSON.stringify({ 'uniqueVideoId': vid, 'challengeName': challengeName, 'challengeId': challengeId, 'status': content.status })));
            // 更改挑战完成后只等待mongodb的结果返回
            if (updateContent.code === 0) {
                if ( oldchallengeName === '' ) {
                    // 先往user与challenge关系表中插这一对关系
                    let userChallengeRelationresult = request(urls.addChallengeUserRelation + '?body=' + encodeURIComponent(JSON.stringify({'uid': uid, 'challengeId': challengeId })));
                    // 如果user与challenge关系表插入成功了，则说明该用户与改挑战没有对应关系，则该挑战下的userNum加1
                    userChallengeRelationresult.then( result => {
                        if ( result.uid != undefined ) {
                            request(urls.addchallengeUserNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': 1 })));
                        }
                    });
                    // 再往video与challenge关系表中插这对关系
                    let videoChallengeRelationresult = request(urls.updateChallengeVideoRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uniqueVideoId': vid, 'challengeId': challengeId })));
                    // 如果video与challenge关系表插入成功,则该挑战下的videoNum加1
                    videoChallengeRelationresult.then( result => {
                        if ( result.ok == 1 ) {
                            request(urls.addchallengeVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': 1 })));
                        }
                    });
                } else {
                    // video与challenge关系表先删除原挑战的对应关系
                    let delVideoChallengeRelationResult = request(urls.delChallengeVideoRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uniqueVideoId': vid })));
                    // 删除原来挑战与视频关系后，先把原挑战的VideoNum减1,再在关系表里新增一条关系
                    delVideoChallengeRelationResult.then( result => {
                        if (result.ok == 1) {
                            request(urls.addchallengeVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': oldchallengeId, 'inc': -1 })));
                            let newVideoChallengeRelation = request(urls.updateChallengeVideoRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uniqueVideoId': vid, 'challengeId': challengeId })));
                            newVideoChallengeRelation.then( result => {
                                if (result.ok == 1) {
                                    request(urls.addchallengeVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': 1 })));
                                };
                            });
                        };
                    });
                    // user与challenge关系表，先查询该用户在该挑战下是否还有其他视频
                    let VideoNumWithUidAndOldChallengeIdresult = request(urls.videoNumWithUidAndChallengeId + '?body=' + encodeURIComponent(JSON.stringify({'uid': uid, 'challengeId': oldchallengeId })));
                    console.log(VideoNumWithUidAndOldChallengeIdresult)
                    VideoNumWithUidAndOldChallengeIdresult.then( result => {
                        // 如果没有了，则删除原来这一条关系,原挑战的userNum再减一
                        if ( result.total == 0) {
                            request(urls.delChallengeUserRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uid': uid, 'challengeId': oldchallengeId })));
                            request(urls.addchallengeUserNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': oldchallengeId, 'inc': -1 })));
                        }
                    });
                    // 删除原挑战与用户的关系后，新增关系且判断该用户在新增挑战下的视频数量，如果数量原来就大于0，则userNum就不加1
                    let userNewChallengeRelationresult = request(urls.addChallengeUserRelation + '?body=' + encodeURIComponent(JSON.stringify({'uid': uid, 'challengeId': challengeId })));
                    // 如果user与challenge关系表插入成功了,再去查询改用户在新挑战下有没有其他视频
                    userNewChallengeRelationresult.then( result => {
                        if (result.uid != undefined) {
                            let VideoNumWithUidAndnewChallengeIdresult = request(urls.videoNumWithUidAndChallengeId + '?body=' + encodeURIComponent(JSON.stringify({'uid': uid, 'challengeId': challengeId })));
                            VideoNumWithUidAndnewChallengeIdresult.then( results => {
                                // 如果之前就已经有视频了，userNum就不加1
                                // 如果没有，userNum就需要加1
                                if ( results.total = 1) {
                                    request(urls.addchallengeUserNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': 1 })));
                                };
                            });
                        };
                    });
                };
                dispatch(actions.update(updateContent.docs[0]));
                openNotificationWithSuccess('success');
            } else {
                openNotificationWithFail('error');
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

// 批量修改视频上下线
export const asyncBatchChangeVideostatus = (status, selectedRows) => {
    return async dispatch => {
        try {
            let uid = '';
            let vid = '';
            let challengeName = '';
            let challengeId = '';
            let VideoStatusOnRapArray = [];
            let changeVideoStatusOnEsArray = [];
            for (let i = 0; i < selectedRows.length; i++) {
                uid = selectedRows[i].author.uid;
                vid = selectedRows[i].uniqueVideoId;
                challengeId = selectedRows[i].challengeId;
                challengeName = selectedRows[i].challengeName;
                dispatch(actions.changeUiStatus({ isLoading: true }));
                let changeVideoStatusOnEsString = '"' + vid + '":"{\\"status\\":\\"' + status + '\\"}"';
                changeVideoStatusOnEsArray.push(changeVideoStatusOnEsString.toString());
                // 同步数据到机器学习消息队列
                VideoStatusOnRapArray.push(JSON.stringify({ 'uniqueVideoId': vid, 'status': status }));
                // 下面的请求和结果返回需要根据接口来实现
                // 更新mongodb主video表的上下线状态
                let mongodbresult = await request(
                    urls.changeVideoStatus + '?body=' + encodeURIComponent(JSON.stringify({ vid: vid, status: status })),
                );
                // 上下线调用
                if (status == 1) {
                    request(urls.changeVideoStatusToRobot + '?' + 'uid=' + uid + '&vid=' + vid, 'POST', {});
                    // 更改redis用户作品数量
                    request(urls.updateProductVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ uid: uid, 'inc': 1  })));
                };
                if (status == 0) {
                    if (selectedRows[i].status != 2) {
                        request(urls.updateProductVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ uid: uid, 'inc': -1  })));
                    }
                };
                // 更改后结果返回，刷新页面，只等待mongodb的更改成功结果
                if (mongodbresult.code === 1) {
                    // 当视频上线且有所属挑战时，更新用户与挑战关系表
                    if ( status === 1 && challengeName != '' ) {
                        let userChallengeRelationresult = request(urls.addChallengeUserRelation + '?body=' + encodeURIComponent(JSON.stringify({'uid': uid, 'challengeId': challengeId })));
                        // 如果user与challenge关系表插入成功了，则说明该用户与改挑战没有对应关系，则该挑战下的userNum加1
                        userChallengeRelationresult.then( result => {
                            if ( result.uid != undefined ) {
                                request(urls.addchallengeUserNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': 1 })));
                            }
                        })
                        let videoChallengeRelationresult = request(urls.updateChallengeVideoRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uniqueVideoId': vid, 'challengeId': challengeId })));
                        // 两张关系表更新成功后，challenge表里的videoNum加一
                        videoChallengeRelationresult.then( result => {
                            if ( result.ok == 1 ) {
                                request(urls.addchallengeVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': 1 })));
                            }
                        });
                    } else if ( status === 0 && challengeName != '') {
                        // 在video表里根据uid和challenId查询改用户在改挑战下有几个视频
                        let VideoNumWithUidAndChallengeIdresult = request(urls.videoNumWithUidAndChallengeId + '?body=' + encodeURIComponent(JSON.stringify({'uid': uid, 'challengeId': challengeId })));
                        VideoNumWithUidAndChallengeIdresult.then( result => {
                            if ( result.total == 1) {
                                request(urls.addchallengeUserNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': -1 })));
                                request(urls.delChallengeUserRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uid': uid, 'challengeId': challengeId })));
                            }
                        });
                        let delVideoChallengeRelationResult = request(urls.delChallengeVideoRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uniqueVideoId': vid })));
                        delVideoChallengeRelationResult.then( result => {
                            if ( result.ok == 1 ) {
                                request(urls.addchallengeVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': -1 })));
                            }
                        });
                    };
                    dispatch(actions.update(mongodbresult.docs[0]));
                    openNotificationWithSuccess('success');
                } else {
                    openNotificationWithFail('error');
                }
            }
            // 同步数据到机器学习消息队列
            request(urls.changeVideoStatusOnRAP + '?body=' + encodeURIComponent('[' + VideoStatusOnRapArray.toString() + ']'));
            // 批量更新ESsearch服务器中视频上下线状态
            request(urls.changeaVideoStatusOnES, 'POST', '{' + changeVideoStatusOnEsArray.toString() + '}');
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    }
}

// 下拉框模糊搜索挑战
export const asyncGetVagueChallenge = value => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.vagueSearchChallenge + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeName': value})));
            if (result.code == 1) {
                let challengeName = result.docs;
                dispatch(actions.getChallengeName(challengeName));
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncreturnVideoCreator = () => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.queryVideoCreator);
            dispatch(actions.getvideoCreator(result));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};