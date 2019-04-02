import React from 'react';
import { Bind } from 'lodash-decorators';
import {
    Modal, Button, Input, Card, Form, Row, Col, DatePicker, Spin, Select, Tooltip, Cascader, Breadcrumb
} from 'antd';
import moment from 'moment';
import { cqiIndicatorUpdateRecord } from '@ultron/remote/plate';
import style from './AddPressureHistory.less';

interface IAddPressureHistoryProps {
    isAddPressureHistory: boolean;
    addPressureHistory(isAddPressureHistory: boolean);
    updataHistory();
    indicatorName: string;
    id: string;
    unit: string;
}

interface IAddPressureHistoryState {
    pressureTimeValue;
    target: string;
    colony: string;
    dateType: string;
    loading: boolean;
}

export default class AddPressureHistory extends React.Component<IAddPressureHistoryProps, IAddPressureHistoryState> {
    constructor(props: IAddPressureHistoryProps, context?: IAddPressureHistoryState) {
        super(props, context);
        this.state = {
            pressureTimeValue: null,
            target: '',
            colony: '',
            dateType: '',
            loading: false
        };
    }
    @Bind()
    private hide(): void {
        this.props.addPressureHistory(false);
    }
    @Bind()
    private keyDown(event: React.KeyboardEvent<HTMLFormElement>) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    }
    @Bind()
    private pressureTimeChange(date: moment.Moment, dateString: string) {
        this.setState({
            pressureTimeValue: date
        });
    }
    @Bind()
    private targetChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            target: event.currentTarget.value
        });
    }
    @Bind()
    private colonyChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            colony: event.currentTarget.value
        });
    }
    @Bind()
    private dateTypeChange(key): void {
        this.setState({
            dateType: key
        });
    }
    @Bind()
    private handleSubmit(event: React.FormEvent<any>): void {
        const { colony, dateType, target, pressureTimeValue } = this.state;
        if (
            !(colony
            )
        ) {
            Modal.warning({
                title: '请补全信息'
            });
            return;
        }
        this.setState({
            loading: true
        });
        cqiIndicatorUpdateRecord({
            cluster: colony,
            dateType,
            capacityActual: +target,
            createTime: +pressureTimeValue
        }, this.props.id).then((result) => {
            if (result) {
                this.setState({
                    loading: false
                }, () => {
                    Modal.success({
                        title: '提交成功',
                        onOk: () => {
                            this.hide();
                            this.props.updataHistory();
                        }
                    });
                });
            } else {
                this.setState({
                    loading: false
                }, () => {
                    Modal.error({
                        title: '提交失败'
                      });
                });
            }
        }).catch(() => {
            Modal.error({
                title: '提交失败'
              });
        });
    }
    public render(): React.ReactNode {
        const formItemLayout = {
            labelCol: {span: 4, offset: 3},
            wrapperCol: { span: 12 }
          };
        const dateType = [
            [202, '子链路压测'],
            [203, '哨兵压测']
          ];
        return (
            <div className={ style.addPressureHistory }>
                <Modal
                    visible={ this.props.isAddPressureHistory }
                    width={ 800 }
                    title="新增指标压测历史"
                    onCancel={ this.hide }
                    footer={
                        [
                            <Button
                                onClick={ this.hide }
                                key="cancel"
                            >取消
                            </Button>,
                            <Button
                                onClick={ this.handleSubmit }
                                type="primary"
                                key="submit"
                                loading={ this.state.loading }
                            >保存
                            </Button>
                        ]
                    }
                >
                    <Form onKeyDown={ this.keyDown }>
                            <Form.Item
                                label="指标名称"
                                { ...formItemLayout }
                            >
                                <Input
                                    readOnly={ true }
                                    value={ this.props.indicatorName }
                                />
                            </Form.Item>
                            <Form.Item
                                label="压测类型"
                                { ...formItemLayout }
                                required={ true }
                            >
                                <Select value={ this.state.dateType } onChange={ this.dateTypeChange }>
                                    {
                                        dateType.map((item) =>
                                        <Select.Option key={ item[0] } value={ item[0] }>{ item[1] }</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                { ...formItemLayout }
                                label="压测时间"
                                required={ true }
                            >
                                <DatePicker
                                    showTime={ true }
                                    format="YYYY/MM/DD HH:mm"
                                    placeholder="年/月/日 时:分"
                                    value={ this.state.pressureTimeValue }
                                    onChange={ this.pressureTimeChange }
                                />
                            </Form.Item>
                            <Row>
                                <Col span={ 12 }>
                                    <Form.Item
                                        label="压测容量"
                                        labelCol={ {span: 6, offset: 8} }
                                        wrapperCol={ {span: 10} }
                                        required={ true }
                                    >
                                        <Input
                                            placeholder="例: 1000"
                                            value={ this.state.target }
                                            onChange={ this.targetChange }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={ 12 }>
                                    <Form.Item
                                        label="单位"
                                        labelCol={ {span: 4, offset: 1} }
                                        wrapperCol={ {span: 9} }
                                    >
                                        <Input
                                            readOnly={ true }
                                            value={ this.props.unit }
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                label="压测集群"
                                { ...formItemLayout }
                                required={ true }
                            >
                                <Input
                                    placeholder="例: hna"
                                    value={ this.state.colony }
                                    onChange={ this.colonyChange }
                                />
                            </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
