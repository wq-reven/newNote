import React from 'react';
import { connect } from 'react-redux';
import { Modal, Spin, Table, Form, Button } from 'antd';

import { InputNumber, Input, DatePicker, Select } from 'antd';

import moment from 'moment';

import styles from './addPlus.css';
import { actions, asyncAdd } from './models';
const FormItem = Form.Item;
const { Column } = Table;

const initData = {
    vid: '',
    title: '',
    musicUrl: '',
    challengeName: '',
    uid: '',
    nickname: '',
    publishTime: '2017-11-24T06:05:22.580Z',
    source: '',
    cpName: '',
    insertTime: '2017-11-24T06:05:22.580Z',
    playCount: '',
    likeCount: '',
    status: '',
    VideoPlayUrl: '',
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
                        title="视频ID"
                        key="vid"
                        render={(text, item, index) => {
                            const id = 'vid_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.vid,

                                        rules: [
                                            {
                                                type: 'integer',
                                                message: '视频ID为整数',
                                            },
                                        ],
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'vid', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="视频标题"
                        key="title"
                        render={(text, item, index) => {
                            const id = 'title_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.title,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'title', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="背景音乐"
                        key="musicUrl"
                        render={(text, item, index) => {
                            const id = 'musicUrl_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.musicUrl,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'musicUrl', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="挑战"
                        key="challengeName"
                        render={(text, item, index) => {
                            const id = 'challengeName_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.challengeName,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'challengeName', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="发布人ID"
                        key="uid"
                        render={(text, item, index) => {
                            const id = 'uid_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.uid,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'uid', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="发布人昵称"
                        key="nickname"
                        render={(text, item, index) => {
                            const id = 'nickname_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.nickname,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'nickname', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="title of publishTime"
                        key="publishTime"
                        render={(text, item, index) => {
                            const id = 'publishTime_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: moment(item.publishTime),

                                        rules: [],
                                    })(
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="请选择"
                                            onChange={value => {
                                                this.update(value, 'publishTime', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="类别"
                        key="source"
                        render={(text, item, index) => {
                            const id = 'source_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.source,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'source', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="视频来源"
                        key="cpName"
                        render={(text, item, index) => {
                            const id = 'cpName_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.cpName,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'cpName', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="添加时间"
                        key="insertTime"
                        render={(text, item, index) => {
                            const id = 'insertTime_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: moment(item.insertTime),

                                        rules: [],
                                    })(
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="请选择"
                                            onChange={value => {
                                                this.update(value, 'insertTime', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="播放次数"
                        key="playCount"
                        render={(text, item, index) => {
                            const id = 'playCount_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.playCount,

                                        rules: [
                                            {
                                                type: 'integer',
                                                message: '播放次数为整数',
                                            },
                                        ],
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'playCount', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="获赞数"
                        key="likeCount"
                        render={(text, item, index) => {
                            const id = 'likeCount_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.likeCount,

                                        rules: [
                                            {
                                                type: 'integer',
                                                message: '获赞数为整数',
                                            },
                                        ],
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'likeCount', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="状态"
                        key="status"
                        render={(text, item, index) => {
                            const id = 'status_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.status,

                                        rules: [],
                                    })(
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="请选择"
                                            onChange={value => {
                                                this.update(value, 'status', index);
                                            }}>
                                            <Option value={0}>下线</Option>

                                            <Option value={1}>上线</Option>

                                            <Option value={2}>未审核</Option>

                                            <Option value={3}>处理中</Option>

                                            <Option value={4}>出错</Option>

                                            <Option value={5}>审核未通过</Option>

                                            <Option value={6}>已删除</Option>
                                        </Select>,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="视频播放地址"
                        key="VideoPlayUrl"
                        render={(text, item, index) => {
                            const id = 'VideoPlayUrl_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.VideoPlayUrl,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'VideoPlayUrl', index);
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
                {/* <Button
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
                </Modal> */}
            </span>
        );
    }
}

const mapStateToProps = state => ({
    isModalShow: state.videomanage.uiStatus.isAddPlusShow,
    isLoading: state.videomanage.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isAddPlusShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddPlusShow: true })),
    asyncAdd: contents => dispatch(asyncAdd(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ADD));
