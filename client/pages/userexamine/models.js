import { createReducers, createActions, request, sleep } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';
import { notification } from 'antd';

const urls = {
    get: APIHOST + 'queryallEditUser',
    searchUser: APIHOST + 'searchEditUser',
    handleUserInfoSubmit: 'http://user.51fa.shop/videoapi/users/modification_personal_status',
};

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

const path = name => `app/pages/userexamine/${name}`;

const models = {
    list: {
        data: [],
        handlers: {
            get(state, action) {
                return action.payload;
            }
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
        data: {
            checkStatus: 3,
        },
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
};

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));

const formatGetParams = getState => {
    const state = getState().userexamine;
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
export const asyncSearchUser = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.searchUser + formatGetParams(getState));
            dispatch(actions.get(result.docs));
            dispatch(actions.changePagination(result.pagination));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};
export const asyncChangeCstatus = (uid, checkStatus, modifyTime, userKey) => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            modifyTime = modifyTime || Date.parse(new Date());
            const singleObj = { uid: uid, checkStatus: checkStatus, modifyTime: modifyTime, user_key: userKey }
            const singleStr = JSON.stringify(singleObj)
            let modification_personal_status_results = await request(urls.handleUserInfoSubmit + '?body=' + encodeURIComponent('[' + singleStr + ']'));
            if ( modification_personal_status_results == true ) {
                let result = await request(urls.get + formatGetParams(getState));
                dispatch(actions.get(result.docs));
                dispatch(actions.changePagination(result.pagination));
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
export const asyncBatchChangeCstatus = (checkStatus, selectedRows) => {
    return async (dispatch, getState) => {
        try {
            let BatchArray = [];
            for (let i = 0; i < selectedRows.length; i++) {
                let BatchChange = { uid: selectedRows[i].uid, checkStatus: checkStatus, modifyTime: selectedRows[i].modifyTime, user_key: selectedRows[i].userKey};
                BatchArray.push(JSON.stringify(BatchChange));
            }
            let modification_personal_status_results = await request(urls.handleUserInfoSubmit + '?body=' + encodeURIComponent('[' + BatchArray.toString() + ']'));
            if ( modification_personal_status_results == true ) {
                let result = await request(urls.get + formatGetParams(getState));
                dispatch(actions.get(result.docs));
                dispatch(actions.changePagination(result.pagination));
                openNotificationWithSuccess('success');
            } else {
                openNotificationWithFail('error');
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    }
}


