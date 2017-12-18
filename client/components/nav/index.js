import React from 'react';
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import { matchPath } from 'react-router';
import { routerTree } from '../../routerConfig';
import { hasRoles } from 'utils';
const { SubMenu } = Menu;
import store from '../../store';

const userRoles = store.getState().user.info.roles;

/**
 * 从routerTree中获取所有type为flod的元素的path，用于进行当前打开目录的筛选
 * @param {Object} items routerTree 或者 routerTree中的一个children对象
 * @param {Array} result path的集合
 * @return {Array} 返回 result
 */
const getFlodList = (items, result = []) => {
    for (let item of items) {
        if (item.type === 'flod') {
            result.push(item.path);
            if (item.children) {
                getFlodList(item.children, result);
            }
        } else if (item.children) {
            getFlodList(item.children, result);
        }
    }
    return result;
};

/**
 * 从routerTree中获取所有显示的leaf的元素的path集合，用于进行当前选中状态的筛选
 * @param {Object} items routerTree 或者 routerTree中的一个children对象
 * @param {Array} result path的集合
 * @return {Array} 返回 result
 */
const getPathList = (items, result = []) => {
    for (let item of items) {
        if (item.isDisplay && item.type === 'leaf') {
            result.push(item.path);
        }
        if (item.children) {
            getPathList(item.children, result);
        }
    }
    return result;
};

/**
 * 通过react-router的matchPath函数，看当前参数是否跟path匹配。
 * @param {String} path 路径
 * @param {String} key 需要匹配的字段
 * @return {Boolean} 返回是否匹配
 */
const matchKey = (path, key) => {
    return matchPath(path, {
        path: key,
        exact: false,
        strict: false,
    });
};

/**
 * 通过传入的routerTree上面的leaf对象，建菜单子节点
 * @param {Object} item leaf对象
 * @return {JSX} 返回一段 jsx代码
 */
const createMenuItem = item =>
    item.isDisplay && hasRoles(item.roles, userRoles) ? (
        <Menu.Item key={item.path}>
            <Icon type={item.iconType} />
            <span>{item.value}</span>
        </Menu.Item>
    ) : (
        ''
    );
/**
 * 创建菜单入口程序
 * @param {Object} items
 * @return {Array} 返回一个 JSX 数组
 */
const createMenu = items =>
    items.map(item => {
        if (item.type === 'layout') {
            return createMenu(item.children);
        } else if (item.type === 'leaf') {
            return createMenuItem(item);
        } else {
            if (hasRoles(item.roles, userRoles)) {
                return (
                    <SubMenu
                        key={item.path}
                        hasCreate
                        title={
                            <span>
                                <Icon type={item.iconType} />
                                <span>{item.value}</span>
                            </span>
                        }>
                        {createMenu(item.children)}
                    </SubMenu>
                );
            } else {
                return '';
            }
        }
    });

const flodList = getFlodList(routerTree);
const pathList = getPathList(routerTree);

class Comp extends React.Component {
    clickHandle = ({ key }) => {
        this.props.history.push(key);
    };
    render() {
        console.log('render menu');
        const { location } = this.props;
        let openKeys = [];
        let selectKey = '/';

        if (this.props.openKeys) {
            for (let flod of flodList) {
                if (matchKey(location.pathname, flod)) {
                    openKeys.push(flod);
                }
            }
        }

        for (let path of pathList) {
            // 不加break的原因是想让他匹配到最后一个能匹配的。
            if (matchKey(location.pathname, path)) {
                selectKey = path;
                // break;
            }
        }

        return (
            <Menu
                mode={this.props.mode}
                theme={this.props.theme}
                defaultSelectedKeys={[selectKey]}
                defaultOpenKeys={openKeys}
                onClick={this.clickHandle}>
                {createMenu(routerTree)}
            </Menu>
        );
    }
}

export default withRouter(Comp);

// export default withRouter(props => {
//     const { location } = props;
//     let openKeys = [];
//     let selectKey = '/';

//     for (let flod of flodList) {
//         if (matchKey(location.pathname, flod)) {
//             openKeys.push(flod);
//         }
//     }

//     for (let path of pathList) {
//         // 不加break的原因是想让他匹配到最后一个能匹配的。
//         if (matchKey(location.pathname, path)) {
//             selectKey = path;
//             // break;
//         }
//     }

//     return (
//         <Menu
//             mode="inline"
//             theme="dark"
//             defaultSelectedKeys={[selectKey]}
//             defaultOpenKeys={openKeys}
//             onClick={clickHandle}>
//             {createMenu(routerTree)}
//         </Menu>
//     );
// });
