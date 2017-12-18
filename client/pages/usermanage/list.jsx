import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Button } from 'antd';
import styles from './list.css';
const { Column } = Table;
import { actions, asyncGet, asyncgetDetail } from './models';
import { formatViewData } from './utils';
import { Link } from 'react-router-dom';

class List extends React.Component {
    componentDidMount() {
        this.props.asyncGet();
    }
    viewHandler = uid => {
        this.props.viewShow();
        this.props.asyncgetDetail(uid);
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
            <Button
                type = "primary"
                href="#"
                onClick={() => {
                    this.viewHandler(record.uid);
                }}>
                查看详细
            </Button>
        </span>
    );
    renderVideoNum = (text, record) => (
        <div className="line-limit-length w200">
            <Link to={`/videomanage/${record.uid}`}>{text}</Link>
        </div>
    );
    render() {
        const { isLoading, list, pagination } = this.props;
        return (
            <div className={styles.c_list}>
                <Spin spinning={isLoading} tip="加载中...">
                    <Table
                        dataSource={list}
                        pagination={{
                            ...pagination,
                        }}
                        bordered
                        size="1"
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
                            title="关注数"
                            dataIndex="followNum"
                            key="followNum"
                            sorter={false}
                            render={text => {
                                return formatViewData('followNum', text);
                            }}
                        />

                        <Column
                            title="粉丝数"
                            dataIndex="fansNum"
                            key="fansNum"
                            sorter={true}
                            render={text => {
                                return formatViewData('fansNum', text);
                            }}
                        />

                        <Column
                            title="获赞数"
                            dataIndex="likeNum"
                            key="likeNum"
                            sorter={true}
                            render={text => {
                                return formatViewData('likeNum', text);
                            }}
                        />

                        <Column
                            title="作品数"
                            dataIndex="producedVideoNum"
                            key="producedVideoNum"
                            sorter={true}
                            render={this.renderVideoNum}
                        />

                        <Column
                            title="注册时间"
                            dataIndex="registerTime"
                            key="registerTime"
                            sorter={false}
                            render={text => {
                                return formatViewData('registerTime', text);
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
    list: state.usermanage.list,
    isLoading: state.usermanage.uiStatus.isLoading,
    pagination: state.usermanage.pagination,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncgetDetail: uid => dispatch(asyncgetDetail(uid)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: uid => dispatch(actions.changeCurrentSelectId(uid)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);

