import Home from './pages/home';
import Usermanage from './pages/usermanage/';
import Videomanage from './pages/videomanage/';
import Challengement from './pages/challengement/';
import Notice from './pages/notice';
import Permission from './pages/permission';
import Userexamine from './pages/userexamine';
import Reportmanage from './pages/reportmanage'

console.log('routerConfig init');
/**
 * 计算当前目录的权限，当前目录的权限包括当前目录下面children及其以下的目录的权限。
 * @param {Object} flod 一个routerTree的片段。
 * @param {Array} roles 记录权限集合。
 * @return {Array} 返回 roles
 */
const calcFlodRoles = (flod, roles = []) => {
    for (let item of flod.children) {
        if (item.type === 'leaf') {
            for (let role of item.roles) {
                if (!roles.includes(role)) {
                    roles.push(role);
                }
            }
        } else {
            calcFlodRoles(item, roles);
        }
    }
    return roles;
};

/**
 * 对routerTree进行格式化，为每个flod增加roles。
 * @param {Object} items routerTree 或者 routerTree中的一个children对象
 * @return {Object} 返回 items
 */
const formatRouteTreeByRoles = items => {
    for (let item of items) {
        if (item.type === 'layout') {
            formatRouteTreeByRoles(item.children);
        } else if (item.type === 'flod') {
            item.roles = calcFlodRoles(item);
            formatRouteTreeByRoles(item.children);
        }
    }
    return items;
};

/**
 * 从routerTree中获取所有type为leaf的对象组成数组
 * @param {Object} routers routerTree 或者 routerTree中的一个children对象
 * @param {Array} result 路由的集合
 * @return {Array} 返回 result
 */
const getCompFromRouterTree = (routers, result = []) => {
    for (let router of routers) {
        if (router.type === 'leaf') {
            result.push(router);
        } else {
            if (router.comp && router.type === 'flod') {
                result.push(router);
            }
            getCompFromRouterTree(router.children, result);
        }
    }
    return result;
};

/**
 * 对路由树中type为flod的节点进行roles进行计算，
 */
export const routerTree = formatRouteTreeByRoles([
    {
        layout: 'siderLayout',
        value: '首页',
        type: 'layout',
        path: '/',
        children: [
            {
                path: '/',
                comp: Home,
                exact: true,
                value: '首页',
                isDisplay: true,
                type: 'leaf',
                iconType: 'home',
                roles: [1, 2],
            },
            {
                path: '/usermanage',
                comp: Usermanage,
                exact: true,
                value: '用户管理',
                isDisplay: true,
                type: 'leaf',
                iconType: 'user',
                roles: [1, 2],
            },
            {
                path: '/videomanage',
                comp: Videomanage,
                exact: true,
                value: '视频管理',
                isDisplay: true,
                type: 'leaf',
                iconType: 'video-camera',
                roles: [1, 2],
            },
            {
                path: '/videomanage/:urlValue',
                comp: Videomanage,
                exact: true,
                value: '视频管理',
                isDisplay: false,
                type: 'leaf',
                iconType: 'video-camera',
                roles: [1, 2],
            },
            {
                path: '/challengement',
                comp: Challengement,
                exact: true,
                value: '挑战管理',
                isDisplay: true,
                type: 'leaf',
                iconType: 'bars',
                roles: [1, 2],
            },
            {
                path: '/notice',
                comp: Notice,
                exact: true,
                value: '公告管理',
                isDisplay: true,
                type: 'leaf',
                iconType: 'notification',
                roles: [1, 2],
            },
            {
                path: '/permission',
                comp: Permission,
                exact: true,
                value: '权限管理',
                isDisplay: true,
                type: 'leaf',
                iconType: 'setting',
                roles: [2],
            },
            {
                path: '/userexamine',
                comp: Userexamine,
                exact: true,
                value: '资料审查',
                isDisplay: true,
                type: 'leaf',
                iconType: 'edit',
                roles: [1, 2],
            },
            {
                path: '/reportmanage',
                comp: Reportmanage,
                exact: true,
                value: '举报管理',
                isDisplay: true,
                type: 'leaf',
                iconType: 'exception',
                roles: [1, 2],
            }
        ],
    }
]);


/**
 * 这里采用深度优先的原则进行遍历，所以拿到的路由列表跟routerTree里面的顺序是一样的。
 * 这里需要注意的是，主区域的路由是switch模式（只匹配能匹配到的第一个），
 * 所以这里顺序很重要，更改后需要及时验证
 */
export const routerList = getCompFromRouterTree(routerTree);
