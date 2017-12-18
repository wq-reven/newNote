# templete 模板生成工具说明

## 描述

该工具是将开发中经常遇到的一些模块，通过对应的 config 和 schema 的配置，生成一组与业务相关的模块，然后开发在根据业务情况，在生成的代码的基础上，对代码进行进一步的开发。

## 模板提取原则

1. 业务模式通用，业务的数据结构也一致，业务的数据项根据业务有变化（也可以没有变化）。

2. 模板可以在一个项目的多个业务多次创建。

3. 模板可以对多个项目的某个都存在的业务进行一次创建（如果是项目必备的，可以直接放在项目的初始代码里）

## 模板的使用

现在模板只做了一个 curd（增删改查）

### curd 的构成

curd 模板是对比较简单的增删改查业务的整理，内容包括：

1. 入口 index.js
2. 列表模块 list.jsx
3. 搜索模块 search.jsx
4. 查看模块 view.jsx
5. 添加单条 add.jsx
6. 添加多条 addPlus.jsx
7. 数据处理 models.js
8. 工具函数 utils.js

### curd 的使用

1. 在 `pages` 中创建对应的业务目录
2. 在目录中加入 config.json (定义了api和路径以及连接store时的属性名等信息) 和 schema.json （定义了业务的数据结构）
3. 在项目的根目录下执行命令 `npm run create -- -p app/pages/业务目录`，将会在业务目录下面生成一系列的文件
4. 在 `app/layout/routerConfig.js` 中增加相应的模块和路由
5. 在 `app/store.js` 中增加相应的 reducer 并将其 combin 到 store使用的 reducer 上（属性名要跟config.json中定义的一致）
6. 对生成的代码进行调整，包括删除一些不需要的组件，调整组件的展示顺序，调整参数处理，调整数据的处理逻辑，调整交互等。

### config.json 的结构
```
{
    "stateKey": "books", // 连接到 store 时的属性名
    "path": "app/pages/books", // 业务对应的目录
    "apis": { // 增删改查对应的api
        "get": "bookslist",
        "del": "booksdel",
        "update": "booksupdate",
        "add": "booksadd"
    }
}
```

### schema.json 的结构

schema.json 是通过 jsonscema 标准生成的对 json 进行校验的数据格式，其中包括了数据的结构、类型和验证规则。

在此基础上，我们增加了$开头的字段，里面增加了对于ui和模拟数据的描述，方便通过schema生成UI和数据。
对于schema的数据，分为基础信息、元数据、校验规则、界面配置、模拟数据配置等几部分。

可以使用我们开发的 `schemaEditor` http://test0.mock.dev.ifeng.com:30080/schema
需要设置host 10.90.34.37 test0.mock.dev.ifeng.com

`jsonschema` 标准网站在 http://json-schema.org/

