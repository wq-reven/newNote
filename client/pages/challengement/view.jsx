import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col } from 'antd';
import { actions } from './models';
import { formatViewData } from './utils';

class View extends React.Component {
    handleCancel = () => {
        this.props.viewHide();
    };
    render() {
        const { isViewShow, item } = this.props;
        const viewItem = (() => {
            return Object.keys(item).map(key => (
                <Row gutter={20}>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        {key}
                    </Col>
                    <Col span={18}>{formatViewData(key, item[key])}</Col>
                </Row>
            ));
        })();
        return (
            <Modal title="查看详情" visible={isViewShow} onCancel={this.handleCancel} footer={null}>
                {viewItem}
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    item: state.challengement.list.reduce((a, b) => (b.id === state.challengement.currentSelectId ? b : a), {}),
    isViewShow: state.challengement.uiStatus.isViewShow,
});

const mapDispatchToProps = dispatch => ({
    viewHide: () => dispatch(actions.changeUiStatus({ isViewShow: false })),
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
