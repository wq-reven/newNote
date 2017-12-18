import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Popconfirm, Button, Icon } from 'antd';
const { Column } = Table;
import { actions, asyncGet, asynchangeVideoStatus, asyncBatchChangeVideostatus } from './models';
import { formatViewData } from './utils';
import { withRouter } from 'react-router-dom';
import styles from './list.css';
class List extends React.Component {
    componentDidMount() {
        if (this.props.match.params && this.props.match.params.urlValue) {
            this.props.asyncGet(this.props.match.params.urlValue);
        } else {
            this.props.asyncGet();
        }
    }
    componentWillReceiveProps(nextProps) {

        if (this.props.location.pathname !== nextProps.location.pathname) {
            let current = 1;
            // this.props.changePagination(current);
            this.props.clearsearch({});
            this.props.asyncGet();
        }
    }
    viewHandler = src => {
        this.props.changeVideoSrc(src);
        this.props.viewShow();
        console.log(this.props.playVideo);
    };
    offLine = (uid, vid, challengeName, challengeId, oldStatus ) => {
        const status = 0;
        let handelInfo = {
            uid: uid,
            vid: vid,
            status: status,
            challengeName: challengeName,
            challengeId: challengeId,
            oldStatus: oldStatus,
        };
        this.props.changeStatus(handelInfo);
    };
    onLine = (uid, vid, challengeName, challengeId, oldStatus) => {
        const status = 1;
        let handelInfo = {
            uid: uid,
            vid: vid,
            status: status,
            challengeName: challengeName,
            challengeId: challengeId,
            oldStatus: oldStatus,
        };
        this.props.changeStatus(handelInfo);
    };
    editHandler = (challengeName, challengeId, uniqueVideoId, status) => {
        this.props.editShow();
        this.props.changeChallenge(challengeName);
        this.props.changeChallengeId(challengeId);
        this.props.changeChallengeVid(uniqueVideoId);
        this.props.changeChallengeStatus(status);
    };
    changeHandle = (pagination, filters, sorter) => {
        // 如果是页数不变，则是排序触发，页数重置为1
        let current = this.props.pagination.current === pagination.current ? 1 : pagination.current;
        // 如果排序字段没有，则排序为空
        this.props.changeSort({
            key: sorter.field,
            order: sorter.order,
        });
        this.props.changePagination(current);
        this.props.asyncGet();
    };
    state = {
        selectedRows: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };
    start = () => {
        this.setState({ loading: true });
        this.setState({
            selectedRowKeys: [],
            loading: false,
        });
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
    batchOnline = selectedRows => {
        var batchArray =[]
        for (let i = 0; i < selectedRows.length;i++ ) {
            if (selectedRows[i].status == 0 || selectedRows[i].status == 2) {
                batchArray.push(selectedRows[i])
            }
        }
        const status = 1;
        this.props.batchChangestatus(status, batchArray)
        this.start()
    }
    batchOffline = selectedRows => {
        var batchArray =[]
        for (let i = 0; i < selectedRows.length ; i++ ) {
            if (selectedRows[i].status == 1) {
                batchArray.push(selectedRows[i])
            }
        }
        const status = 0;
        this.props.batchChangestatus(status, batchArray)
        this.start()
    }
    renderAction = (text, record) => {
        if (record.source === '抓站') {
            if (record.status === '0') {
                return (
                    <span>
                        <Button
                            type="primary"
                            href="#"
                            onClick={() => {
                                this.viewHandler(record.videoPlayUrl);
                            }}>
                            播放
                        </Button>
                        <span className="ant-divider" />
                        <Popconfirm
                            title="确定执行？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.onLine(record.author.uid, record.uniqueVideoId, record.challengeName, record.challengeId, record.status );
                            }}>
                            <button className = {styles.success}>上线</button>
                        </Popconfirm>
                        <span className="ant-divider" />
                        <Button
                            onClick={() => {
                                this.editHandler(record.challengeName, record.challengeId, record.uniqueVideoId, record.status);
                            }}>
                            修改挑战
                        </Button>
                    </span>
                );
            } else if ( record.status === '1' ) {
                return (
                    <span>
                        <Button
                            type="primary"
                            href="#"
                            onClick={() => {
                                this.viewHandler(record.videoPlayUrl);
                            }}>
                            播放
                        </Button>
                        <span className="ant-divider" />
                        <Popconfirm
                            title="确定执行?"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.offLine(record.author.uid, record.uniqueVideoId, record.challengeName, record.challengeId, record.status);
                            }}>
                            <Button type="danger">下线</Button>
                        </Popconfirm>
                        <span className="ant-divider" />
                        <Button
                            onClick={() => {
                                this.editHandler(record.challengeName, record.challengeId, record.uniqueVideoId, record.status);
                            }}>
                            修改挑战
                        </Button>
                    </span>
                );
            } else if ( record.status === '2' ) {
                return (
                    <span>
                        <Button
                            type="primary"
                            href="#"
                            onClick={() => {
                                this.viewHandler(record.videoPlayUrl);
                            }}>
                            播放
                        </Button>
                        <span className="ant-divider" />
                        <Popconfirm
                            title="确定执行？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.onLine(record.author.uid, record.uniqueVideoId, record.challengeName, record.challengeId, record.status);
                            }}>
                            <button className = {styles.success}>上线</button>
                        </Popconfirm>
                        <span className="ant-divider" />
                        <Popconfirm
                            title="确定执行?"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.offLine(record.author.uid, record.uniqueVideoId, record.challengeName, record.challengeId, record.status);
                            }}>
                            <Button type="danger">下线</Button>
                        </Popconfirm>
                        <span className="ant-divider" />
                        <Button
                            onClick={() => {
                                this.editHandler(record.challengeName, record.challengeId, record.uniqueVideoId, record.status);
                            }}>
                            修改挑战
                        </Button>
                    </span>
                );
            } else {
                return (
                    <span>
                        <Button
                            type="primary"
                            href="#"
                            onClick={() => {
                                this.viewHandler(record.videoPlayUrl);
                            }}>
                            播放
                        </Button>
                    </span>
                )
            }
        } else {
            if (record.status === '0') {
                return (
                    <span>
                        <Button
                            type="primary"
                            href="#"
                            onClick={() => {
                                this.viewHandler(record.videoPlayUrl);
                            }}>
                            播放
                        </Button>
                        <span className="ant-divider" />
                        <Popconfirm
                            title="确定执行？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.onLine(record.author.uid, record.uniqueVideoId, record.challengeName, record.challengeId, record.status);
                            }}>
                            <button className = {styles.success}>上线</button>
                        </Popconfirm>
                    </span>
                );
            } else if ( record.status === '1') {
                return (
                    <span>
                        <Button
                            type="primary"

                            href="#"
                            onClick={() => {
                                this.viewHandler(record.videoPlayUrl);
                            }}>
                            播放
                        </Button>
                        <span className="ant-divider" />
                        <Popconfirm
                            title="确定执行?"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.offLine(record.author.uid, record.uniqueVideoId, record.challengeName, record.challengeId, record.status);
                            }}>
                            <Button type="danger">下线</Button>
                        </Popconfirm>
                    </span>
                );
            } else if ( record.status === '2' ) {
                return (
                    <span>
                        <Button
                            type="primary"
                            href="#"
                            onClick={() => {
                                this.viewHandler(record.videoPlayUrl);
                            }}>
                            播放
                        </Button>
                        <span className="ant-divider" />
                        <Popconfirm
                            title="确定执行？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.onLine(record.author.uid, record.uniqueVideoId, record.challengeName, record.challengeId, record.status);
                            }}>
                            <button className = {styles.success}>上线</button>
                        </Popconfirm>
                        <span className="ant-divider" />
                        <Popconfirm
                            title="确定执行?"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                this.offLine(record.author.uid, record.uniqueVideoId, record.challengeName, record.challengeId, record.status);
                            }}>
                            <Button type="danger">下线</Button>
                        </Popconfirm>
                    </span>
                );
            } else {
                return (
                    <span>
                        <Button
                            type="primary"
                            href="#"
                            onClick={() => {
                                this.viewHandler(record.videoPlayUrl);
                            }}>
                            播放
                        </Button>
                    </span>
                )
            }
        }
    };
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
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Popconfirm title="确定执行？" okText="确定" cancelText="取消" onConfirm={() => {
                        this.batchOnline(rowSelection.selectedRows);
                    }}>
                        <Button className = {styles.success} disabled={!hasSelected}>
                            批量上线
                        </Button>
                    </Popconfirm>
                    <span style={{ marginLeft: 18 }} />
                    <Popconfirm title="确定执行？" okText="确定" cancelText="取消" onConfirm={() => {
                        this.batchOffline(rowSelection.selectedRows);
                    }}>
                        <Button type="danger" disabled={!hasSelected}>
                            批量下线
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
                        expandedRowRender={ record => <p style={{ margin: 0 }}>视频ID：{record.uniqueVideoId}</p>}
                        rowSelection={rowSelection}
                        dataSource={list}
                        pagination={{
                            ...pagination,
                        }}
                        rowKey="uniqueVideoId"
                        bordered
                        onChange={this.changeHandle}>
                        <Column
                            title="视频标题"
                            dataIndex="title"
                            key="title"
                            sorter={false}
                            render={text => {
                                return formatViewData('title', text);
                            }}
                        />

                        <Column
                            title="背景音乐"
                            dataIndex="musicUrl"
                            key="musicUrl"
                            sorter={false}
                            render={text => {
                                return formatViewData('musicUrl', text);
                            }}
                        />

                        <Column
                            title="挑战"
                            dataIndex="challengeName"
                            key="challengeName"
                            sorter={false}
                            render={text => {
                                return formatViewData('challengeName', text);
                            }}
                        />

                        <Column
                            title="发布人ID"
                            dataIndex="author.uid"
                            key="author.uid"
                            sorter={false}
                            render={text => {
                                return formatViewData('uid', text);
                            }}
                        />

                        <Column
                            title="发布人昵称"
                            dataIndex="author.nickname"
                            key="author.nickname"
                            sorter={false}
                            render={text => {
                                return formatViewData('nickname', text);
                            }}
                        />

                        <Column
                            title="发布时间"
                            dataIndex="publishTime"
                            key="publishTime"
                            sorter={false}
                            render={text => {
                                return formatViewData('publishTime', text);
                            }}
                        />

                        <Column
                            title="类别"
                            dataIndex="source"
                            key="source"
                            sorter={false}
                            render={text => {
                                return formatViewData('source', text);
                            }}
                        />
                        <Column
                            title="标签"
                            dataIndex="tags"
                            key="tags"
                            sorter={false}
                            render={text => {
                                return formatViewData('tags', text);
                            }}
                        />

                        <Column
                            title="视频来源"
                            dataIndex="creator"
                            key="creator"
                            sorter={false}
                            render={text => {
                                return formatViewData('creator', text);
                            }}
                        />

                        <Column
                            title="添加时间"
                            dataIndex="insertTime"
                            key="insertTime"
                            sorter={false}
                            render={text => {
                                return formatViewData('insertTime', text);
                            }}
                        />

                        <Column
                            title="播放次数"
                            dataIndex="playCount"
                            key="playCount"
                            sorter={true}
                            render={text => {
                                return formatViewData('playCount', text);
                            }}
                        />

                        <Column
                            title="获赞数"
                            dataIndex="likeCount"
                            key="likeCount"
                            sorter={true}
                            render={text => {
                                return formatViewData('likeCount', text);
                            }}
                        />

                        <Column
                            title="状态"
                            dataIndex="status"
                            key="status"
                            sorter={false}
                            render={text => {
                                return formatViewData('status', text);
                            }}
                        />

                        <Column title="操作" key="action"  render={this.renderAction} />
                    </Table>
                </Spin>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    list: state.videomanage.list,
    isLoading: state.videomanage.uiStatus.isLoading,
    pagination: state.videomanage.pagination,
    playVideo: state.videomanage.playVideo,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: uid => dispatch(asyncGet(uid)),
    changeVideoSrc: url => dispatch(actions.getVideo(url)),
    changeChallenge: challengeName => dispatch(actions.getChallenge(challengeName)),
    changeChallengeId: challengeId => dispatch(actions.getChallengeId(challengeId)),
    changeChallengeVid: vid => dispatch(actions.getChallengeVid(vid)),
    changeChallengeStatus: status => dispatch(actions.getVideoStatus(status)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: currentPage => dispatch(actions.changePagination({ current: currentPage })),
    changeSort: data => dispatch(actions.changeSort(data)),
    changeStatus: handelInfo => dispatch(asynchangeVideoStatus(handelInfo)),
    changePagination: currentPage => dispatch(actions.changePagination({ current: currentPage })),
    clearsearch: params => dispatch(actions.changeSearchValues(params)),
    batchChangestatus: (status, selectedRows) => dispatch(asyncBatchChangeVideostatus(status, selectedRows)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List));
