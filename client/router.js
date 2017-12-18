import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';
import FullLayout from './layout/fullLayout';
import SiderLayout from './layout/siderLayout';
import history from './history';

export default () => {
    return (
        <Provider store={store}>
            <Router history={history} >
                <Switch>
                    <Route path="/user" component={FullLayout} />
                    <Route path="/" component={SiderLayout} />
                    <Redirect to="/" />
                </Switch>
            </Router>
        </Provider>
    );
};
