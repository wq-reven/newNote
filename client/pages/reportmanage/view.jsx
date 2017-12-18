import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col } from 'antd';
import { actions } from './models';
import { formatViewData } from './utils';
import styles from './view.css';

class View extends React.Component {
    handleCancel = () => {
        this.props.viewHide();
        this.props.changeSrc();
    };
    render() {
        const { isViewShow } = this.props;
        return (
            <Modal title="播放视频" visible={isViewShow} onCancel={this.handleCancel} footer={null}  width={'50%'} >
                <Row className={styles.playvideo}>
                    <video src={this.props.playVideo} controls="controls" autoPlay></video>
                </Row>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    isViewShow: state.reportmanage.uiStatus.isViewShow,
    playVideo: state.reportmanage.playVideo,
});

const mapDispatchToProps = dispatch => ({
    viewHide: () => dispatch(actions.changeUiStatus({ isViewShow: false })),
    changeSrc: () => dispatch(actions.getVideo('')),
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
