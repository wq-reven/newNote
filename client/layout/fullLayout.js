import React from 'react';
import { Layout } from 'antd';
const { Content, Header } = Layout;
import { Route, Switch} from 'react-router-dom';
import { routerList } from '../routerConfig';
import { hasRoles } from 'utils';
import store from '../store';

import NoPermissions from '../pages/nopermissions';

const userRoles = store.getState().user.info.roles;
const routersCompList = routerList.map(
    router =>
        hasRoles(router.roles, userRoles) ? (
            <Route exact={router.exact ? true : false} path={router.path} component={router.comp} />
        ) : (
            <Route exact={router.exact ? true : false} path={router.path} component={NoPermissions} />
        ),
);

class Comp extends React.Component {
    render() {
        return (
            <Layout>
                <Header>logo</Header>
                <Content>
                    <Switch>{routersCompList}</Switch>
                </Content>
                <div>copyright</div>
            </Layout>
        );
    }
}

export default Comp;
