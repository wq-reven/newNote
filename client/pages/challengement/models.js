import { createReducers, createActions, request, sleep } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';
import { notification } from 'antd';

const urls = {
    get: APIHOST + 'queryAllChallenges',
    del: APIHOST + 'deleteChallenge',
    searchChallenge: APIHOST + 'queryAllChallenges',
    update: APIHOST + 'booksupdate',
    add: APIHOST + 'addChallenge',
    addOnES: 'http://local.51fa.shop/videoapi/data/insertES?dataType=challenge',
    delOnES: 'http://local.51fa.shop/videoapi/data/updateES?dataType=challenge',
    getChallengeName: APIHOST + 'returnAllChallengeMent',
};

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

const path = name => `app/pages/challengement/${name}`;

const models = {
    list: {
        data: [],
        handlers: {
            get(state, action) {
                return action.payload;
            },
            add(state, action) {
                return [action.payload, ...state];
            },
            del(state, action) {
                return state.filter(item => item.challengeId !== action.payload);
            },
            update(state, action) {
                return state.map(item => (item.id === action.payload.id ? action.payload : item));
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
    searchValues: {
        data: {},
        handlers: {
            changeSearchValues(state, action) {
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
    challengeExisted: {
        data: {},
        handlers: {
            addChallengeErr(state, action) {
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

const openNotificationWithIcon = type => {
    notification[type]({
        message: '无法添加',
        description: '挑战已存在',
    });
};
const openNotificationWithSuccess = type => {
    notification[type]({
        message: '成功！',
        description: '操作已成功！',
    });
};
const openNotificationOnDelErr = type =>{
    notification[type]({
        message: '失败！',
        description: '删除失败！请尝试重新删除.',
    });
};
const formatGetParams = getState => {
    const state = getState().challengement;
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
            // 下面的请求和结果返回需要根据接口来实现
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
export const asyncSearch = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.searchChallenge + formatGetParams(getState));
            dispatch(actions.get(result.docs));
            dispatch(actions.changePagination(result.pagination));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncDel = challengeId => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(
                urls.del + '?body=' + encodeURIComponent(JSON.stringify({ challengeId: challengeId })),
            );
            const changeChallengeNameOnEsString = '{"' + challengeId + '":' + '"{\\"challengeStatus\\": 3 }"}';
            await request(urls.delOnES, 'POST', changeChallengeNameOnEsString);
            if (result.code === 1) {
                dispatch(actions.del(result.docs));
                openNotificationWithSuccess('success');
            } else {
                openNotificationOnDelErr('error');
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncUpdate = content => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let updateContent = await request(urls.update, 'POST', content);
            dispatch(actions.update(updateContent));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncAdd = contents => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            const uuid = guid();
            const datenow = new Date();
            const avatar = 'http://p1.ifengimg.com/a/2017/1205/3c5f8e41be1ec82size5_w192_h192.png';
            let newContents = await request(
                urls.add +
                    '?body=' +
                    encodeURIComponent(
                        JSON.stringify({
                            challengeName: contents[0].challengeName,
                            userName: contents[0].userName,
                            userId: contents[0].userId,
                            creator: '快闪小助手',
                            creatorId: 10000,
                            challengeId: uuid,
                            datenow: datenow,
                            avatar: avatar,
                            sex: 2,
                            signature: '',
                            createSource: 2,
                            userNum: 0,
                            videoNum: 0,
                            challengeStatus: 1.0,
                        }),
                    ),
            );
            let value = {
                'challengeName': contents[0].challengeName,
                'challengeDesc': contents[0].challengeName,
                'challengeId': uuid,
                'cTime': datenow,
                'createSource': 2,
                'userNum': 0,
                'videoNum': 0,
                'challengeStatus': 1.0,
                'creatorInfo': {
                    'avatarLarger': avatar,
                    'avatarMedium': avatar,
                    'avatarThumb': avatar,
                    'nickname': '快闪小助手',
                    'sex': 2,
                    'signature': '',
                    'uid': 10000,
                }
            };
            if (newContents.msg === '挑战已存在') {
                openNotificationWithIcon('error');
                dispatch(actions.addChallengeErr(newContents));
            } else {
                let key = uuid;
                let ESbody = {key: value};
                ESbody[key] = ESbody['key'];
                delete ESbody['key'];
                await request(urls.addOnES, 'POST', ESbody);
                dispatch(actions.add(newContents));
                openNotificationWithSuccess('success');
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncGetChallenge = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.getChallengeName + formatGetParams(getState));
            let challengeName = result.docs;
            dispatch(actions.getChallengeName(challengeName));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};
