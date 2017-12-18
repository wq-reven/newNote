# routerConfig 路由配置说明

## 文件描述

该文件主要以树的形式描述了项目的路由配置，节点分为两个种类

1. 目录节点，用于设置左侧的目录

2. 叶子节点，用于设置路由和组件的对应

## 文件位置

该文件放置在 `app/layout/routerConfig.js` 中

## 代码结构

### 目录节点

```
    {
        path: '/event', // 目录的 key 需要跟路由的目录对应，用于在页面刷新时能与路由匹配上，能将其设置为open
        value: '事件管理', // 目录的名称
        comp: Building, // 路由对应的模块，推荐在目录节点也进行声明，保持路由的完整性。
        exact: true, // 路由是否为精确匹配，是给 react-router 的 api 使用的
        iconType: 'user', // 目录前面的图标类型
        type: 'flod', // 节点类型
        children: [] // 其拥有的子节点
    }
```

### 叶子节点

```
    {
        path: '/event/statistics', // 节点的路由
        comp: Building, // 路由对应的模块，需要在改模块中进行声明
        exact: true, // 路由是否为精确匹配，是给 react-router 的 api 使用的
        value: '事件统计', // 节点的名称
        isDisplay: false, // 是否在左侧菜单显示
        type: 'leaf', // 节点类型
        roles: [1], // 节点的角色组，是一个数组，一个节点可以拥有多个角色
    }

```

## 使用方式

1. 将 `pages` 中的模块引入。例如：

```
import Building from '../pages/building';
```

2. 在routerTree 中对该节点进行声明，例如：

```
    {
        path: '/books',
        comp: Books,
        exact: true,
        value: '书籍管理',
        isDisplay: true,
        type: 'leaf',
        roles: [1, 2, 3],
    }
```

## 注意事项

这里有几个问题是需要注意的

1. routerTree 中节点的顺序就是菜单栏目的展示顺序。

2. 由于 react-router 的路由匹配规则，对于路由定义的先后顺序还是有一定要求的，原则上是精确匹配在前，模糊匹配在后。

3. 如果展示顺序和路由顺序冲突的话，需要优先路由顺序。

4. 该模块向外暴露了两个接口：`routerTree` 路由树 和 `routerList` 叶子节点列表，方便其他模块使用。