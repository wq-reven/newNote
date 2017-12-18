import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form, Button } from 'antd';

import { Input, Select, DatePicker } from 'antd';
const { TextArea } = Input;

import { actions, asyncAdd } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;

class ADD extends React.Component {
    state = {
        isdisabled: false,
    };
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.modalHide();
    };
    handleOk = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                await this.props.asyncAdd(formatFormData(values));
                this.props.form.resetFields();
                this.props.modalHide();
            }
        });
    };
    handleTypeChange = value => {
        if (value === 1) {
            this.setState({
                isdisabled: false,
            });
        }
        if (value === 2) {
            this.setState({
                isdisabled: true,
            });
        }
    }
    render() {
        const { isModalShow, isLoading, modalShow, userInfo } = this.props;
        const { getFieldDecorator } = this.props.form;
        const form = (
            <Form>
                <Row>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="公告标题">
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: '公告标题不能为空',
                                    },
                                ],
                            })(<Input placeholder="请填写" />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="公告内容">
                            {getFieldDecorator('content', {
                                rules: [
                                    {
                                        required: true,
                                        message: '公告标题不能为空',
                                    },
                                ],
                            })(<TextArea placeholder="请填写" />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="公告配图">
                            {getFieldDecorator('img', {
                                rules: [
                                    {
                                        required: false,
                                    },
                                ],
                            })(
                                <Input placeholder="请填写配图URL"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="类型">
                            {getFieldDecorator('type', {
                                rules: [
                                    {
                                        required: true,
                                        message: '类型不能为空',
                                    },
                                ],
                            })(
                                <Select style={{ width: '100%' }} placeholder="请选择" onChange={this.handleTypeChange}>
                                    <Option value={1}>新用户推送</Option>
                                    <Option value={2}>官方公告</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="开始时间">
                            {getFieldDecorator('startTime', {
                                rules: [],
                            })(
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="请选择"
                                    disabled={this.state.isdisabled}
                                    format="YYYY-MM-DD HH:mm"
                                    showTime
                                />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="结束时间">
                            {getFieldDecorator('endTime', {
                                rules: [],
                            })(
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="请选择"
                                    disabled={this.state.isdisabled}
                                    format="YYYY-MM-DD HH:mm"
                                    showTime
                                />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="创建者">
                            {getFieldDecorator('creator', {
                                initialValue: userInfo.user_name,
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="发布者">
                            {getFieldDecorator('publisher', {
                                initialValue: '快闪小助手',
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="发布者头像">
                            {getFieldDecorator('avatar', {
                                initialValue: 'http://p1.ifengimg.com/a/2017/1205/3c5f8e41be1ec82size5_w192_h192.png',
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="消息链接地址">
                            {getFieldDecorator('url', {
                                initialValue: 'http://',
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>

                    <Col span={24} style={{display: 'none'}}>
                        <FormItem {...formItemLayout} label="创建时间时间戳">
                            {getFieldDecorator('createTime', {
                                initialValue: Date.parse(new Date()),
                                rules: [],
                            })(<Input disabled />)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
        return (
            <span>
                <Button onClick={modalShow}>添加公告</Button>
                <Modal
                    title="添加公告"
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
    isModalShow: state.notice.uiStatus.isAddShow,
    isLoading: state.notice.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isAddShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    asyncAdd: contents => dispatch(asyncAdd(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ADD));
