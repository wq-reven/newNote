import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form } from 'antd';
import { InputNumber, DatePicker, Select} from 'antd';
import moment from 'moment';
import { actions, asyncSearchUser } from './models';
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
        this.props.asyncSearchUser();
    };
    render() {
        console.log('search render');
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch}>
                <Row className={styles.c_searchBox}>
                    <Col span={5}>
                        <FormItem {...formItemLayout} label="ID">
                            {getFieldDecorator('uid', {})(
                                <InputNumber placeholder="请填写" style={{ width: '60%' }} />,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={9}>
                        <FormItem {...formItemLayout} label="提交时间">
                            {getFieldDecorator('modifyTime', {})(
                                <RangePicker
                                    ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="状态">
                            {getFieldDecorator('checkStatus', {
                                initialValue: 3,
                            })(
                                <Select
                                    style={{ width: '60%' }}
                                >
                                    <Option value={1}>通过</Option>
                                    <Option value={2}>驳回</Option>
                                    <Option value={3}>待审核</Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4} className={styles.m_tools}>
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
    asyncSearchUser: () => dispatch(asyncSearchUser()),
    changeSearchValues: params => dispatch(actions.changeSearchValues(params)),
    resetPagination: () => dispatch(actions.changePagination({ current: 1 })),
});

export default connect(null, mapDispatchToProps)(Form.create()(Search));
