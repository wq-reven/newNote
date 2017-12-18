import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form } from 'antd';

import { InputNumber, Input, Select, DatePicker } from 'antd';

import moment from 'moment';

import { actions, asyncGet } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;

class Search extends React.Component {
    resetForm = () => {
        this.props.form.resetFields();
        this.props.changeSearchValues({});
    };
    handleSearch = e => {
        e.preventDefault();
        const values = formatFormData(this.props.form.getFieldsValue());
        this.props.changeSearchValues(values);
        this.props.resetPagination();
        this.props.asyncGet();
    };
    render() {
        console.log('search render');
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch}>
                <Row className={styles.c_searchBox}>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="消息ID">
                            {getFieldDecorator('mid', {})(
                                <InputNumber placeholder="请填写" style={{ width: '100%' }} />,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="消息内容">
                            {getFieldDecorator('content', {})(<Input placeholder="请填写" />)}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="类型">
                            {getFieldDecorator('type', {})(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={0}>官方公告</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="开始时间">
                            {getFieldDecorator('startTime', {})(
                                <DatePicker style={{ width: '100%' }} placeholder="请选择" />,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="结束时间">
                            {getFieldDecorator('endTime', {})(
                                <DatePicker style={{ width: '100%' }} placeholder="请选择" />,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={24} className={styles.m_tools}>
                        <Button onClick={this.resetForm}>重置</Button>
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    changeSearchValues: params => dispatch(actions.changeSearchValues(params)),
    resetPagination: () => dispatch(actions.changePagination({ current: 1 })),
});

export default connect(null, mapDispatchToProps)(Form.create()(Search));
