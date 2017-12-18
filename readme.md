# 项目说明

## 项目概述

该项目的主要用途是创建一个内部管理平台的脚手架，并提供项目布局，路由管理，用户登录，用户管理和权限设置等基础通用功能。

并提供一下通用功能的基础模板，通过创建schema和config配置，能够快速生成基础代码，开发人员可以基于此代码进行二次开发。

## 项目环境

1. 项目基于的nodejs版本为6.11.x 或者 8.x

2. 编辑器推荐vscode，需要添加 `ESLint` `Prettier` 插件对代码进行检查和格式化，推荐添加 `Path Autocomplete` 来方便模块和资源的引用。

## 项目安装
1. 需要创建一个内部项目的时候，可以通过使用该项目的打包形式，将该项目的代码放置在新项目中。

2. 进入新项目目录，对package.json文件进行修改，主要是改掉其中的 name repository url author内容。

3. 执行 `npm install` 安装项目依赖。

4. 然后再执行 `npm run dll` 创建bundle目录

5. 执行 `npm start` 可以开启开发环境

## 更新公共包

如果你需要更新公共包，打开 `webpack.dll.config.js` 文件

需要先通过 `npm install -S` 对应库

编辑以下部分

```
    entry: {
        bundle: [
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'react-router-dom',
            'redux',
            'redux-thunk',
            'reselect',
            // 其他库
        ],
    },
```

## 本地mock接口

如果需要在本地启用mock接口，可以使用命令 `npm run server` 开启本地接口

json-server的使用方式详见：https://github.com/typicode/json-server

## 项目打包

项目开发完成以后，使用命令 `npm run build` 进行项目打包

打包完成以后，可以使用命令 `npm run buildstart` 对打包结果进行预览（现在其他路由下刷新暂时会有问题）

没有问题的话，可以直接将 `build` 目录压缩后交给服务器端进行部署

## eslint

本项目代码规范遵循夏子文提供的eslint配置，需要你在vscode中添加eslint插件，并打开。

具体项目见 `http://fex.staff.ifeng.com/web-components/eslint`

## prettier

本项目的代码格式化采用的是 `prettier` 实行的。

具体项目见 `https://github.com/prettier/prettier`

在vscode中增加如下设置

```
    "prettier.tabWidth": 4,
    "prettier.singleQuote": true,
    "prettier.trailingComma": "all",
    "prettier.jsxBracketSameLine": true,
    "prettier.printWidth": 120,
```

## git使用

master 分支只用于打发布版本

dev 分支为开发分支，所有人都基于dev分支进行开发

## 文件与目录说明

### `app` 项目代码

用于放置项目代码

`config.js` 放置项目配置，如api配置等

`index.html` 入口文件

`index.js` 入口js文件

`store.js` store文件

`common` 放置项目公用代码的目录，如公用models

`components` 放置组件的目录，

`layout` 放置布局的目录，

`pages` 放置页面的目录

`utils` 放置通用工具函数的目录

### `build` 编译目录

在执行 npm run build 后产生的目录，最后产出的代码就在这里

### `bundle` 公用库

用于放置通过 `webpack.dll.plugin` 编译出来的公共脚本库

### `docs` 开发文档

放置项目的开发文档

### `helper` 帮助目录

放置开发过程中的技术总结和帮助 

### `mockserver` 模拟数据目录

放置模拟数据和server脚本

### `templete` 代码模板

放置生成代码模板的目录

## 技术栈说明

该项目使用 `react` 进行单页的开发

使用 `redux` 进行数据管理

使用 `react-redux` 进行redux和react的连接

使用 `redux-thunk` 进行异步action的处理

使用 `react-router` 进行路由管理

使用 `ant-design` 做为 `ui` 库

使用 `css-module` 进行了css的处理（暂定）

使用 `postcss` 进行css的预编译，其中使用了 `cssnext` 代替了 `scss` 的一些语法


