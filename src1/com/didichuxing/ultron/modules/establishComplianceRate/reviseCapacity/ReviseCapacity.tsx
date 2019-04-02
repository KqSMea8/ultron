import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Icon, Input, AutoComplete, Modal, Button, Switch, Card, Form, Row, Col, Checkbox, Spin, Select } from 'antd';
import Tooltip from '@antd/tooltip';
import { businessOptions, cqiIndicatorUpdate, cqiModuleApis, cqiIndicatorDetail } from '@ultron/remote/plate';
import style from './ReviseCapacity.less';
import { observer } from 'mobx-react';
import { Bind } from 'lodash-decorators';

interface IReviseCapacityProps  {
    replace(param);
    fatherQuery;
}

interface IReviseCapacityState {
    cardLoading: boolean;
    businessName: string;
    businessId: number;
    dataModuleSelectKey: string;
    apiValue: string;
    radixValue: string;
    checkBoxValue: number[];
    targetName: string;
    target: string;
    unit: string;
    businessModuleSelectKey: string;
    moduleId?: number;
    plainOptions;
    apiResult;
    switchCheck: boolean;
    indicatorId?: number;
}
@observer
export default class ReviseCapacity extends React.Component<IReviseCapacityProps, IReviseCapacityState> {
    private apiResult: any[] | null = null;
    constructor(props: IReviseCapacityProps, context?: IReviseCapacityState) {
        super(props, context);
        this.state = {
            cardLoading: true,
            businessName: '',
            businessId: 0,
            dataModuleSelectKey: 'ROUTER_INTERFACE_TRAFFIC',
            apiValue: '',
            radixValue: '',
            checkBoxValue: [],
            targetName: '',
            indicatorId: undefined,
            target: '',
            unit: '',
            businessModuleSelectKey: '',
            moduleId: undefined,
            plainOptions: [],
            apiResult: [],
            switchCheck: false
        };
    }
    @Bind()
    private handleSubmit(event: React.FormEvent<any>): void {
        event.preventDefault();
        const {
            indicatorId,
            businessId,
            moduleId,
            targetName,
            unit,
            dataModuleSelectKey,
            target,
            apiValue,
            radixValue,
            checkBoxValue
        } = this.state;
        if (
            !(
            targetName &&
            unit &&
            (dataModuleSelectKey === 'ROUTER_INTERFACE_TRAFFIC' ? apiValue !== '' : true)
            )
        ) {
            Modal.warning({
                title: '请补全信息'
            });
            return;
        }
        cqiIndicatorUpdate({
            businessId: businessId,
            moduleId,
            indicatorName: targetName,
            capacityGoal: +target,
            capacityUnit: unit,
            dataSourceType: dataModuleSelectKey,
            dataSourceMeta: {
                metric: {
                    api: apiValue,
                    data_source: 'srm'
                },
                unit_conversion: {
                    radix: radixValue || '1'
                }
            },
            refBusinessIds: checkBoxValue
        }, indicatorId).then((result) => {
            if (result) {
                Modal.success({
                    title: '提交成功',
                    onOk: this.replace
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
    private checkboxChange(checkBoxValue): void {
        this.setState({
            checkBoxValue
        });
    }
    @Bind()
    private dataModuleChange(key): void {
        this.setState({
            dataModuleSelectKey: key,
            cardLoading: true
        }, async () => {
            if (!Array.isArray(this.apiResult) && key === 'ROUTER_INTERFACE_TRAFFIC') {
                const apiResult = await this.fetchModuleApis(this.state.moduleId as number);
                this.apiResult = apiResult;
                this.setState({
                    apiResult,
                    cardLoading: false
                });
            } else {
                this.setState({
                    cardLoading: false
                });
            }
        });
    }
    @Bind()
    private apiChange(value): void {
        const apiResult = this.apiResult && this.apiResult.filter((item) => {
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
     * 返回入口页面
     */
    @Bind()
    private replace(): void {
        let query;
        if (this.props.fatherQuery.fatherPathname === '/ultron/capacity/target') {
            query = {
                type: 'complianceRate',
                businessId: this.props.fatherQuery['businessId'],
                businessName: this.props.fatherQuery['businessName']
            };
        } else if (this.props.fatherQuery.fatherPathname === '/ultron/capacity/moduleDetail') {
            query = {
                type: 'complianceRate',
                businessId: this.props.fatherQuery['businessId'],
                businessName: this.props.fatherQuery['businessName'],
                name: this.props.fatherQuery['name'],
                id: this.props.fatherQuery['id']
            };
        }
        this.props.replace({url: this.props.fatherQuery.fatherPathname, query});
    }
    @Bind()
    private async fetchModuleApis(moduleId: number) {
        return await cqiModuleApis({}, moduleId);
    }
    @Bind()
    private switchChange(event) {
        this.setState({
            switchCheck: event.target.checked
        });
    }
    public async componentWillMount() {
        cqiIndicatorDetail({}, this.props.fatherQuery.indicatorId).then(async (result: any) => {
            const {
                indicatorName, businessName, businessId, indicatorId,
                moduleName, moduleId, dataSourceType, goal, relation, dataSourceMeta
            } = result;

            /**
             * 解析dataSourceMeta
             */
            const dataSourceMetaObj = JSON.parse(dataSourceMeta.replace(/\\/g, ''));

            /**
             * 获取api下拉数据
             */
            if (dataSourceType === 'ROUTER_INTERFACE_TRAFFIC') {
                this.apiResult = await this.fetchModuleApis(moduleId);
            }

            /**
             * 获取全部业务线
             */
            const businessOptionsResult = await businessOptions({});
            const plainOptions = businessOptionsResult.filter((item) => {
                return item['value'] !== businessId;
            });

            /**
             * 当前业务线
             */
            const checkBoxValue: number[] = [];
            for ( const i in relation) {
                if (true) {
                    checkBoxValue.push(relation[i]);
                }
            }
            this.setState({
                cardLoading: false,
                indicatorId,
                targetName: indicatorName,
                businessName,
                businessId,
                moduleId,
                businessModuleSelectKey: moduleName,
                dataModuleSelectKey: dataSourceType,
                target: String(goal['goal']),
                unit: String(goal['unit']),
                checkBoxValue,
                apiResult: this.apiResult || [],
                plainOptions,
                apiValue: dataSourceMetaObj.metric && dataSourceMetaObj.metric.api,
                radixValue: dataSourceMetaObj.unit_conversion && dataSourceMetaObj.unit_conversion.radix,
                switchCheck: !!(dataSourceMetaObj.unit_conversion && dataSourceMetaObj.unit_conversion.radix)
            });
        });
    }
    public render(): React.ReactNode {
        const dataModule: string[] = [
            'ROUTER_INTERFACE_TRAFFIC',
            'ROUTER_SERVICE_TRAFFIC'
        ];

        return (
            <div className={ style.reviseCapacity }>
                <Spin
                    spinning={ this.state.cardLoading }
                    size="large"
                >
                    <Card
                        bordered={ false }
                        title="修改容量指标"
                    >
                        <Form onSubmit={ this.handleSubmit }>
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
                                <Select value={ this.state.businessId }>
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
                                >
                                    <Select.Option value={ this.state.businessModuleSelectKey } >
                                        { this.state.businessModuleSelectKey }
                                    </Select.Option>
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
                                                checked={ this.state.switchCheck  }
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
                                labelCol={ {span: 2, offset: 5} }
                                wrapperCol={ {span: 12} }
                                className={ style.unit }
                            >
                                <Input
                                    value={ this.state.unit }
                                    onChange={ this.unitChange }
                                />
                            </Form.Item>
                            <Form.Item
                                label="目标容量"
                                labelCol={ {span: 2, offset: 5} }
                                wrapperCol={ {span: 12} }
                                className={ style.target }
                            >
                                <Input
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
                                    <Checkbox.Group
                                        className={ style.checkbox }
                                        value={ this.state.checkBoxValue }
                                        onChange={ this.checkboxChange }
                                    >
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
                                        <Button size="large" onClick={ this.replace } >取消</Button>
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
