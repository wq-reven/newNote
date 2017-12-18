# models.js 文件说明

## 文件描述

该文件是将 `actions.js`, `reducer.js` 的写法进行了抽象，通过一个统一的 `models` 配置来生成 `actions` 和 `reducers`，减少了大量的重复代码

## models的文件结构

models 对象结构如下：

```
const models = {
    list: {
        data: [], // 初始数据
        handlers: { // 对于数据处理的方法
            get(state, action) {
                return action.payload;
            },
            add(state, action) {
                return [...action.payload, ...state];
            },
            del(state, action) {
                return state.filter(item => item.id !== action.payload);
            },
            update(state, action) {
                return state.map(item => (item.id === action.payload.id ? action.payload : item));
            },
        },
        actions: {
            ... // 触发的action，默认的action不用在这里声明，通过 createActions 方法根据 handlers 中的 key 进行创建
                // 只有当对传入的参数需要进行特殊处理的时候，可以在这里声明与 handlers 中 key 相同的处理方法。
        }
    },
    ...
}

```

## models中包含的内容

models中声明的对象属性，是跟 store 中的属性一一对应的，每一个属性都对应一个数据，该数据可以是一个对象、数组或者简单类型。

mosles上面的所有属性最终会使用 combineReducers 方法 combine 成一个 reducer， 最终这个 reducer 会在 /app/store.js 中被引入，然后跟其他 pages 中 models 导出的 reducer 合并成一个，然后用于 stroe 的初始化，整体 store 结构示意为如下：

```
store : {
    books: {
        list: [{
            name:
            id:
            ...
        }],
        pagination: {
            current:
            total:
            pageSize:
        },
        searchValues: {
            ...
        },
        currentSelectId: '',
        uiStatus: {
            isLoading:
            isViewShow:
            isAddShow:
            isAddPlusShow:
            isUpdateShow:
        }
    },
    user: {
        info: {
            id:
            user_name:
            name:
            phone:
            email:
            token:
            roles: [...]
        }
    },
    login: {
        uiStatus: {
            isLoading:
        }
    }
}
```

其中数据包含两部分内容：

1. ui 数据，ui 数据现在都放在 uiStatus 中
2. 业务数据，除去 uiStatus，其他都为业务数据

## models 中数据的拆分处理原则

1. 需要保持数据的不变性，因为对于数据的管理，还是使用的 redux，保持数据不变性是 redux 的一个基本原则。
2. 每个属性节点的数据结构不要太复杂，太复杂的数据结构不利于对数据进行处理。
3. 数据不要冗余，冗余的数据在保持一致性的时候会比较麻烦。