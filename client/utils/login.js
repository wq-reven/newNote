import store from '../store';
import history from '../history';

let from = '/';

export const checkLogin = () => {
    const token = store.getState().user.info.token;
    console.log(token)
    if (!token) {
        if (window.location.pathname !== '/user/login') {
            from = window.location.pathname;
            history.push('/user/login');
        }
    }
};

export const afterLogin = () => {
    history.push(from);
    from = '/';
};

export const afterLogout = () => {
    if (window.location.pathname !== '/user/login') {
        from = window.location.pathname;
        history.push('/user/login');
    }
};
