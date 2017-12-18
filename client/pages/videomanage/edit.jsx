import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form } from 'antd';

import { Input, Select } from 'antd';

const Option = Select.Option;

import { actions, asyncUpdate, asyncGetVagueChallenge} from './models';
import { formItemLayout, formatFormData } from './utils';
import { setInterval } from 'timers';
const FormItem = Form.Item;

class Edit extends React.Component {
    componentDidMount() {
        // this.props.GetchallengeName();
    }
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.modalHide();
    };
    handleOk = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                await this.props.asyncUpdate(formatFormData(values));
                this.props.form.resetFields();
                this.props.modalHide();
            }
        });
    };
    VagueSearchChallenge = value => {
        console.log(value)
        this.props.sendChalengeName(value)
    }
    render() {
        const { isModalShow, isLoading, item } = this.props;
        const { getFieldDecorator } = this.props.form;
        const children = [];
        for (let i = 0; i < this.props.getchallengeName.length; i++) {
            children.push(<Option value={this.props.getchallengeName[i].challengeName}>{this.props.getchallengeName[i].challengeName}</Option>);
        }
        const form = (
            <Form>
                <Row>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="挑战名称">
                            {getFieldDecorator('oldchallengeName', {
                                initialValue: this.props.getChallenge,
                                rules: [],
                            })(
                                <Input Disabled />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={24} >
                        <FormItem {...formItemLayout} label="挑战id">
                            {getFieldDecorator('oldchallengeNameID', {
                                initialValue: this.props.getChallengeId,
                                rules: [],
                            })(
                                <Input Disabled />
                            )}
                        </FormItem>
                    </Col>

                    <FormItem {...formItemLayout} label="修改为">
                        {getFieldDecorator('challengeName', {
                            initialValue: this.props.getChallenge,
                            rules: [],
                        })(
                            <Select name="challengeName" style={{ width: 280 }}
                                showSearch
                                optionFilterProp="children"
                                onSearch={ value => {
                                    this.VagueSearchChallenge(value);
                                }}>
                                {children}
                            </Select>
                        )}
                    </FormItem>
                    <Col span={24} style={{ display: 'none' }}>
                        <FormItem {...formItemLayout} label="视频id">
                            {getFieldDecorator('vid', {
                                initialValue: this.props.getChallengeVid,
                                rules: [],
                            })(<Input />)}
                        </FormItem>
                    </Col>
                    <Col span={24} style={{ display: 'none' }}>
                        <FormItem {...formItemLayout} label="视频状态">
                            {getFieldDecorator('status', {
                                initialValue: this.props.getChallengeStatus,
                                rules: [],
                            })(<Input />)}
                        </FormItem>
                    </Col>

                </Row>
            </Form>
        );
        return (
            <Modal
                title="修改挑战"
                visible={isModalShow}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={isLoading}
                maskClosable={false}>
                <Spin spinning={isLoading} tip="保存中...">
                    {form}
                </Spin>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    item: state.videomanage.list.reduce((a, b) => (b.id === state.videomanage.currentSelectId ? b : a), {}),
    isModalShow: state.videomanage.uiStatus.isUpdateShow,
    isLoading: state.videomanage.uiStatus.isLoading,
    getChallenge: state.videomanage.updateChallenge,
    getChallengeId: state.videomanage.challengeId,
    getChallengeVid: state.videomanage.updateChallengeVid,
    getChallengeStatus: state.videomanage.updateChallengeStatus,
    getchallengeName: state.videomanage.challengeName,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isUpdateShow: false })),
    asyncUpdate: contents => dispatch(asyncUpdate(contents)),
    // GetchallengeName: () => dispatch(asyncGetChallenge()),
    sendChalengeName: value => dispatch(asyncGetVagueChallenge(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit));
