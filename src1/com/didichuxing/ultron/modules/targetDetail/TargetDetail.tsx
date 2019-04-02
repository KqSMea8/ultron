import ModelTargetDetail from '@ultron/modules/targetDetail/MTargetDetail';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import { Bind } from 'lodash-decorators';
import ComplianceRate from '@ultron/components/complianceRate/ComplianceRate';
import CapacityMarketCard from '@ultron/components/capacityMarketCard/CapacityMarketCard';
import AddPressureHistory from './addPressureHistory/AddPressureHistory';
import React from 'react';
import { observer } from 'mobx-react';
import Layout from '@antd/layout';
import Tabs from '@antd/tabs';
import Icon from '@antd/icon';
import Button from '@antd/button';
import Spin from '@antd/spin';
import Menu from '@antd/menu';
import Row from '@antd/row';
import Select from '@antd/select';
import Col from '@antd/col';
import Tag from '@antd/tag';
import Breadcrumb from '@antd/breadcrumb';
import Timeline from '@antd/timeline';
import style from './TargetDetail.less';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import moment from 'moment';
const { Sider } = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const aa = (percent) => `${percent}`;

const ObsSelectYear = bindObserver(Select, 'time', 'value');

@observer
export default class TargetDetail extends AModule<ModelTargetDetail> {
    protected createModel(): ModelTargetDetail {
        return new ModelTargetDetail(this.query);
    }
    @Bind()
    private handleClick(e) {
        if (e.key === 'capacityReport') {
            const query = {
                module: 'capacityReport'
            };
            this.push({url: '/ultron/capacity/establish', query});
        } else {
            const query = {
                type: this.model.type,
                businessId: e.key,
                businessName: e.item.props.children
            };
            this.push({url: '/ultron/capacity/target', query});
            this.model.changeMenuSelectedKeys(e.key, e.item.props.children);
        }
    }
    /**
     * 跳业务详情
     */
    @Bind()
    private goToBusinessDetails(event: React.MouseEvent<HTMLAnchorElement>): void {
        event.stopPropagation();
        const dataSet: any = event.currentTarget.dataset;
        const reportId: number = +dataSet['reportid'];
        const groupName: string = dataSet['groupname'];
        this.push({ url: '/ultron/businessDetails', query: {
            reportId: reportId,
            groupName
        } });
    }
    @Bind()
    private executeMenuItem() {
        return this.model.businessOptionsData.map((item, index) => {
            return (
                <Menu.Item key={ item.value }>{ item.name }</Menu.Item>
            );
        });
    }
    @Bind()
    private selectTime(val): void {
        this.model.setTime(val);
    }
    @Bind()
    private targetDetail(): void {
        const query = {
            type: 'complianceRate',
            businessId: this.model.businessId,
            businessName: this.model.businessName
        };
        this.push({url: '/ultron/capacity/target', query});
    }
    @Bind()
    private moduleDetail(): void {
        const query = {
            businessId: this.model.businessId,
            businessName: this.model.businessName,
            name: this.model.moduleName,
            id: this.model.moduleId
        };
        this.push({url: '/ultron/capacity/moduleDetail', query});
    }
    @Bind()
    private bindRelationBusiness(it): void {
        const query = {
            type: 'complianceRate',
            businessId: String(it.value),
            businessName: it.name
        };
        this.push({url: '/ultron/capacity/target', query});
    }
    @Bind()
    private addPressureHistory(isAddPressureHistory: any): void {
        const isAddPressureHistoryBoolean = isAddPressureHistory === false ? false : true;
        this.model.addPressureHistory(isAddPressureHistoryBoolean);
    }
    /**
     *  更新压测历史
     */
    @Bind()
    private updataHistory(): void {
        this.model.getHistory();
    }
    public componentDidMount(): void {
        this.model.getTargetDetail();
        this.model.getTargetDetailEcharts();
        this.model.getHistory();
    }

