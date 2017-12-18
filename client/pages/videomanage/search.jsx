import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form, Select } from 'antd';
import { Input, DatePicker } from 'antd';
import moment from 'moment';
import { actions, asyncSearchVideo, asyncreturnVideoCreator } from './models';
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
        this.props.asyncSearchVideo();
    };
    onChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    };
    onOk = value => {
        console.log('onOk: ', value);
    }
    getVideoCreator = () => {
        this.props.videoCreator();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const creators = this.props.videoCreators;
        const children = [<Option value={''}>不限</Option>];
        for ( let i = 0; i < creators.length; i++) {
            children.push(<Option value={creators[i]}>{creators[i]}</Option>)
        }
        return (
            <Form onSubmit={this.handleSearch}>
                <Row className={styles.c_searchBox}>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="视频ID">
                            {getFieldDecorator('uniqueVideoId', {})(
                                <Input placeholder="请填写" style={{ width: '100%' }} />,
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="视频标题">
                            {getFieldDecorator('title', {})(<Input placeholder="请填写" />)}
                        </FormItem>
                    </Col>


                    <Col span={6}>
                        <FormItem {...formItemLayout} label="挑战">
                            {getFieldDecorator('challengeName', {
                                initialValue: this.props.searchValue.challengeName,
                            })(<Input placeholder="无挑战，请输0" />)}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="发布人ID">
                            {getFieldDecorator('uid', {
                                initialValue: this.props.searchValue.uid,
                            })(<Input placeholder="请填写"/>)}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="类别">
                            {getFieldDecorator('source', {})(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={''}>不限</Option>
                                    <Option value={'抓站'}>抓站</Option>
                                    <Option value={'用户上传'}>用户上传</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="视频来源">
                            {getFieldDecorator('creator', {})(
                                <Select

                                    style={{ width: '100%' }}
                                    placeholder="请选择"
                                    name="creator"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onFocus={ () => {
                                        this.getVideoCreator();
                                    }}>
                                    {children}

                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="添加时间">
                            {getFieldDecorator('insertTime', {})(
                                <RangePicker
                                    ranges={{ 今天: [moment(), moment()], '本月': [moment(), moment().endOf('month')] }}
                                    showTime
                                    format="YYYY/MM/DD HH:mm"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span = {6}>
                        <FormItem {...formItemLayout} label="视频状态">
                            {getFieldDecorator('status', {})(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={''}>不限</Option>
                                    <Option value={'2'}>未审核</Option>
                                    <Option value={'1'}>上线</Option>
                                    <Option value={'0'}>下线</Option>
                                    <Option value={'6'}>已删除</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={5} className={styles.m_tools} >
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

const mapStateToProps = state => ({
    searchValue: state.videomanage.searchValues,
    videoCreators: state.videomanage.videoCreator,
});
const mapDispatchToProps = dispatch => ({
    asyncSearchVideo: () => dispatch(asyncSearchVideo()),
    changeSearchValues: params => dispatch(actions.changeSearchValues(params)),
    resetPagination: () => dispatch(actions.changePagination({ current: 1 })),
    videoCreator: () => dispatch(asyncreturnVideoCreator()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Search));
