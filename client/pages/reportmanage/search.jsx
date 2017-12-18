import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form } from 'antd';

import { InputNumber, Select, DatePicker } from 'antd';

import moment from 'moment';

import { actions, asyncGet } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

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
                        <FormItem {...formItemLayout} label="举报人ID">
                            {getFieldDecorator('informId', {})(
                                <InputNumber placeholder="请填写" style={{ width: '100%' }} />,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="被举报人ID">
                            {getFieldDecorator('informedId', {})(
                                <InputNumber placeholder="请填写" style={{ width: '100%' }} />,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="举报类型">
                            {getFieldDecorator('type', {})(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={1}>视频</Option>

                                    <Option value={2}>用户</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="举报原因">
                            {getFieldDecorator('content', {})(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={'违法违规'}>违法违规</Option>

                                    <Option value={'淫秽色情'}>淫秽色情</Option>

                                    <Option value={'低俗内容'}>低俗内容</Option>

                                    <Option value={'垃圾广告'}>垃圾广告</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="举报时间">
                            {getFieldDecorator('created', {})(
                                <RangePicker
                                    ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                                    showTime
                                    format="YYYY/MM/DD HH:mm"
                                />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12} className={styles.m_tools}>
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
