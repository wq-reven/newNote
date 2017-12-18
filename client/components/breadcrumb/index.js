import React from 'react';
import { matchPath } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { routerList } from '../../routerConfig';

/**
 * 从路由列表中找到对应的路由的描述
 * @param {String} url 
 * @param {Array} matchs 
 * @return {String} 返回匹配的名字，如果没有匹配的名字，用描述和 console.error 发出警告
 */
const matchValue = (url, matchs) => {
    for (let matchItem of matchs) {
        if (
            matchPath(url, {
                path: matchItem.path,
                strict: true,
                exact: true,
                value: matchItem.value,
            })
        ) {
            return matchItem.value;
        }
    }
    console.error(url, '没有匹配的路由，请在routerConfig.js文件中进行配置');
    return `Error=>( ${url} ) 没有匹配的路由`;
};

export default withRouter(props => {
    const { location } = props;
    // 过滤掉空的单元
    const pathSnippets = location.pathname.split('/').filter(i => i);

    const items = pathSnippets.map((path, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const value = matchValue(url, routerList);
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{value}</Link>
            </Breadcrumb.Item>
        );
    });

    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">首页</Link>
        </Breadcrumb.Item>,
    ].concat(items);

    return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
});
