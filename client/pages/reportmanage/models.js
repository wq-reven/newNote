import { createReducers, createActions, request, sleep } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';

const urls = {
    get: APIHOST + 'searchReportInfo',
    searchVideo: APIHOST + 'searchVideo',
    changeReportInfo: APIHOST + 'changeReportInfo',
    changeVideoStatus: APIHOST + 'changeVideoStatus',
    addChallengeUserRelation: APIHOST + 'addChallengeUserRelation',
    delChallengeUserRelation: APIHOST + 'delChallengeUserRelation',
    updateChallengeVideoRelation: APIHOST + 'updateChallengeVideoRelation',
    changeVideoChallengementOnES: 'http://local.51fa.shop/videoapi/data/updateES?dataType=video',
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
};

const path = name => `client/pages/reportmanage/${name}`;

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
                return state.map(item => (item._id === action.payload._id ? action.payload : item));
            },
        },
    },
    pagination: {
        data: {
            current: 1,
            total: 0,
            pageSize: 20,
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
    searchValues: {
        data: {},
        handlers: {
            changeSearchValues(state, action) {
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
    const state = getState().reportmanage;
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

export const asyncGet = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            console.log(getState.querys)
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.get + formatGetParams(getState));
            console.log(result)
            dispatch(actions.get(result.docs));
            dispatch(actions.changePagination(result.pagination));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asynchangeReportInfo = (id, vid, processResult) => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let update = await request(urls.changeReportInfo + '?body=' + encodeURIComponent(JSON.stringify({
                _id: id,
                reportStatus: 1,
                processResult: processResult,
                updated: Date.parse(new Date()),
                processor: getState().user.info.id,
            })) );
            let result = await request(urls.searchVideo + '?body=' + encodeURIComponent(JSON.stringify({
                'querys': {
                    'uniqueVideoId': vid
                },
                'sort': {},
                'pagination': {
                    'current': 1,
                    'pageSize': 10
                }
            })));
            let uid = result.docs[0].author.uid;
            let challengeName = result.docs[0].challengeName;
            let challengeId = result.docs[0].challengeId;
            let status = 0;
            dispatch(actions.update(update.docs[0]));
            // 下面的请求和结果返回需要根据接口来实现
            // 更新mongodb主video表的上下线状态
            let mongodbresult = await request(
                urls.changeVideoStatus + '?body=' + encodeURIComponent(JSON.stringify({ vid: vid, status: status })),
            );
            // // 更新ESsearch服务器中视频上下线状态
            const changeVideoStatusOnEsString = '{"' + vid + '":' + '"{\\"status\\":\\"' + status + '\\"}"}';
            request(urls.changeaVideoStatusOnES, 'POST', changeVideoStatusOnEsString);
            // // 同步数据到机器学习消息队列
            request(urls.changeVideoStatusOnRAP + '?body=' + encodeURIComponent('[' + JSON.stringify({ 'uniqueVideoId': vid, 'status': status }) + ']'));
            // 下线调用
            request(urls.updateProductVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ uid: uid, 'inc': -1  })));
            // 更改后结果返回，刷新页面，只等待mongodb的更改成功结果
            if (mongodbresult.code === 1) {
                // 当视频上线且有所属挑战时，更新用户与挑战关系表
                if ( challengeName != '') {
                    // 在video表里根据uid和challenId查询改用户在改挑战下有几个视频
                    let VideoNumWithUidAndChallengeIdresult = request(urls.videoNumWithUidAndChallengeId + '?body=' + encodeURIComponent(JSON.stringify({'uid': uid, 'challengeId': challengeId })));
                    VideoNumWithUidAndChallengeIdresult.then( result => {
                        if ( result.total == 1) {
                            request(urls.addchallengeUserNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': -1 })));
                        }
                    });
                    let delVideoChallengeRelationResult = request(urls.delChallengeVideoRelation + '?body=' + encodeURIComponent(JSON.stringify({ 'uniqueVideoId': vid })));
                    if ( delVideoChallengeRelationResult.ok == 1) {
                        request(urls.addchallengeVideoNum + '?body=' + encodeURIComponent(JSON.stringify({ 'challengeId': challengeId, 'inc': -1 })));
                    }
                }
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

