import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import styles from './topLayout.css';
const { Header, Content } = Layout;
import Nav from '../components/nav/';
import Breadcrumb from '../components/breadcrumb/';
import UserInfo from '../components/userinfo/';
import NoPermissions from '../pages/nopermissions';
import store from '../store';
import { routerList } from '../routerConfig';
import { hasRoles } from 'utils';

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
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };
    render() {
        return (
            <Layout>
                <Header className={styles.header}>
                    <div className={styles.logo}>logo</div>
                    <div className={styles.nav}>
                        <Nav theme="light" mode="horizontal" openKey={false} />
                    </div>
                    <div className={styles.tools}>
                        <UserInfo />
                    </div>
                </Header>
                <div className={styles.breadcrumbWrapper}>
                    <Breadcrumb />
                </div>
                <Content>
                    <Switch>{routersCompList}</Switch>
                </Content>
                <div>copyright</div>
            </Layout>
        );
    }
}

export default Comp;
