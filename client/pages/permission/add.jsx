import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form, Button } from 'antd';

import { InputNumber, Input, Select } from 'antd';

import { actions, asyncAdd } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;

class ADD extends React.Component {
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.modalHide();
    };
    handleOk = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                await this.props.asyncAdd([formatFormData(values)]);
                this.props.form.resetFields();
                this.props.modalHide();
            }
        });
    };
    render() {
        const { isModalShow, isLoading, modalShow, userInfo } = this.props;
        const { getFieldDecorator } = this.props.form;
        const form = (
            <Form>
                <Row>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="管理员昵称">
                            {getFieldDecorator('nickname', {
                                rules: [
                                    {
                                        required: true,
                                        message: '管理员昵称不能为空',
                                    },
                                ],
                            })(<Input placeholder="请填写" />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="用户权限">
                            {getFieldDecorator('roles', {
                                rules: [
                                    {
                                        required: true,
                                        message: '权限不能为空',
                                    },
                                ],
                            })(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={1}>普通管理员</Option>
                                    <Option value={2}>超级管理员</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="创建人">
                            {getFieldDecorator('userName', {
                                initialValue: userInfo.user_name,
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
        return (
            <span>
                <Button onClick={modalShow}>添加管理员</Button>
                <Modal
                    title="添加管理员"
                    visible={isModalShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={isLoading}
                    maskClosable={false}>
                    <Spin spinning={isLoading} tip="保存中...">
                        {form}
                    </Spin>
                </Modal>
            </span>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.user.info,
    isModalShow: state.permission.uiStatus.isAddShow,
    isLoading: state.permission.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isAddShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    asyncAdd: contents => dispatch(asyncAdd(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ADD));
