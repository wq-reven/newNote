import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form } from 'antd';
import { InputNumber, Input } from 'antd';

import { actions, asyncSearchUser } from './models';
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
        console.log(values);
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
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="ID">
                            {getFieldDecorator('uid', {})(
                                <InputNumber placeholder="请填写" style={{ width: '100%' }} />,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="昵称">
                            {getFieldDecorator('nickname', {})(
                                <Input placeholder="请填写" style={{ width: '100%' }} />,
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
    asyncSearchUser: () => dispatch(asyncSearchUser()),
    changeSearchValues: params => dispatch(actions.changeSearchValues(params)),
    resetPagination: () => dispatch(actions.changePagination({ current: 1 })),
});

export default connect(null, mapDispatchToProps)(Form.create()(Search));
