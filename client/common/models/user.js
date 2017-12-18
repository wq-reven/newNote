import { createReducers, createActions, request, sleep } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';

const urls = {
    login: APIHOST + 'login',
    logout: APIHOST + 'logout',
};

const path = name => `common:user:${name}`;

const guestInfo = {
    id: Math.round(Math.random() * 10000),
    user_name: 'guest',
    name: '游客',
    phone: '',
    email: '',
    token: 'dsada',
    roles: [1],
};

const userInfo = {
    id: parseInt(window.userInfo.userId),
    user_name: window.userInfo.nickname,
    name: window.userInfo.nickname,
    token: 'dsada',
    roles: [parseInt(window.userInfo.roles)],
};


const models = {
    info: {
        data: userInfo,
        handlers: {
            login(state, action) {
                sessionStorage.setItem('__userInfo', JSON.stringify(action.payload));
                return action.payload;
            },
            logout() {
                sessionStorage.removeItem('__userInfo');
                return { ...guestInfo };
            },
        },
    },
};

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));

export const asyncLogin  = (userName, password) => {
    return async (dispatch, getState) => {
        try {
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.login + `?userName=${userName}&password=${password}`);
            await sleep(1000);
            dispatch(actions.login(result));
        } catch (e) {
            throw e;
        } finally {
        }
    };
};

export const asyncLogout = () => {
    return async (dispatch, getState) => {
        try {
            // 下面的请求和结果返回需要根据接口来实现
            await request(urls.logout);
            dispatch(actions.logout());
        } catch (e) {
            throw e;
        } finally {
        }
    };
};
