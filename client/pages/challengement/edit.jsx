import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form } from 'antd';

import { InputNumber, Input } from 'antd';

import { actions, asyncUpdate } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;

class Edit extends React.Component {
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.modalHide();
    };
    handleOk = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                await this.props.asyncUpdate(formatFormData(values));
                this.props.form.resetFields();
                this.props.modalHide();
            }
        });
    };
    render() {
        const { isModalShow, isLoading, item } = this.props;
        const { getFieldDecorator } = this.props.form;
        const form = (
            <Form>
                <Row>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="id">
                            {getFieldDecorator('challengeId', {
                                initialValue: item.challengeId,

                                rules: [
                                    {
                                        type: 'integer',
                                        message: 'id为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="挑战名称">
                            {getFieldDecorator('challengeName', {
                                initialValue: item.challengeName,

                                rules: [],
                            })(<Input placeholder="请填写" />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="作品数">
                            {getFieldDecorator('videoNum', {
                                initialValue: item.videoNum,

                                rules: [
                                    {
                                        type: 'integer',
                                        message: '作品数为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="参与人数">
                            {getFieldDecorator('userNum', {
                                initialValue: item.userNum,

                                rules: [
                                    {
                                        type: 'integer',
                                        message: '参与人数为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="添加人">
                            {getFieldDecorator('creator', {
                                initialValue: item.creator,

                                rules: [],
                            })(<Input placeholder="请填写" />)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
        return (
            <Modal
                title="查看详情"
                visible={isModalShow}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={isLoading}
                maskClosable={false}>
                <Spin spinning={isLoading} tip="保存中...">
                    {form}
                </Spin>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    item: state.challengement.list.reduce((a, b) => (b.id === state.challengement.currentSelectId ? b : a), {}),
    isModalShow: state.challengement.uiStatus.isUpdateShow,
    isLoading: state.challengement.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isUpdateShow: false })),
    asyncUpdate: contents => dispatch(asyncUpdate(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit));
