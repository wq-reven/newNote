import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Form, Input } from 'antd';
import { actions } from './models';
import { formatViewData } from './utils';
import { formItemLayout, splitBirth } from './utils';
import styles from './view.css';
const FormItem = Form.Item;

class View extends React.Component {
    handlesex = sex => {
        switch (sex) {
            case 2:
                return '女';
                break;
            case 1:
                return '男';
                break;
        }
    };
    handleAge = birthday => {
        if ( birthday ) {
            const birth = splitBirth(birthday);
            const now = splitBirth(formatViewData('registerTime', Date.now()));
            const age = now - birth;
            return age;
        } else {
            return '';
        }
    }
    handleCancel = () => {
        this.props.viewHide();
    };
    render() {
        const { isViewShow, item } = this.props;
        const viewItem = (() => {
            return Object.keys(item).map(key => (
                <Row gutter={20}>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        {key}
                    </Col>
                    <Col span={18}>{formatViewData(key, item[key])}</Col>
                </Row>
            ));
        })();
        return (
            <Modal title="查看详情" visible={isViewShow} onCancel={this.handleCancel} footer={null}>
                {viewItem}
                <div className={styles.person_detail}>
                    <div className={styles.detail_hearder}>
                        <img src={this.props.detail.avatarThumb} alt="" className={styles.userlogo} />
                        <div className={styles.userInfo}>
                            <p className={styles.nickname}>{this.props.detail.nickname}</p>
                            <p className={styles.uid}>id : {this.props.detail.uid}</p>
                        </div>
                    </div>
                    <div className={styles.detail_body}>
                        <Form>
                            <Row>
                                <Col span={36}>
                                    <FormItem {...formItemLayout} label="性别:">
                                        {<Input value={this.handlesex(this.props.detail.sex)} disabled="true" />}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="出生日期:">
                                        {<Input value={this.props.detail.birthday} disabled="true" />}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="年龄:">
                                        {<Input value={this.handleAge(this.props.detail.birthday)} disabled="true" />}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="星座">
                                        {<Input value={this.props.detail.constellation} disabled="true" />}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="城市:">
                                        {<Input value={this.props.detail.city} disabled="true" />}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="关注数:">
                                        {<Input value={this.props.detail.followNum} disabled="true" />}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="粉丝数:">
                                        {<Input value={this.props.detail.fansNum} disabled="true" />}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="作品数:">
                                        {<Input value={this.props.detail.producedVideoNum} disabled="true" />}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="获赞数:">
                                        {<Input value={this.props.detail.likeNum} disabled="true" />}
                                    </FormItem>
                                    <FormItem {...formItemLayout} label="注册日期:">
                                        {
                                            <Input
                                                value={formatViewData('registerTime', this.props.detail.registerTime)}
                                                disabled="true"
                                            />
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    item: state.usermanage.list.reduce((a, b) => (b.id === state.usermanage.currentSelectId ? b : a), {}),
    isViewShow: state.usermanage.uiStatus.isViewShow,
    detail: state.usermanage.detail,
});

const mapDispatchToProps = dispatch => ({
    viewHide: () => dispatch(actions.changeUiStatus({ isViewShow: false })),
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
