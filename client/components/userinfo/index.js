import React from 'react';
import { connect } from 'react-redux';
import { asyncLogout } from '../../common/models/user';
import { Button } from 'antd';
import {afterLogout} from 'utils';

// const Comp = props =>
//     props.token ? (
//         <div style={{ 'text-align': 'right' }}>
//             <span style={{ 'padding-right': '10px' }}>{props.name}</span>
//             <Button onClick={() => props.asyncLogout()}>退出</Button>
//         </div>
//     ) : (
//         <div style={{ 'text-align': 'right' }}>{props.name},请登录</div>
//     );

class Comp extends React.Component {
    logout = async () => {
        await this.props.asyncLogout();
        afterLogout();
    }
    render() {
        const props = this.props;
        return props.token ? (
            <div style={{ 'text-align': 'right' }}>
                <span style={{ 'padding-right': '10px' }}>{props.name}</span>
            </div>
        ) : (
            <div style={{ 'text-align': 'right' }}>{props.name}</div>
        );
    }
}

const mapStateToProps = state => ({ ...state.user.info });

const mapDispatchToProps = dispatch => ({
    asyncLogout: () => dispatch(asyncLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Comp);
