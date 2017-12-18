import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Popconfirm, Button} from 'antd';
const { Column } = Table;
import { actions, asyncGet, asyncDel } from './models';
import { formatViewData } from './utils';
import { Link } from 'react-router-dom';

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
    renderAction = (text, record) => (
        <span>
            <Popconfirm
                title="确定删除该条信息？"
                okText="确定删除"
                cancelText="取消删除"
                onConfirm={() => {
                    this.props.asyncDel(record.challengeId);
                }}>
                <Button type="danger" href="#">删除</Button>
            </Popconfirm>
        </span>
    );
    renderVideoNum = (text, record) => (
        <div className="line-limit-length w200">
            <Link to={`/videomanage/${encodeURIComponent(record.challengeName)}`}>{text}</Link>
        </div>
    );
    render() {
        const { isLoading, list, pagination } = this.props;
        return (
            <Spin spinning={isLoading} tip="加载中...">
                <Table
                    dataSource={list}
                    pagination={{
                        ...pagination,
                    }}
                    expandedRowRender={ record => <p style={{ margin: 0 }}>挑战ID：{record.challengeId}</p>}
                    rowKey="challengeId"
                    bordered
                    onChange={this.changeHandle}>
                    <Column
                        title="挑战名称"
                        dataIndex="challengeName"
                        key="challengeName"
                        sorter={false}
                        render={text => {
                            return formatViewData('challengeName', text);
                        }}
                    />

                    <Column
                        title="作品数"
                        dataIndex="videoNum"
                        key="videoNum"
                        sorter={false}
                        render={this.renderVideoNum}
                    />

                    <Column
                        title="参与人数"
                        dataIndex="userNum"
                        key="userNum"
                        sorter={false}
                        render={text => {
                            return formatViewData('userNum', text);
                        }}
                    />

                    <Column
                        title="来源"
                        dataIndex="creatorInfo.nickname"
                        key="creatorInfo.nickname"
                        sorter={false}
                        render={text => {
                            return formatViewData('creatorInfo.nickname', text);
                        }}
                    />

                    <Column
                        title="添加人"
                        dataIndex="mangerCreator.creator"
                        key="mangerCreator.creator"
                        sorter={false}
                        render={text => {
                            return formatViewData('mangerCreator.creator', text);
                        }}
                    />

                    <Column
                        title="添加时间"
                        dataIndex="cTime"
                        key="cTime"
                        sorter={false}
                        render={text => {
                            return formatViewData('cTime', text);
                        }}
                    />

                    <Column title="操作" key="action" render={this.renderAction} />
                </Table>
            </Spin>
        );
    }
}

const mapStateToProps = state => ({
    list: state.challengement.list,
    isLoading: state.challengement.uiStatus.isLoading,
    pagination: state.challengement.pagination,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncDel: challengeId => dispatch(asyncDel(challengeId)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
