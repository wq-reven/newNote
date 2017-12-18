import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form } from 'antd';

import { InputNumber, Input } from 'antd';

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
                        <FormItem {...formItemLayout} label="管理员id">
                            {getFieldDecorator('uid', {})(
                                <InputNumber placeholder="请填写" style={{ width: '100%' }} />,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="管理员昵称">
                            {getFieldDecorator('nickname', {})(<Input placeholder="请填写" />)}
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
