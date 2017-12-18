import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form } from 'antd';
import moment from 'moment';
import { InputNumber, Input, Select, DatePicker } from 'antd';

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
        const { isModalShow, isLoading, currentSelectId, userInfo } = this.props;
        const { getFieldDecorator } = this.props.form;
        const form = (
            <Form>
                <Row>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="公告标题">
                            {getFieldDecorator('title', {
                                initialValue: currentSelectId.title,
                                rules: [],
                            })(<InputNumber style={{ width: '100%' }} disabled/>)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="公告内容">
                            {getFieldDecorator('content', {
                                initialValue: currentSelectId.content,

                                rules: [],
                            })(<Input placeholder="请填写" disabled/>)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="类型">
                            {getFieldDecorator('type', {
                                initialValue: currentSelectId.type,
                                rules: [],
                            })(
                                <Select style={{ width: '100%' }} placeholder="请选择" disabled>
                                    <Option value={1}>新用户推送</Option>
                                    <Option value={2}>官方公告</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="开始时间">
                            {getFieldDecorator('startTime', {
                                initialValue: moment(currentSelectId.startTime),
                                rules: [
                                    {
                                        required: true,
                                        message: '必须选择开始时间',
                                    }
                                ],
                            })(<DatePicker style={{ width: '100%' }} placeholder="请选择" format="YYYY-MM-DD HH:mm" showTime/>)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="结束时间">
                            {getFieldDecorator('endTime', {
                                initialValue: moment(currentSelectId.endTime),
                                rules: [
                                    {
                                        required: true,
                                        message: '必须选择结束时间',
                                    }
                                ],
                            })(<DatePicker style={{ width: '100%' }} placeholder="请选择" format="YYYY-MM-DD HH:mm" showTime/>)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="公告id">
                            {getFieldDecorator('mid', {
                                initialValue: currentSelectId.mid,
                                rules: [],
                            })(<InputNumber style={{ width: '100%' }} disabled/>)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="发布者头像">
                            {getFieldDecorator('avatar', {
                                initialValue: currentSelectId.avatar,
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="消息链接地址">
                            {getFieldDecorator('url', {
                                initialValue: currentSelectId.url,
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="创建者">
                            {getFieldDecorator('creator', {
                                initialValue: currentSelectId.creator,
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="发布者">
                            {getFieldDecorator('publisher', {
                                initialValue: currentSelectId.publisher,
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="创建时间">
                            {getFieldDecorator('createTime', {
                                initialValue: currentSelectId.createTime,
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="消息配图">
                            {getFieldDecorator('img', {
                                initialValue: currentSelectId.img,
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="更改时间">
                            {getFieldDecorator('updateTime', {
                                initialValue: Date.parse(new Date()),
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="更改人">
                            {getFieldDecorator('updater', {
                                initialValue: userInfo.user_name,
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
        return (
            <Modal
                title="修改公告"
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
    item: state.notice.list.reduce((a, b) => (b.id === state.notice.currentSelectId ? b : a), {}),
    isModalShow: state.notice.uiStatus.isUpdateShow,
    isLoading: state.notice.uiStatus.isLoading,
    currentSelectId: state.notice.currentSelectId,
    userInfo: state.user.info,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isUpdateShow: false })),
    asyncUpdate: contents => dispatch(asyncUpdate(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit));