```
{
    "id": "$root",
    "type": "object",
    "properties": {
        "code": {
            "id": "$root/properties/code",
            "type": "integer",
            "title": "Code",
            "description": "服务端返回状态码",
            "default": 0,
            "$uiEnum": [
                {
                    "label": "正常",
                    "value": 0
                },
                {
                    "label": "失败",
                    "value": -1
                },
                {
                    "label": "没有权限",
                    "value": 101
                }
            ],
            "enum": [
                0,
                -1,
                101
            ],
            "$require": true
        },
        "msg": {
            "id": "$root/properties/msg",
            "type": "string",
            "description": "服务器端对返回的描述，错误的时候会描述具体错误原因",
            "title": "信息",
            "default": "",
            "$require": true
        },
        "data": {
            "id": "$root/properties/data",
            "type": "object",
            "properties": {
                "list": {
                    "id": "$root/properties/data/properties/list",
                    "type": "array",
                    "items": {
                        "id": "$root/properties/data/properties/list/items",
                        "type": "object",
                        "properties": {
                            "id": {
                                "id": "$root/properties/data/properties/list/items/properties/id",
                                "type": "integer",
                                "title": "ID",
                                "description": "用户唯一标识",
                                "default": 123,
                                "$require": true,
                                "$uiIsSort": true
                            },
                            "name": {
                                "id": "$root/properties/data/properties/list/items/properties/name",
                                "type": "string",
                                "description": "用户姓名",
                                "title": "姓名",
                                "default": "apple",
                                "$require": true,
                                "maxLength": 20,
                                "minLength": 4,
                                "$uiControl": "Input",
                                "$mockFormatter": "username",
                                "$uiIsSort": true
                            },
                            "age": {
                                "id": "$root/properties/data/properties/list/items/properties/age",
                                "type": "integer",
                                "default": 20,
                                "title": "年龄",
                                "description": "用户年龄",
                                "$require": true,
                                "maximum": 120,
                                "minimum": 10,
                                "exclusiveMinimum": true,
                                "exclusiveMaximum": true,
                                "$uiControl": "InputNumber",
                                "$mockFormatter": "",
                                "$uiIsSort": false
                            },
                            "sex": {
                                "id": "$root/properties/data/properties/list/items/properties/sex",
                                "type": "integer",
                                "title": "性别",
                                "description": "用户性别",
                                "default": 0,
                                "$uiEnum": [
                                    {
                                        "label": "男",
                                        "value": 0
                                    },
                                    {
                                        "label": "女",
                                        "value": 1
                                    },
                                    {
                                        "label": "不告诉你",
                                        "value": 2
                                    }
                                ],
                                "enum": [
                                    0,
                                    1,
                                    2
                                ],
                                "$require": true,
                                "$uiControl": "Select",
                                "$mockFormatter": "",
                                "$uiIsSort": true
                            },
                            "birthday": {
                                "id": "$root/properties/data/properties/list/items/properties/birthday",
                                "type": "string",
                                "description": "用户的出生日期",
                                "title": "出生日期",
                                "default": "2011-11-11",
                                "$require": true,
                                "$mockFormatter": "date",
                                "$uiControl": "DatePicker",
                                "$uiIsSort": true
                            },
                            "fun": {
                                "id": "$root/properties/data/properties/list/items/properties/fun",
                                "type": "array",
                                "items": {
                                    "id": "$root/properties/data/properties/list/items/properties/fun/items",
                                    "type": "integer",
                                    "title": "兴趣爱好",
                                    "description": "desc of items",
                                    "default": 1,
                                    "$uiEnum": [
                                        {
                                            "label": "爬山",
                                            "value": 1
                                        },
                                        {
                                            "label": "读书",
                                            "value": 2
                                        },
                                        {
                                            "label": "动漫",
                                            "value": 3
                                        }
                                    ],
                                    "enum": [
                                        1,
                                        2,
                                        3
                                    ],
                                    "$require": true,
                                    "$uiControl": "Checkbox",
                                    "$uiIsSort": false
                                }
                            }
                        },
                        "required": [
                            "id",
                            "name",
                            "age",
                            "sex",
                            "birthday"
                        ]
                    }
                },
                "pagination": {
                    "id": "$root/properties/data/properties/pagination",
                    "type": "object",
                    "properties": {
                        "current": {
                            "id": "$root/properties/data/properties/pagination/properties/current",
                            "type": "integer",
                            "title": "当前页数",
                            "description": "当前访问的页数",
                            "default": 1
                        },
                        "total": {
                            "id": "$root/properties/data/properties/pagination/properties/total",
                            "type": "integer",
                            "title": "总条数",
                            "description": "数据的总数",
                            "default": 100
                        },
                        "pageSize": {
                            "id": "$root/properties/data/properties/pagination/properties/pageSize",
                            "type": "integer",
                            "title": "每页显示条数",
                            "description": "每页显示条数",
                            "default": 20
                        }
                    }
                }
            }
        }
    },
    "$schema": "http://json-schema.org/draft-06/schema#",
    "definitions": {},
    "required": [
        "code",
        "msg"
    ]
}
```
