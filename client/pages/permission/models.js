import { createReducers, createActions, request, sleep } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';
import { notification } from 'antd';

const urls = {
    get: APIHOST + 'searchUserManager',
    del: APIHOST + 'booksdel',
    update: APIHOST + 'changeManagerPermission',
    add: APIHOST + 'addUserManager',
    checkUserManager: APIHOST + 'checkUserManager',
};

const path = name => `app/pages/permission/${name}`;

const openNotificationWithSuccess = type => {
    notification[type]({
        message: '成功',
        description: '操作已成功！',
    });
};
const openNotificationWithFail = type => {
    notification[type]({
        message: '失败',
        description: '操作失败！',
    });
};
const openNotificationWithIcon = type => {
    notification[type]({
        message: '无法添加',
        description: '管理员已存在',
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
                return [action.payload, ...state];
            },
            del(state, action) {
                return state.filter(item => item.id !== action.payload);
            },
            update(state, action) {
                return state.map(item => (item.uid === action.payload.uid ? action.payload : item));
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
    const state = getState().permission;
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

export const asyncDel = id => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.del + '?body=' + encodeURIComponent(JSON.stringify({ id: id })));
            dispatch(actions.del(result.id));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncUpdateManagerPermission = ( permission, uid ) => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let updateContent = await request(urls.update + '?body=' + encodeURIComponent(JSON.stringify({ uid: uid, permission: permission })));
            if(updateContent.code == 1 ) {
                openNotificationWithSuccess('success');
                dispatch(actions.update(updateContent.docs[0]));
            }
            else {
                openNotificationWithFail('error');
            }

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
            // 先检查管理员姓名是否存在
            // let newContents = await request(urls.add + '?body=' + encodeURIComponent(JSON.stringify({ nickname: contents[0].nickname, department: contents[0].department, roles: contents[0].roles })));
            // 如果不存在，再添加，如果已存在，提示不得添加
            let checkNickNameExist = await request(urls.checkUserManager + '?body=' + encodeURIComponent(JSON.stringify({ nickname: contents[0].nickname })));
            if ( checkNickNameExist.exist == 1 ) {
                console.log('管理员已存在');
                openNotificationWithIcon('error');
            } else {
                let managerInfo = {
                    nickname: contents[0].nickname,
                    roles: contents[0].roles,
                    userName: contents[0].userName,
                };
                let addUserManagerResult = await request(urls.add + '?body=' + encodeURIComponent(JSON.stringify(managerInfo)));
                dispatch(actions.add(addUserManagerResult));
                openNotificationWithSuccess('success');
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};
