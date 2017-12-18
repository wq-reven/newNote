import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import user from './common/models/user';

import login from './pages/login/models';
import challengement from './pages/challengement/models';
import notice from './pages/notice/models';
import videomanage from './pages/videomanage/models';
import usermanage from './pages/usermanage/models';
import permission from './pages/permission/models';
import userexamine from './pages/userexamine/models';
import reportmanage from './pages/reportmanage/models';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
    combineReducers({
        user,
        login,
        challengement,
        notice,
        videomanage,
        usermanage,
        permission,
        userexamine,
        reportmanage,
    }),
    composeEnhancers(applyMiddleware(thunk)),
);
