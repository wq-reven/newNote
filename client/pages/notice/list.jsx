import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Button } from 'antd';
const { Column } = Table;
import { actions, asyncGet } from './models';
import { formatViewData } from './utils';

class List extends React.Component {
    componentDidMount() {
        this.props.asyncGet();
    }
    viewHandler = id => {
        this.props.viewShow();
        this.props.changeCurrentSelectId(id);
    };
    editHandler = noticesDetail => {
        this.props.editShow();
        this.props.changeCurrentSelectId(noticesDetail);
    };
    changeHandle = (pagination, filters, sorter) => {
        this.props.changePagination(pagination);
        this.props.changeSort({ key: sorter.field, order: sorter.order });
        this.props.asyncGet();
    };
    renderAction = (text, record) => {
        if (record.type === 1) {
            let noticesDetail = {
                mid: record.mid,
                title: record.title,
                content: record.content,
                type: record.type,
                startTime: record.startTime,
                endTime: record.endTime,
                creator: record.creator,
                publisher: record.publisher,
                avatar: record.avatar,
                url: record.url,
                createTime: record.createTime,
                img: record.img,
            };
            return (
                <span>
                    <Button
                        onClick={() => {
                            this.editHandler(noticesDetail);
                        }}>
                        修改
                    </Button>
                </span>
            );
        }
    };
    render() {
        const { isLoading, list, pagination } = this.props;
        return (
            <Spin spinning={isLoading} tip="加载中...">
                <Table
                    expandedRowRender={ record => <p style={{ margin: 0 }}>公告ID：{record.mid}</p>}
                    bordered
                    dataSource={list}
                    rowKey="mid"
                    pagination={{
                        ...pagination,
                    }}
                    onChange={this.changeHandle}>
                    <Column
                        title="标题"
                        dataIndex="title"
                        key="title"
                        sorter={false}
                        render={text => {
                            return formatViewData('title', text);
                        }}
                    />

                    <Column
                        title="内容"
                        dataIndex="content"
                        key="content"
                        sorter={false}
                        render={text => {
                            return formatViewData('content', text);
                        }}
                    />

                    <Column
                        title="类型"
                        dataIndex="type"
                        key="type"
                        sorter={false}
                        render={text => {
                            return formatViewData('type', text);
                        }}
                    />

                    <Column
                        title="开始时间"
                        dataIndex="startTime"
                        key="startTime"
                        sorter={false}
                        render={text => {
                            return formatViewData('startTime', text);
                        }}
                    />

                    <Column
                        title="结束时间"
                        dataIndex="endTime"
                        key="endTime"
                        sorter={false}
                        render={text => {
                            return formatViewData('endTime', text);
                        }}
                    />

                    <Column
                        title="操作人"
                        dataIndex="creator"
                        key="creator"
                        sorter={false}
                        render={text => {
                            return formatViewData('creator', text);
                        }}
                    />

                    <Column
                        title="操作时间"
                        dataIndex="createTime"
                        key="createTime"
                        sorter={false}
                        render={text => {
                            return formatViewData('createTime', text);
                        }}
                    />

                    <Column title="操作" key="action" render={this.renderAction} />
                </Table>
            </Spin>
        );
    }
}

const mapStateToProps = state => ({
    list: state.notice.list,
    isLoading: state.notice.uiStatus.isLoading,
    pagination: state.notice.pagination,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: params => dispatch(actions.changeCurrentSelectId(params)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
