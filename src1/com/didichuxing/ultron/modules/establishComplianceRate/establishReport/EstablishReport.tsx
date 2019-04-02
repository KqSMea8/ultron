import React from 'react';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import EstablishDataGroup from './establishDataGroup/EstablishDataGroup';
import {
    Modal, Button, InputNumber, Card, Form, Row, Col, DatePicker, Spin, Select, Tooltip, Cascader, Breadcrumb,
    Divider, Icon, Tag
} from 'antd';
import {
    cqiReportDataType, cqiReportDataGroup, cqiReportCreate, cpqDataGroupQueryServices
} from '@ultron/remote/plate';
import style from './EstablishReport.less';

interface IEstablishReportProps {
    changeSelectedKey;
    goToCapacityReport();
}

interface IEstablishReportState {
    spinLoading: boolean;
    dataTypeResult;
    dataGroupResult;
    dataGroupResultSelectKey: number | undefined;
    dataTypeResultSelectKey: string;
    beginTimeValue;
    dutationValue;
    isShowEstablishModal: boolean;
    dataGroupDetail: object[];
}
export default class EstablishReport extends React.Component<IEstablishReportProps, IEstablishReportState> {
    constructor(props: IEstablishReportProps, context?: IEstablishReportState) {
        super(props, context);
        this.state = {
            spinLoading: true,
            dataTypeResult: [],
            dataGroupResult: [],
            dataGroupResultSelectKey: undefined,
            dataTypeResultSelectKey: '',
            beginTimeValue: null,
            dutationValue: '',
            isShowEstablishModal: false,
            dataGroupDetail: []
        };
    }
    @Bind()
    private async fetchData() {
        this.setState({
            spinLoading: true
        });
        const dataTypeResult = await cqiReportDataType({});
        const dataGroupResult = await cqiReportDataGroup({});
        if (dataTypeResult && dataGroupResult && dataTypeResult.length && dataGroupResult.length) {
            this.setState({
                dataTypeResult,
                dataGroupResult,
                dataGroupResultSelectKey: dataGroupResult[0]['value'],
                spinLoading: false
            });
        }
    }
    @Bind()
    private dataGroupResultSelectKeyChange(value) {
        this.setState({
            dataGroupResultSelectKey: value,
            spinLoading: true
        }, () => {
            cpqDataGroupQueryServices({}, this.state.dataGroupResultSelectKey as number).then((result: any) => {
                const dataGroupDetail: object[] = [];
                for (const i in JSON.parse(result)) {
                    if (true) {
                        const item = {
                            label: i,
                            value: JSON.parse(result)[i]
                        };
                        dataGroupDetail.push(item);
                    }
                }
                this.setState({
                    spinLoading: false,
                    dataGroupDetail
                });
            });
        });
    }
    @Bind()
    private executeDetail(): React.ReactNode {
        return this.state.dataGroupDetail.map((item, index) => {
            return(
                <div key={ index }>
                    <h4 className={ style.detailLabel }>{ item['label'] } :</h4>
                    <div>
                        {
                           item['value'].map((part, partIndex) => {
                               return (
                                    <Tag key={ partIndex }>{ part }</Tag>
                               );
                           })
                        }
                    </div>
                </div>
            );
        });
    }
    @Bind()
    private dataTypeResultSelectKeyChange(value) {
        this.setState({
            dataTypeResultSelectKey: value
        });
    }
    @Bind()
    private handleSubmit(event: React.FormEvent<any>) {
        event.preventDefault();
        const { dataTypeResultSelectKey, dataGroupResultSelectKey, beginTimeValue, dutationValue } = this.state;
        if (
            !(
                dataTypeResultSelectKey && dataGroupResultSelectKey && beginTimeValue && dutationValue
            )
            ) {
                Modal.warning({
                    title: '请补全信息'
                });
                return;
        }
        cqiReportCreate({
            indicatorDataType: dataTypeResultSelectKey[1],
            dataGroupId: dataGroupResultSelectKey,
            beginTime: beginTimeValue ? Math.round(beginTimeValue / 1000) : undefined,
            duration: dutationValue * 3600
        }).then((resulet) => {
            resulet && Modal.success({
                title: '新建报告成功',
                onOk: () => {
                    this.props.changeSelectedKey('capacityReport');
                }
              });
        });
    }
    @Bind()
    private keyDown(event: React.KeyboardEvent<HTMLFormElement>) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    }
    @Bind()
    private beginTimeChange(date: moment.Moment, dateString: string) {
        this.setState({
            beginTimeValue: date
        });
    }
    @Bind()
    private dutationChange(value) {
        this.setState({
            dutationValue: value
        });
    }
    @Bind()
    private cancel() {
        this.props.changeSelectedKey('capacityReport');
    }
    @Bind()
    private dutationFormatter(value) {
        if (!value) {
            return '';
        } else {
            return `${value} 小时`;
        }
    }
    @Bind()
    private displayRender(label: string[], selectedOptions?) {
        return label[1];
    }
    /**
     * 跳容量报告页
     */
    @Bind()
    private goToCapacityReport(event: React.MouseEvent<HTMLSpanElement>) {
        this.props.goToCapacityReport();
    }
    @Bind()
    private showEstablishModal() {
        this.setState({
            isShowEstablishModal: true
        });
    }
    @Bind()
    private hideEstablishModal() {
        this.setState({
            isShowEstablishModal: false
        });
    }
    public async componentWillMount() {
        await this.fetchData();
        this.setState({
            spinLoading: false
        });
    }

    public render(): React.ReactNode {
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 5 }
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 12 }
            }
          };
        return (
            <div className={ style.EstablishReport }>
                <Spin
                    spinning={ this.state.spinLoading }
                    size="large"
                >
                    <Breadcrumb
                        separator=">"
                        className={ style.breadcrumb }
                    >
                        <Breadcrumb.Item >
                            <span onClick={ this.goToCapacityReport } className={ style.capacityReportBreadcrumb } >
                                容量报告
                            </span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item >
                            <span>
                                新建报告
                            </span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Card
                        bordered={ false }
                        title="新建报告"
                    >
                        <Form onSubmit={ this.handleSubmit } onKeyDown={ this.keyDown }>
                            <Form.Item
                                { ...formItemLayout }
                                label="类型"
                                required={ true }
                                labelCol={ {span: 2, offset: 5} }
                                wrapperCol={ {span: 12} }
                            >
                                <Cascader
                                    options={ this.state.dataTypeResult }
                                    onChange={ this.dataTypeResultSelectKeyChange }
                                    value={ [this.state.dataTypeResultSelectKey] }
                                    displayRender={ this.displayRender }
                                />
                            </Form.Item>
                            <Form.Item
                                { ...formItemLayout }
                                label="数据组"
                                required={ true }
                                labelCol={ {span: 2, offset: 5} }
                                wrapperCol={ {span: 12} }
                            >
                                <Col span={ 20 }>
                                    <Select
                                        value={ this.state.dataGroupResultSelectKey }
                                        onChange={ this.dataGroupResultSelectKeyChange }
                                    >
                                        {
                                            this.state.dataGroupResult.map((item) => {
                                                return (
                                                    <Select.Option
                                                        key={ item['id'] }
                                                        value={ item['id'] }
                                                    >
                                                        { item['name'] }
                                                    </Select.Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </Col>
                                <Col span={ 4 } className={ style.establishDataGroupButton }>
                                    <Button
                                        icon="plus"
                                        type="primary"
                                        onClick={ this.showEstablishModal }
                                    >
                                        新建
                                    </Button>
                                </Col>
                            </Form.Item>
                            {
                                !!this.state.dataGroupDetail.length &&
                                <Form.Item
                                    { ...formItemLayout }
                                    label="数据组详情"
                                    labelCol={ {span: 2, offset: 5} }
                                    wrapperCol={ {span: 12} }
                                >
                                    <div className={ style.dataGroupDetail }>
                                        {
                                            this.executeDetail()
                                        }
                                    </div>
                                </Form.Item>
                            }
                            <Row>
                                <Col span={ 12 }>
                                    <Form.Item
                                        { ...formItemLayout }
                                        label="开始时间"
                                        required={ true }
                                        labelCol={ {span: 4, offset: 10} }
                                        wrapperCol={ {span: 10} }
                                    >
                                        <DatePicker
                                            className={ style.beginTime }
                                            showTime={ true }
                                            format="YYYY/MM/DD HH:mm"
                                            placeholder="年/月/日 时:分"
                                            value={ this.state.beginTimeValue }
                                            onChange={ this.beginTimeChange }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={ 12 }>
                                    <Form.Item
                                        { ...formItemLayout }
                                        label="持续时间"
                                        required={ true }
                                        labelCol={ {span: 4, offset: 2 } }
                                        wrapperCol={ {span: 8} }
                                    >
                                        <Tooltip
                                            placement="right"
                                            visible={ this.state.dutationValue > 11.5 }
                                            title="持续时间不能超过11.5小时"
                                        >
                                            <InputNumber
                                                min={ 0.5 }
                                                max={ 11.5 }
                                                className={ style.dutation }
                                                step={ 0.5 }
                                                formatter={ this.dutationFormatter }
                                                value={ this.state.dutationValue }
                                                onChange={ this.dutationChange }
                                            />
                                        </Tooltip>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className={ style.submitAndCancel }>
                                <Col offset={ 11 } span={ 1 }>
                                    <Form.Item>
                                        <Button size="large" onClick={ this.cancel } >取消</Button>
                                    </Form.Item>
                                </Col>
                                <Col offset={ 1 } span={ 1 }>
                                    <Form.Item>
                                        <Button size="large" type="primary" htmlType="submit">提交</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Spin>
                {
                    this.state.isShowEstablishModal &&
                    <EstablishDataGroup
                        isShowEstablishModal={ this.state.isShowEstablishModal }
                        hideEstablishModal={ this.hideEstablishModal }
                        fatherFetchData={ this.fetchData }
                    />
                }
            </div>
        );
    }
}
