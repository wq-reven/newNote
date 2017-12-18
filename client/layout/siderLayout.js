import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout, Icon, Row, Col } from 'antd';
import styles from './siderLayout.css';
const { Header, Sider, Content } = Layout;
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
                <Sider trigger={null} collapsible breakpoint="md" collapsed={this.state.collapsed} width={256} className={styles.siderbar}>
                    <div className={styles.logo}>短视频</div>
                    <Nav mode="inline" theme="dark" openKey={true} />
                    <Col className={styles.triggericon}>
                        <Icon
                            className={styles.trigger}
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Col>
                </Sider>
                <Layout className={styles.rightbody}>
                    <Header className={styles.header}>
                        <Row>
                            <Col span={16}>
                                <div className={styles.breadcrumbWrapper}>
                                    <Breadcrumb />
                                </div>
                            </Col>
                            <Col span={8}>
                                <UserInfo />
                            </Col>
                        </Row>
                    </Header>
                    <Content>
                        <Switch>{routersCompList}</Switch>
                    </Content>

                    <div className={styles.copyright}>copyright</div>
                </Layout>
            </Layout>
        );
    }
}

export default Comp;
