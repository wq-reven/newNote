import React from 'react';
import { connect } from 'react-redux';
import { Modal, Spin, Table, Form, Button } from 'antd';

import { InputNumber, Input, Select, DatePicker } from 'antd';

import moment from 'moment';

import styles from './addPlus.css';
import { actions, asyncAdd } from './models';
const FormItem = Form.Item;
const { Column } = Table;

const initData = {
    mid: '',
    content: '',
    type: '',
    startTime: '2017-11-24T08:35:32.030Z',
    endTime: '2017-11-24T08:35:32.030Z',
};

class ADD extends React.Component {
    state = {
        list: [{ ...initData }],
    };
    add = news => {
        this.setState({ list: [...this.state.list, ...news] });
    };
    del = delIndex => {
        this.setState({ list: this.state.list.filter((item, index) => index !== delIndex) });
    };
    clear = () => {
        this.setState({ list: [] });
    };
    update = (value, name, updateIndex) => {
        this.setState({
            list: this.state.list.map((item, index) => (updateIndex === index ? { ...item, [name]: value } : item)),
        });
    };
    handleCancel = () => {
        // this.props.form.resetFields();
        this.props.modalHide();
    };
    handleOk = () => {
        this.props.form.validateFields(async err => {
            if (!err) {
                await this.props.asyncAdd(this.state.list);
                this.props.form.resetFields();
                this.clear();
                this.add([{ ...initData }]);
                this.props.modalHide();
            }
        });
    };
    open = () => {
        this.props.modalShow();
    };
    render() {
        console.log(JSON.stringify(this.state.list));
        const { isModalShow, isLoading } = this.props;
        const { getFieldDecorator } = this.props.form;
        const table = (
            <Form layout="inline">
                <Table dataSource={this.state.list} pagination={false} rowClassName={() => styles.add_table}>
                    <Column
                        title="消息ID"
                        key="mid"
                        render={(text, item, index) => {
                            const id = 'mid_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.mid,

                                        rules: [
                                            {
                                                type: 'integer',
                                                message: '消息ID为整数',
                                            },
                                        ],
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'mid', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="消息内容"
                        key="content"
                        render={(text, item, index) => {
                            const id = 'content_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.content,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'content', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="类型"
                        key="type"
                        render={(text, item, index) => {
                            const id = 'type_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.type,

                                        rules: [],
                                    })(
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="请选择"
                                            onChange={value => {
                                                this.update(value, 'type', index);
                                            }}>
                                            <Option value={0}>官方公告</Option>
                                        </Select>,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="开始时间"
                        key="startTime"
                        render={(text, item, index) => {
                            const id = 'startTime_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: moment(item.startTime),

                                        rules: [],
                                    })(
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="请选择"
                                            onChange={value => {
                                                this.update(value, 'startTime', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="结束时间"
                        key="endTime"
                        render={(text, item, index) => {
                            const id = 'endTime_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: moment(item.endTime),

                                        rules: [],
                                    })(
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="请选择"
                                            onChange={value => {
                                                this.update(value, 'endTime', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />
                </Table>
            </Form>
        );
        return (
            <span>
                <Button
                    onClick={() => {
                        this.open();
                    }}>
                    添加多条
                </Button>
                <Modal
                    width={800}
                    title="添加多条数据"
                    visible={isModalShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={isLoading}
                    maskClosable={false}>
                    <Spin spinning={isLoading} tip="保存中...">
                        {table}
                    </Spin>
                    <div style={{ marginTop: 15 }}>
                        <Button
                            onClick={() => {
                                this.add([{ ...initData }]);
                            }}>
                            添加
                        </Button>
                    </div>
                </Modal>
            </span>
        );
    }
}

const mapStateToProps = state => ({
    isModalShow: state.notice.uiStatus.isAddPlusShow,
    isLoading: state.notice.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isAddPlusShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddPlusShow: true })),
    asyncAdd: contents => dispatch(asyncAdd(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ADD));
