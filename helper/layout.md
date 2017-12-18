# 布局配置说明

## 描述

layout目录主要对系统的整体布局和公共部分进行了定义，包括如下几个文件：

## 位置

这些文件放置在 `app/layout/` 目录中

## 文件描述

1. `breadcrumb.jsx` 面包屑文件
2. `header.jsx` 头部文件
3. `index.js` 入口文件，并对页面整体布局，路由生成，登录控制进行了定义
4. `routerConfig.js` 路由配置文件，对路由配置进行描述，详细见 `routerConfig.md`
5. `sider.jsx` 侧栏菜单
6. `style.css` layout的样式文件
7. `userinfo.jsx` header 用户信息
8. `utils.js` layout中的公用js。

## 注意事项

`breadcrumb.jsx` `sider.jsx` `index.js` 中和路由相关的部分都使用了 `routerConfig.js`
