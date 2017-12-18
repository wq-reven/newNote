/**
 * 创建一个reducer，用对象的key的方式替代了switch方案，简化了代码。
 * @param {*} initialState 初始数据
 * @param {Object} handlers 数据处理函数对象
 * @return {Function} 返回一个reducer
 */
export const createReducer = (initialState, handlers) => {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    };
};

/**
 * 简化action创建的函数。
 * @param {String} type 动作名称
 * @param {*} payload 处理方式，主要采用function方式进行处理，
 * 如果payload不是function的话，会被直接使用（没想到应用场景）。
 * @return {Function} 
 */
export const createActionCreator = (type, payload) => {
    return (...args) => ({
        payload: (typeof payload === 'function') ? payload(...args) : payload,
        type: type,
    });
};

/**
 * 为对象的属性名增加前置命名空间，防止和其他模块命名冲突。
 * @param {Object} handlers 一个handlers对象集合
 * @param {Function} namespace 对命名空间的处理
 * @return {Object} 一个属性名改变过后的新对象
 */
const prependNamespaces = (handlers, namespace) => {
    let result = {};
    Object.keys(handlers).forEach(item => (result[namespace(item)] = handlers[item]));
    return result;
};

/**
 * 根据models的定义，生成一个reduers集合
 * @param {Object} models 传入的models
 * @param {Function} namespace 对命名空间的处理
 * @
 */
export const createReducers = (models, namespace) => {
    let result = {};
    Object.keys(models).forEach(key => {
        result[key] = createReducer(models[key].data, prependNamespaces(models[key].handlers, namespace));
    });
    return result;
};

const actionCallback = data => data;

/**
 * 根据models的定义，生成一个action集合
 * @param {Object} models 传入的models
 * @param {Function} namespace 对命名空间的处理
 */
export const createActions = (models, namespace) => {
    let result = {};
    Object.keys(models).forEach(key => {
        let handlers = models[key].handlers;
        let actions = models[key].actions || {};
        Object.keys(handlers).forEach(actionName => {
            if (actions[actionName]) {
                result[actionName] = createActionCreator(namespace(actionName), actions[actionName]);
            } else {
                result[actionName] = createActionCreator(namespace(actionName), actionCallback);
            }
        });
    });
    return result;
};
