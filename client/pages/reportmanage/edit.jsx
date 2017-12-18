import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form } from 'antd';

import { InputNumber, Select, DatePicker } from 'antd';

import moment from 'moment';

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
                        <FormItem {...formItemLayout} label="举报人ID">
                            {getFieldDecorator('informId', {
                                initialValue: item.informer,

                                rules: [
                                    {
                                        type: 'integer',
                                        message: '举报人ID为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="被举报人ID">
                            {getFieldDecorator('informedId', {
                                initialValue: item.wrongdoer,

                                rules: [
                                    {
                                        type: 'integer',
                                        message: '被举报人ID为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="举报类型">
                            {getFieldDecorator('type', {
                                initialValue: item.type,

                                rules: [],
                            })(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={0}>视频</Option>

                                    <Option value={1}>用户</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="举报原因">
                            {getFieldDecorator('content', {
                                initialValue: item.content,

                                rules: [],
                            })(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={0}>违法违规</Option>

                                    <Option value={1}>淫秽色情</Option>

                                    <Option value={2}>低俗内容</Option>

                                    <Option value={3}>垃圾广告</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="举报时间">
                            {getFieldDecorator('created', {
                                initialValue: moment(item.created),

                                rules: [],
                            })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
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
    item: state.reportmanage.list.reduce((a, b) => (b.id === state.reportmanage.currentSelectId ? b : a), {}),
    isModalShow: state.reportmanage.uiStatus.isUpdateShow,
    isLoading: state.reportmanage.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isUpdateShow: false })),
    asyncUpdate: contents => dispatch(asyncUpdate(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit));
