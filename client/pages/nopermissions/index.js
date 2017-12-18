import React from 'react';
import { connect } from 'react-redux';
import { asyncLogout } from '../../common/models/user';
import { Button } from 'antd';

const Comp = props => {
    return <div>您的权限不足，请点击<Button onClick={() => props.asyncLogout()}>退出</Button>，然后重新登录</div>;
};

const mapDispatchToProps = dispatch => ({
    asyncLogout: () => dispatch(asyncLogout()),
});

export default connect(null, mapDispatchToProps)(Comp);