    public render(): React.ReactNode {
        return (
            <Layout>
                <Spin
                    spinning={ this.model.loading }
                    size="large"
                    wrapperClassName={ style.spinWrapper }
                >
                    <div className={ style.main }>
                        <Layout.Sider
                            className={ style.layoutSider }
                        >
                            <Menu
                                theme="dark"
                                onClick={ this.handleClick }
                                style={ { width: 200 } }
                                className={ style.Menu }
                                selectedKeys={ [this.model.businessId] }
                                mode="inline"
                            >
                                <Menu.SubMenu
                                    key="business"
                                    title={ <span><Icon type="ordered-list" /><span>业务线</span></span> }
                                >
                                    { this.executeMenuItem() }
                                </Menu.SubMenu>
                                <Menu.Item key="capacityReport">
                                    <Icon type="solution" />
                                    <span>容量报告</span>
                                </Menu.Item>
                            </Menu>
                        </Layout.Sider>
                        <Layout className={ style.layoutContent }>
                        <Layout.Content >
                            <div className={ style.mainRight }>
                                <div className={ style.title }>
                                    <div className={ style.titleLeft }>
                                        <Breadcrumb separator=">">
                                            <Breadcrumb.Item>
                                                <span
                                                    style={ { fontSize: '12px', cursor: 'pointer'} }
                                                    onClick={ this.targetDetail }
                                                    className={ style.resBusinessName }
                                                >
                                                    { this.model.resBusinessName }
                                                </span>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <span
                                                    style={ { fontSize: '12px', cursor: 'pointer'} }
                                                    onClick={ this.moduleDetail }
                                                    className={ style.moduleName }
                                                >
                                                    { this.model.moduleName }
                                                </span>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <span style={ { fontSize: '12px'} } className={ style.indicatorName }>
                                                    { this.model.indicatorName }
                                                </span>
                                            </Breadcrumb.Item>
                                        </Breadcrumb>
                                    </div>
                                    <div className={ style.titleRight }>
                                        {
                                            this.model.relation.length > 0 ? <span>关联业务线：</span> : null
                                        }
                                        {
                                            this.model.relation.map((item, index ) => {
                                                const relationBusiness = () => {
                                                    return (
                                                        this.bindRelationBusiness(item)
                                                    );
                                                };
                                                return (
                                                    <Tag
                                                        color="blue"
                                                        key={ index }
                                                        onClick={ relationBusiness }
                                                    >
                                                        { item.name }
                                                    </Tag>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                                <h4 style={ { marginTop: '10px'} }>容量指标</h4>
                                <div className={ style.echarts }>
                                    <div className={ style.echartsTop }>
                                        <Row style={ { marginTop: '15px'} }>
                                            <span className={ style.echartsTopLeft }>
                                                目标容量
                                            </span>
                                            <div className={ style.wai }>
                                                <div className={ style.nei } style={ { width: this.model.goalWid } }>
                                                    {
                                                        this.model.goal.goal && Number(this.model.goal.goal) !== 0 ? (
                                                            <span>
                                                                {
                                                                    this.model.goal.goal ? (
                                                                        Number(this.model.goal.goal)
                                                                        .toLocaleString('en-US')
                                                                    ) : null
                                                                }&nbsp;
                                                                {
                                                                    this.model.goal.unit
                                                                }
                                                            </span>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                            <span className={ style.echartsTopRight }>
                                                {
                                                    this.model.goal.createTime ? (
                                                        moment(this.model.goal.createTime * 1000).format('YYYY-MM-DD')
                                                    ) : null
                                                }
                                            </span>
                                        </Row>
                                        <Row style={ { marginTop: '15px'} }>
                                            <span className={ style.echartsTopLeft }>
                                                生产容量
                                            </span>
                                            <div className={ style.wai }>
                                                <div className={ style.nei } style={ { width: this.model.prodWid } }>
                                                    {
                                                        this.model.prod.capacityActual
                                                        && Number(this.model.prod.capacityActual) !== 0 ? (
                                                            <span>
                                                                {
                                                                    this.model.prod.capacityActual ? (
                                                                        Number(this.model.prod.capacityActual)
                                                                            .toLocaleString('en-US')
                                                                    ) : null
                                                                }&nbsp;
                                                                {
                                                                    this.model.prod.capacityUnit
                                                                }
                                                            </span>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                            <span className={ style.echartsTopRight }>
                                                { this.model.prod.createTime ?
                                                    moment(this.model.prod.createTime * 1000)
                                                    .format('YYYY-MM-DD') : null
                                                }
                                            </span>
                                            <span
                                                className={ style.echartsTopRightName }
                                                onClick={ this.goToBusinessDetails }
                                                data-reportid={ this.model.prod.reportId }
                                                data-groupname={ this.model.prod.dataTypeDesc }
                                            >
                                                {
                                                    this.model.prod.dataTypeDesc ? (
                                                        this.model.prod.dataTypeDesc
                                                    ) : null
                                                }
                                            </span>
                                        </Row>
                                        <Row style={ { marginTop: '15px'} }>
                                            <span className={ style.echartsTopLeft }>
                                                压测容量
                                            </span>
                                            <div className={ style.wai }>
                                                <div className={ style.nei } style={ { width: this.model.testWid } }>
                                                    {
                                                        this.model.test.capacityActual
                                                        && Number(this.model.test.capacityActual) !== 0 ? (
                                                            <span>
                                                                {
                                                                    this.model.test.capacityActual &&
                                                                    Number(this.model.test.capacityActual)
                                                                        .toLocaleString('en-US')
                                                                }&nbsp;
                                                                {
                                                                    this.model.test.capacityUnit
                                                                }
                                                            </span>
                                                        ) : null
                                                    }
                                                </div>
                                            </div>
                                            <span className={ style.echartsTopRight }>
                                                { this.model.test.createTime ?
                                                    moment(this.model.test.createTime * 1000)
                                                    .format('YYYY-MM-DD') : null
                                                }
                                            </span>
                                            <span
                                                className={ style.echartsTopRightName }
                                                onClick={ this.goToBusinessDetails }
                                                data-reportid={ this.model.test.reportId }
                                                data-groupname={ this.model.test.dataTypeDesc }
                                            >
                                                {
                                                    this.model.test.dataTypeDesc ? (
                                                        this.model.test.dataTypeDesc
                                                    ) : null
                                                }
                                            </span>
                                        </Row>
                                        <Row>
                                            <div className={ style.line }>&nbsp;</div>
                                        </Row>
                                    </div>
                                    <div className={ style.echartsBottom }>
                                        <div className={ style.echartsBottomLeft }>
                                            <p>
                                                {
                                                    this.model.leftTime
                                                }&nbsp;&nbsp;
                                                {
                                                    this.model.leftTitle
                                                }
                                            </p>
                                            <EChartSimple data={ this.model.echartsData } height={ 300 }/>
                                        </div>
                                        <div className={ style.echartsBottomRight }>
                                            <p>
                                                {
                                                    this.model.rightTime
                                                }&nbsp;&nbsp;
                                                {
                                                    this.model.rightTitle
                                                }
                                            </p>
                                            <EChartSimple data={ this.model.echartsDatas } height={ 300 }/>
                                        </div>
                                    </div>
                                </div>
                                <div className={ style.historyTime }>
                                    <h4 style={ { marginTop: '20px'} }>容量历史</h4>
                                    <div className={ style.year }>
                                        <Button
                                            className={ style.addPressureHistory }
                                            shape="circle"
                                            icon="plus"
                                            onClick={ this.addPressureHistory }
                                        />
                                        <ObsSelectYear
                                            onChange={ this.selectTime }
                                            model={ this.model }
                                            style={ { width: '100px'} }
                                        >
                                            <Option value="15552000000">近半年</Option>
                                            <Option value="7776000000">近三个月</Option>
                                        </ObsSelectYear>
                                    </div>
                                </div>
                                <div className={ style.history }>
                                    <Timeline>
                                        {
                                            this.model.historyArr.length > 0 ? (
                                                this.model.historyArr.slice().sort((a, b) => {
                                                    return (
                                                        b['createTime'] - a['createTime']
                                                    );
                                                }).map((item, index) => {
                                                    let wid = '0%';
                                                    if ( Math.ceil(item.actual / this.model.goals * 100) > 100) {
                                                        wid = String(100) + '%';
                                                    } else {
                                                        wid
                                                        = String(Math.ceil(item.actual / this.model.goals * 100)) + '%';
                                                    }
                                                    return (
                                                        <Timeline.Item key={ index }>
                                                            <Row>
                                                                <Col span={ 2 }>
                                                                    <span style={ { fontSize: '12px'} }>
                                                                        {
                                                                            moment(item.createTime * 1000)
                                                                            .format('YYYY-MM-DD')
                                                                        }
                                                                    </span>
                                                                </Col>
                                                                <Col span={ 5 }>
                                                                    <span
                                                                        className={ style.timeLine }
                                                                        style={ { fontSize: '12px', cursor: 'pointer'} }
                                                                        onClick={ this.goToBusinessDetails }
                                                                        data-reportid={ item.reportId }
                                                                        data-groupname={ item.dataTypeDesc }
                                                                    >
                                                                        {
                                                                            item.dataTypeDesc
                                                                        }
                                                                    </span>
                                                                </Col>
                                                                <Col span={ 4 }>
                                                                    <span style={ { fontSize: '12px'} }>
                                                                        {
                                                                            item.cluster
                                                                        }
                                                                    </span>
                                                                </Col>
                                                                <Col>
                                                                    <div className={ style.wai }>
                                                                        <div
                                                                            className={ style.nei }
                                                                            style={ { width: wid } }
                                                                        >
                                                                            <span style={ { fontSize: '12px' } }>
                                                                                {
                                                                                    Number(item.actual)
                                                                                    .toLocaleString('en-US')
                                                                                }&nbsp;
                                                                                {
                                                                                    item.unit
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Timeline.Item>
                                                    );
                                                })
                                            ) : (
                                                <Row
                                                    className={ style.noData }
                                                >
                                                    暂无数据
                                                </Row>
                                            )
                                        }
                                    </Timeline>
                                </div>
                            </div>
                        </Layout.Content>
                        </Layout>
                    </div>
                </Spin>
                {
                    this.model.isAddPressureHistory &&
                    <AddPressureHistory
                        isAddPressureHistory={ this.model.isAddPressureHistory }
                        addPressureHistory={ this.addPressureHistory }
                        updataHistory={ this.updataHistory }
                        indicatorName={ this.model.indicatorName }
                        id={ this.model.id }
                        unit={ this.model.goal.unit }
                    />
                }
            </Layout>
        );
    }
}
