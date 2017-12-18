// 此函数主要用于将组件和页面进行连接
// 并在开发环境的时候进行热更新的配置
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'core-js';
moment.locale('zh-cn');

import { AppContainer } from 'react-hot-loader';
import C_Layout from './router';

const render = function (Component) {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById('root')
    );
};

render(C_Layout);

if (module.hot) {
    module.hot.accept('./router', function () {
        render(C_Layout);
    });
}
