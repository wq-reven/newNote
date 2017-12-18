import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Button, Popconfirm, Select } from 'antd';
import styles from './list.css';
const { Column } = Table;
import { actions, asyncGet, asyncChangeCstatus, asyncBatchChangeCstatus } from './models';
import { formatViewData } from './utils';
import { Link } from 'react-router-dom';

class List extends React.Component {
    state = {
        selectedRows: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };
    reject = (uid, modifyTime, userKey) => {
        const checkStatus = 2;
        this.props.changeCstatus(uid, checkStatus, modifyTime, userKey);
    };
    pass = (uid, modifyTime, userKey) => {
        const checkStatus = 1;
        this.props.changeCstatus(uid, checkStatus, modifyTime, userKey);
    };
    batchPass = selectedRows => {
        const checkStatus = 1;
        this.props.batchChangeCstatus(checkStatus, selectedRows);
    }
    batchReject = selectedRows => {
        const checkStatus = 2;
        this.props.batchChangeCstatus(checkStatus, selectedRows);
    }
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        this.setState({
            selectedRowKeys: [],
            loading: false,
        });
    };
    componentDidMount() {
        this.props.asyncGet();
    }
    changeHandle = (pagination, filters, sorter) => {
        this.props.changePagination(pagination);
        this.props.changeSort({ key: sorter.field, order: sorter.order });
        this.props.asyncGet();
    };
    renderAction = (text, record) => {
        if (record.checkStatus == 3) {
            return (
                <span>
                    <Popconfirm
                        title="确定执行？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                            this.pass(record.uid, record.modifyTime, record.userKey);
                        }}>
                        <Button type="primary">通过</Button>
                    </Popconfirm>
                    <span className="ant-divider" />
                    <Popconfirm
                        title="确定执行？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                            this.reject(record.uid, record.modifyTime, record.userKey);
                        }}>
                        <Button type="danger">驳回</Button>
                    </Popconfirm>
                </span>
            );
        } else {
            return <span />;
        }
    };
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };
    onSelect = (record, selected, selectedRows) => {
        this.setState({ selectedRows });
    }
    onSelectAll = (selected, selectedRows, changeRows) => {
        this.setState({ selectedRows });
    }

    render() {
        const { isLoading, list, pagination } = this.props;
        const { loading, selectedRowKeys, selectedRows, record } = this.state;
        const rowSelection = {
            onSelectAll: this.onSelectAll,
            onSelect: this.onSelect,
            selectedRows,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div className={styles.c_list}>
                <div style={{ marginBottom: 16 }}>
                    <Popconfirm title="确定执行？" okText="确定" cancelText="取消" onConfirm={() => {
                        this.batchPass(rowSelection.selectedRows);
                    }}>
                        <Button type="primary" disabled={!hasSelected}>
                            批量通过
                        </Button>
                    </Popconfirm>
                    <span style={{ marginLeft: 18 }} />
                    <Popconfirm title="确定执行？" okText="确定" cancelText="取消" onConfirm={() => {
                        this.batchReject(rowSelection.selectedRows);
                    }}>
                        <Button type="danger" disabled={!hasSelected}>
                            批量驳回
                        </Button>
                    </Popconfirm>
                    <span style={{ marginLeft: 18 }} />
                    <Button onClick={this.start} disabled={!hasSelected} loading={loading}>
                        重选
                    </Button>
                    <span style={{ marginLeft: 8 }}>{hasSelected ? `选择 ${selectedRowKeys.length} 项` : ''}</span>
                </div>
                <Spin spinning={isLoading} tip="加载中...">
                    <Table
                        rowSelection={rowSelection}
                        dataSource={list}
                        pagination={{
                            ...pagination,
                        }}
                        rowKey="uid"
                        row
                        bordered
                        size="1"
                        overflow="visible"
                        onChange={this.changeHandle}>
                        <Column
                            title="ID"
                            dataIndex="uid"
                            key="uid"
                            sorter={false}
                            render={text => {
                                return formatViewData('uid', text);
                            }}
                        />

                        <Column
                            title="昵称"
                            dataIndex="nickname"
                            key="nickName"
                            sorter={false}
                            render={text => {
                                return formatViewData('nickName', text);
                            }}
                        />
                        <Column
                            title="签名"
                            dataIndex="signature"
                            key="signature"
                            sorter={false}
                            render={text => {
                                return formatViewData('signature', text);
                            }}
                        />
                        <Column
                            title="头像"
                            dataIndex="avatarThumb"
                            key="avatarThumb"
                            sorter={false}
                            className={styles.avatar_column}
                            render={text => {
                                return (
                                    <div className={styles.avatar_div}>
                                        <img src={formatViewData('avatarThumb', text)} className={styles.user_avatar} />
                                    </div>
                                );
                            }}
                        />

                        <Column
                            title="提交时间"
                            dataIndex="modifyTime"
                            key="modifyTime"
                            sorter={false}
                            render={text => {
                                return formatViewData('modifyTime', text);
                            }}
                        />

                        <Column
                            title="状态"
                            dataIndex="checkStatus"
                            key="checkStatus"
                            sorter={false}
                            render={text => {
                                return formatViewData('checkStatus', text);
                            }}
                        />

                        <Column
                            title="userKey"
                            dataIndex="userKey"
                            key="userKey"
                            sorter={false}
                            render={text => {
                                return formatViewData('userKey', text);
                            }}
                        />

                        <Column
                            title="审核时间"
                            dataIndex="checkTime"
                            key="checkTime"
                            sorter={false}
                            render={text => {
                                if (text != '') return formatViewData('checkTime', text);
                                else return '';
                            }}
                        />
                        <Column title="操作" key="action" render={this.renderAction} />
                    </Table>
                </Spin>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    list: state.userexamine.list,
    isLoading: state.userexamine.uiStatus.isLoading,
    pagination: state.userexamine.pagination,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
    changeCstatus: (uid, checkStatus, modifyTime, userKey) => dispatch(asyncChangeCstatus(uid, checkStatus, modifyTime, userKey)),
    batchChangeCstatus: (checkStatus, selectedRows) => dispatch(asyncBatchChangeCstatus(checkStatus, selectedRows)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
