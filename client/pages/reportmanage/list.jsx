import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Popconfirm, Button} from 'antd';
const { Column } = Table;
import { actions, asyncGet, asynchangeReportInfo } from './models';
import { formatViewData } from './utils';

class List extends React.Component {
    componentDidMount() {
        this.props.asyncGet();
    }
    viewHandler = src => {
        console.log(src)
        this.props.viewShow();
        this.props.changeVideoSrc(src);
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
    offLine = (id, vid) => {
        let processResult = '视频已下线'
        this.props.changeVideoStatus(id, vid, processResult);
    }
    pass = (id, vid) => {
        let processResult = '举报被驳回'
        this.props.changeVideoStatus(id, vid, processResult );
    }
    renderAction = (text, record) =>{
        if (record.type === 1) {
            if (record.status == 0) {
                return (
                    <span>
                        <Button
                            onClick={() => {
                                this.viewHandler(record.url); 
                            }}>
                        查看
                        </Button>
                        <span className="ant-divider" />
                        <Popconfirm
                            title="确定执行？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.offLine(record._id, record.vid)
                            }}>
                            <Button type = "danger">下线</Button>
                        </Popconfirm>
                        <span className="ant-divider" />
                        <Popconfirm
                            title="确定执行？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.pass(record._id, record.vid)
                            }}>
                            <Button type = "primary">驳回举报</Button>
                        </Popconfirm>
                    </span>
                );
            }
        }
    } 
    render() {
        const { isLoading, list, pagination } = this.props;
        return (
            <Spin spinning={isLoading} tip="加载中...">
                <Table
                    dataSource={list}
                    pagination={{
                        ...pagination,
                    }}
                    onChange={this.changeHandle}>
                    <Column
                        title="举报人ID"
                        dataIndex="informId"
                        key="informId"
                        sorter={false}
                        render={text => {
                            return formatViewData('informId', text);
                        }}
                    />

                    <Column
                        title="被举报人ID"
                        dataIndex="informedId"
                        key="informedId"
                        sorter={false}
                        render={text => {
                            return formatViewData('informedId', text);
                        }}
                    />

                    <Column
                        title="举报类型"
                        dataIndex="type"
                        key="type"
                        sorter={false}
                        render={text => {
                            return formatViewData('type', text);
                        }}
                    />
                    
                    <Column
                        title="举报原因"
                        dataIndex="content"
                        key="content"
                        sorter={false}
                        render={text => {
                            return formatViewData('content', text);
                        }}
                    />

                    <Column
                        title="举报时间"
                        dataIndex="created"
                        key="created"
                        sorter={true}
                        render={text => {
                            return formatViewData('created', text);
                        }}
                    />
                    <Column
                        title="举报状态"
                        dataIndex="status"
                        key="status"
                        sorter={false}
                        render={text => {
                            return formatViewData('status', text);
                        }}
                    />
                    <Column
                        title="操作结果"
                        dataIndex="processResult"
                        key="processResult"
                        sorter={false}
                        render={text => {
                            return formatViewData('processResult', text);
                        }}
                    />
                    <Column title="操作" key="action" render={this.renderAction} />
                </Table>
            </Spin>
        );
    }
}

const mapStateToProps = state => ({
    list: state.reportmanage.list,
    isLoading: state.reportmanage.uiStatus.isLoading,
    pagination: state.reportmanage.pagination,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncDel: id => dispatch(asyncDel(id)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
    changeVideoSrc: url => dispatch(actions.getVideo(url)),
    changeVideoStatus: ( id, vid, processResult ) => dispatch(asynchangeReportInfo(id, vid, processResult)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
