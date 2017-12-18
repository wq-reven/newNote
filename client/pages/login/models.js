import { createReducers, createActions } from '../../utils/';
import { combineReducers } from 'redux';

const path = name => `pages:login:${name}`;

const models = {
    uiStatus: {
        data: {
            isLoading: false,
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
