import React from 'react';
import { AView } from 'com/didichuxing/commonInterface/AView';
import { Icon, Input, AutoComplete, Modal, Button, Switch, Card, Form, Row, Col, Checkbox, Spin, Select } from 'antd';
import Tooltip from '@antd/tooltip';
import { modulesOptions, businessOptions, indicatorCreate, cqiModuleApis } from '@ultron/remote/plate';
import style from './EstablishCapacity.less';
import { observer } from 'mobx-react';
import {observable, runInAction} from 'mobx';
import {getThriftTypeList} from '@ultron/remote/testConfig';
import { Bind } from 'lodash-decorators';

interface IEstablishCapacityProps {
    query;
    backToComplianceRate;
}

interface IEstablishCapacityState {
    cardLoading: boolean;
    businessName: string;
    businessId: string;
    dataModuleSelectKey: string;
    businessModule;
    apiValue: string;
    radixValue: string;
    checkBoxValue: string[];
    targetName: string;
    target: string;
    unit: string;
    businessModuleSelectKey: string;
    plainOptions;
    apiResult;
    switchCheck: boolean;
}
@observer
export default class EstablishCapacity extends React.Component<IEstablishCapacityProps, IEstablishCapacityState> {
    private apiResult: any[] = [];
    constructor(props: IEstablishCapacityProps, context?: IEstablishCapacityState) {
        super(props, context);
        const { businessName, businessId } = this.props.query;
        this.state = {
            cardLoading: true,
            businessName,
            businessId,
            businessModule: [],
            dataModuleSelectKey: 'ROUTER_INTERFACE_TRAFFIC',
            apiValue: '',
            radixValue: '',
            checkBoxValue: [],
            targetName: '',
            target: '',
            unit: '',
            businessModuleSelectKey: this.props.query.moduleId || '',
            plainOptions: [],
            apiResult: [],
            switchCheck: false
        };
    }
    @Bind()
    private handleSubmit(event: React.FormEvent<any>): void {
        event.preventDefault();
        const {
            businessId,
            businessModuleSelectKey,
            targetName,
            unit,
            dataModuleSelectKey,
            target,
            apiValue,
            radixValue,
            checkBoxValue
        } = this.state;
        if (
            !(businessModuleSelectKey &&
            targetName &&
            dataModuleSelectKey &&
            unit &&
            (dataModuleSelectKey === 'ROUTER_INTERFACE_TRAFFIC' ? apiValue !== '' : true)
            )
        ) {
            Modal.warning({
                title: '请补全信息'
            });
            return;
        }
        indicatorCreate({
            businessId: +businessId,
            moduleId: businessModuleSelectKey,
            indicatorName: targetName,
            capacityGoal: +target || undefined,
            capacityUnit: unit,
            dataSourceType: dataModuleSelectKey,
            dataSourceMeta: {
                metric: {
                    api: apiValue
                },
                unit_conversion: {
                    radix: radixValue || '1'
                }
            },
            refBusinessIds: checkBoxValue
        }).then((result) => {
            if (result) {
                Modal.success({
                    title: '提交成功',
                    onOk: this.businessModule
                  });
            } else {
                Modal.error({
                    title: '提交失败'
                  });
            }
        }).catch(() => {
            Modal.error({
                title: '提交失败'
              });
        });
    }
    @Bind()
    private assembleBusinessModule(): React.ReactNode {
        return (
            this.state.businessModule.map((item, key) => {
                return (
                    <Select.Option value={ item.value } key={ item.value }>{ item.name }</Select.Option>
                );
            })
        );
    }
    @Bind()
    private checkboxChange(checkBoxValue): void {
        this.setState({
            checkBoxValue
        });
    }
    @Bind()
    private dataModuleChange(key): void {
        this.setState({
            dataModuleSelectKey: key
        });
    }
    @Bind()
    private businessModuleChange(key): void {
        this.setState({
            businessModuleSelectKey: key,
            cardLoading: true,
            apiValue: ''
        }, async () => {
            const apiResult = await this.fetchModuleApis(this.state.businessModuleSelectKey);
            this.apiResult = apiResult;
            this.setState({
                cardLoading: false,
                apiResult
            });
        });
    }
    @Bind()
    private apiChange(value): void {
        const apiResult = this.apiResult.filter((item) => {
            return (
                item.toLowerCase().indexOf(value.trim().toLowerCase()) !== -1
            );
        });
        this.setState({
            apiValue: value,
            apiResult
        });
    }
    @Bind()
    private apiSelect(value, Option): void {
        this.setState({
            apiValue: value
        });
    }
    @Bind()
    private targetNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            targetName: event.currentTarget.value
        });
    }
    @Bind()
    private radixChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            radixValue: event.currentTarget.value
        });
    }
    @Bind()
    private targetChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            target: event.currentTarget.value
        });
    }
    @Bind()
    private unitChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            unit: event.currentTarget.value
        });
    }
    /**
     * 反回业务模块
     */
    @Bind()
    private businessModule(): void {
        const { businessId, businessName } = this.state;
        this.props.backToComplianceRate({
            businessId,
            businessName
        });
    }
    @Bind()
    private async fetchModuleApis(moduleId: string) {
        return await cqiModuleApis({}, moduleId);
    }
    @Bind()
    private switchChange(event) {
        this.setState({
            switchCheck: event.target.checked
        });
    }
    @Bind()
    private keyDown(event: React.KeyboardEvent<HTMLFormElement>) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    }
    public async componentWillMount() {
        const businessOptionsResult = await businessOptions({});
        const plainOptions = businessOptionsResult.filter((item) => {
            return item['name'] !== this.props.query['businessName'];
        });
        if (this.props.query.moduleName) {
            const { moduleId, moduleName } = this.props.query;
            const apiResult = await this.fetchModuleApis(moduleId);
            const businessModule = [
                {
                    name: moduleName,
                    value: moduleId
                }
            ];
            this.apiResult = apiResult;
            this.setState({
                cardLoading: false,
                businessModule,
                plainOptions,
                apiResult
            });
        } else {
            modulesOptions({}, this.props.query.businessId).then((result) => {
                this.setState({
                    cardLoading: false,
                    businessModule: result,
                    plainOptions
                });
            });
        }
    }
    public render(): React.ReactNode {
        const dataModule: string[] = [
            'ROUTER_INTERFACE_TRAFFIC',
            'ROUTER_SERVICE_TRAFFIC'
        ];

        return (
            <div className={ style.establishCapacity }>
                <Spin
                    spinning={ this.state.cardLoading }
                    size="large"
                >
                    <Card
                        bordered={ false }
                        title="新建容量指标"
                    >
                        <Form onSubmit={ this.handleSubmit } onKeyDown={ this.keyDown }>
                            <Form.Item
                                required={ true }
                                label="指标名称"
                                labelCol={ {span: 2, offset: 5} }
                                wrapperCol={ {span: 12} }
                            >
                                <Input
                                    value={ this.state.targetName }
                                    onChange={ this.targetNameChange }
                                />
                            </Form.Item>
                            <Form.Item
                                label="业务线"
                                required={ true }
                                labelCol={ {span: 2, offset: 5} }
                                wrapperCol={ {span: 12} }
                            >
                                <Select defaultValue={ this.state.businessId }>
                                    <Select.Option
                                        value={ this.state.businessId }
                                    >
                                    { this.state.businessName }
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                required={ true }
                                label="业务模块"
                                labelCol={ {span: 2, offset: 5} }
                                wrapperCol={ {span: 12} }
                            >
                                <Select
                                    value={
                                        this.state.businessModuleSelectKey
                                    }
                                    onChange={ this.businessModuleChange }
                                >
                                    {
                                        this.assembleBusinessModule()
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                required={ true }
                                label="数据来源"
                                labelCol={ {span: 2, offset: 5} }
                                wrapperCol={ {span: 12} }
                            >
                                <Select value={ this.state.dataModuleSelectKey } onChange={ this.dataModuleChange }>
                                    {
                                        dataModule.map((item, index) => {
                                            return (
                                                <Select.Option key={ item } value={ item }>{ item }</Select.Option>
                                            );
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={ {span: 12, offset: 7} }
                            >
                                <div className={ style.metric }>
                                    {
                                        this.state.dataModuleSelectKey === 'ROUTER_INTERFACE_TRAFFIC'
                                            &&
                                        <Row>
                                            <Col span={ 2 } className={ style.metricLabel }>
                                                <span>接口:</span>
                                            </Col>
                                            <Col span={ 22 }>
                                                <AutoComplete
                                                    dataSource={ this.state.apiResult }
                                                    value={ this.state.apiValue }
                                                    onChange={ this.apiChange }
                                                    onSelect={ this.apiSelect }
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    <Row>
                                        <Col span={ 5 } className={ style.metricLabel }>
                                            <Checkbox
                                                onChange={ this.switchChange }
                                                value={ this.state.switchCheck }
                                            />
                                            <span >数据换算:</span>
                                        </Col>
                                        <Col span={ 1 }>
                                            <Tooltip
                                                placement="right"
                                                title={
                                                    <div>
                                                        <div>数据换算说明:</div>
                                                        <div>原始数据 * 换算系数 = 换算数据</div>
                                                        <div>举例:</div>
                                                        <div>发单峰值 * 换算系数 = 日订单</div>
                                                    </div>
                                                }
                                            >
                                                <Icon
                                                    className={ style.questionCircle }
                                                    type="question-circle"
                                                />
                                            </Tooltip>
                                        </Col>
                                        <Col span={ 18 }>
                                            {
                                                this.state.switchCheck &&
                                                <Input
                                                    value={ this.state.radixValue }
                                                    onChange={ this.radixChange }
                                                    placeholder="请填写系数，默认为1"
                                                />
                                            }
                                        </Col>
                                    </Row>
                                </div>
                            </Form.Item>
                            <Form.Item
                                label="数据单位"
                                required={ true }
                                labelCol={ {span: 2, offset: 5} }
                                wrapperCol={ {span: 12} }
                            >
                                <Input
                                    placeholder={
                                        this.state.dataModuleSelectKey === 'ROUTER_INTERFACE_TRAFFIC'
                                        ? 'req/min 或者 QPS' : 'w/min'
                                    }
                                    value={ this.state.unit }
                                    onChange={ this.unitChange }
                                />
                            </Form.Item>
                            <Form.Item
                                label="目标容量"
                                labelCol={ {span: 2, offset: 5} }
                                wrapperCol={ {span: 12} }
                            >
                                <Input
                                    placeholder="容量摸底时可为空"
                                    value={ this.state.target }
                                    onChange={ this.targetChange }
                                />
                            </Form.Item>
                            {
                                this.state.plainOptions.length
                                    ?
                                <Form.Item
                                    label="关联业务线"
                                    labelCol={ {span: 2, offset: 5} }
                                    wrapperCol={ {span: 12} }
                                >
                                    <Checkbox.Group className={ style.checkbox } onChange={ this.checkboxChange }>
                                        <Row>
                                            {
                                                this.state.plainOptions.map((item) => {
                                                    return (
                                                        <Col
                                                            key={ item['value'] }
                                                            span={ 6 }
                                                        >
                                                            <Checkbox
                                                                value={ item['value'] }
                                                            >
                                                                { item['name'] }
                                                            </Checkbox>
                                                        </Col>
                                                    );
                                                })
                                            }
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                    :
                                ''
                            }
                            <Row>
                                <Col offset={ 11 } span={ 1 }>
                                    <Form.Item>
                                        <Button size="large" onClick={ this.businessModule } >取消</Button>
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
            </div>
        );
    }
}
