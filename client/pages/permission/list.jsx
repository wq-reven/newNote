import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Popconfirm, Button, Switch, Icon} from 'antd';
const { Column } = Table;
import { actions, asyncGet, asyncDel, asyncUpdateManagerPermission } from './models';
import { formatViewData } from './utils';

class List extends React.Component {
    componentDidMount() {
        this.props.asyncGet();
    }
    viewHandler = id => {
        this.props.viewShow();
        this.props.changeCurrentSelectId(id);
    };
    editHandler = id => {
        this.props.editShow();
        this.props.changeCurrentSelectId(id);
    };
    changeHandle = (pagination, filters, sorter) => {
        this.props.changePagination(pagination);
        this.props.changeSort({ key: sorter.field, order: sorter.order });
        this.props.asyncGet();
    };
    onPermission = uid => {
        const permission = 1;
        this.props.changeManagerPermission(permission, uid)
    };
    offPermission = uid => {
        const permission = 0;
        this.props.changeManagerPermission(permission, uid)
    };
    renderAction = (text, record) => {
        if (record.permission == 1) {
            return (
                <span>
                    <Popconfirm
                        title="确定不授权？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                            this.offPermission(record.uid);
                        }}>
                        <Button type = "danger"> 不授权 </Button>
                    </Popconfirm>
                </span>

            )
        } else {
            return (
                <span>
                    <Popconfirm
                        title="确定要授权？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                            this.onPermission(record.uid);
                        }}>
                        <Button type = "primary"> 授权 </Button>
                    </Popconfirm>
                </span>
            )
        }
    };
    render() {
        const { isLoading, list, pagination } = this.props;
        return (
            <Spin spinning={isLoading} tip="加载中...">
                <Table
                    bordered
                    dataSource={list}
                    pagination={{
                        ...pagination,
                    }}
                    onChange={this.changeHandle}>
                    <Column
                        title="用户ID"
                        dataIndex="uid"
                        key="uid"
                        sorter={false}
                        render={text => {
                            return formatViewData('uid', text);
                        }}
                    />

                    <Column
                        title="用户昵称"
                        dataIndex="nickname"
                        key="nickname"
                        sorter={false}
                        render={text => {
                            return formatViewData('nickname', text);
                        }}
                    />

                    <Column
                        title="用户级别"
                        dataIndex="roles"
                        key="roles"
                        sorter={false}
                        render={text => {
                            return formatViewData('roles', text);
                        }}
                    />

                    <Column
                        title="用户权限"
                        dataIndex="permission"
                        key="permission"
                        sorter={false}
                        render={text => {
                            return formatViewData('permission', text);
                        }}
                    />

                    <Column title="授权操作" key="action" render={this.renderAction} />
                </Table>
            </Spin>
        );
    }
}

const mapStateToProps = state => ({
    list: state.permission.list,
    isLoading: state.permission.uiStatus.isLoading,
    pagination: state.permission.pagination,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncDel: id => dispatch(asyncDel(id)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
    changeManagerPermission: ( permission, uid ) => dispatch(asyncUpdateManagerPermission(permission, uid))
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
