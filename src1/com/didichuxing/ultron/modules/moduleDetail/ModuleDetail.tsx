import ModelModuleDetail from '@ultron/modules/moduleDetail/MModuleDetail';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import { Bind } from 'lodash-decorators';
import ComplianceRate from '@ultron/components/complianceRate/ComplianceRate';
import React from 'react';
import { observer } from 'mobx-react';
import Layout from '@antd/layout';
import Tabs from '@antd/tabs';
import Icon from '@antd/icon';
import Progress from '@antd/progress';
import Spin from '@antd/spin';
import Menu from '@antd/menu';
import Row from '@antd/row';
import Select from '@antd/select';
import Col from '@antd/col';
import Breadcrumb from '@antd/breadcrumb';
import { Link } from 'react-router-dom';
import Button from '@antd/button';
import Timeline from '@antd/timeline';
import style from './ModuleDetail.less';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import moment from 'moment';
const { Sider } = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const aa = (percent) => `${percent}`;

const ObsSelectYear = bindObserver(Select, 'time', 'value');

@observer
export default class ModuleDetail extends AModule<ModelModuleDetail> {
    protected createModel(): ModelModuleDetail {
        return new ModelModuleDetail(this.query);
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
    private moduleBusiness(): void {
        const query = {
            type: 'businessModule',
            businessId: this.model.businessId,
            businessName: this.model.businessName
        };
        this.push({url: '/ultron/capacity/target', query});
    }
    @Bind()
    private targetDetails(it): void {
        const query = {
            businessId: it.businessId,
            businessName: it.businessName,
            id: it.id
        };
        this.push({url: '/ultron/capacity/targetDetail', query});
    }
    /**
     * 新建容量指标
     */
    @Bind()
    private establishComplianceRate(event) {
        this.push({ url: '/ultron/capacity/establish', query: {
            businessId: this.model.businessId,
            businessName: this.model.businessName,
            moduleId: this.model.id,
            moduleName: this.model.name
        } });
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
    private historyReplace(param) {
        this.replace(param);
    }
    @Bind()
    public childrenRender(it): React.ReactNode {
        return (
            it.records
                ?
                it.records.map((items, index) => {
                    return (
                        <div key={ index } style={ {marginTop: '3px'} }>
                            <span
                                className={ style.childrenRender }
                                data-reportid={ items.reportId }
                                data-groupname={ items.dataTypeDesc }
                                onClick={ this.goToBusinessDetails }
                            >
                                { items.dataTypeDesc }
                            </span>
                        </div>
                    );
                })
                :
                '暂无压测历史'
        );
    }
    public componentDidMount(): void {
        this.model.getEchartsData();
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
                                        <Breadcrumb separator=">">
                                            <Breadcrumb.Item>
                                                <span
                                                    style={ { fontSize: '12px', cursor: 'pointer'} }
                                                    onClick={ this.moduleBusiness }
                                                    className={ style.businessName }
                                                >
                                                    { this.model.businessName }
                                                </span>
                                            </Breadcrumb.Item>
                                            <Breadcrumb.Item>
                                                <span style={ { fontSize: '12px'} } className={ style.modelName }>
                                                    {  this.model.name }
                                                </span>
                                            </Breadcrumb.Item>
                                        </Breadcrumb>
                                    </div>
                                    <div
                                        className={ style.complianceRate }
                                        style={ {
                                            paddingLeft: this.model.complianceRateLeftPadding,
                                            paddingRight: this.model.complianceRateRightPadding
                                        } }

                                    >
                                        {
                                            this.model.datas.map((item, index) => {
                                                return (
                                                    <Row key={ index }>
                                                        {
                                                            <div
                                                                className={ style.complianceRateTitle }
                                                            >
                                                                { item.title }
                                                            </div>
                                                        }
                                                        {
                                                            item.value.map((it, inx) => {
                                                                const targetDetail = () => {
                                                                    this.targetDetails(it);
                                                                };
                                                                const push = (p) => {
                                                                    this.push(p);
                                                                };
                                                                return (
                                                                    <div
                                                                        className={ style.colComplianceRateClassname }
                                                                        key={ inx }
                                                                    >
                                                                        <ComplianceRate
                                                                            targetDetail={ targetDetail }
                                                                            complianceRateIt={ it }
                                                                            isShow={ false }
                                                                            model={ this.model }
                                                                            push={ push }
                                                                            replace={ this.historyReplace }
                                                                            fatherQuery={ this.model.query }
                                                                            childrenRender={ this.childrenRender }
                                                                        />
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </Row>
                                                );
                                            })
                                        }
                                        <Button
                                            className={ style.establishComplianceRate }
                                            onClick={ this.establishComplianceRate }
                                        >
                                            新建容量指标
                                        </Button>
                                    </div>
                                    <div className={ style.historyTime }>
                                        <h4 style={ { marginTop: '5px'} }>容量历史</h4>
                                        <div className={ style.year }>
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
                                        {
                                            this.model.historyData.length > 0 ? (
                                                <Row style={ { marginBottom: '22px'} }>
                                                    <Col span={ 2 }/>
                                                    <Col span={ 5 }/>
                                                    <Col span={ 3 } style={ { marginLeft: '13px'} }>
                                                        <span className={ style.fontBigs }>集群</span>
                                                    </Col>
                                                    <Col span={ 5 }>
                                                        <span className={ style.fontBigs }>访问量（req/min）</span>
                                                    </Col>
                                                    <Col span={ 4 }>
                                                        <span className={ style.fontBigs }>cpu.idle</span>
                                                    </Col>
                                                    <Col span={ 4 }>
                                                        <span className={ style.fontBigs }>mem.used.percent</span>
                                                    </Col>
                                                </Row>
                                            ) : null
                                        }
                                        <Timeline>
                                            {
                                                this.model.historyData.length > 0 ? (
                                                    this.model.historyData.slice().sort((a, b) => {
                                                        return (
                                                            b['beginTime'] - a['beginTime']
                                                        );
                                                    }).map((item, index) => {
                                                        return (
                                                            <Timeline.Item key={ index }>
                                                                <Row>
                                                                    <Col span={ 2 }>
                                                                    <span className={ style.fontBig }>
                                                                        {
                                                                            moment(item.beginTime * 1000)
                                                                            .format('YYYY-MM-DD')
                                                                        }
                                                                    </span>
                                                                </Col>
                                                                <Col span={ 5 }>
                                                                    <a
                                                                        className={
                                                                            `${style.fontBig}${style.fontBigName}`
                                                                        }
                                                                        data-reportid={ item['reportId'] }
                                                                        data-groupname={ item['dataTypeDesc'] }
                                                                        onClick={ this.goToBusinessDetails }
                                                                    >
                                                                        {
                                                                            item.dataTypeDesc
                                                                        }
                                                                    </a>
                                                                </Col>
                                                                <Col span={ 3 }>
                                                                    <span className={ style.fontBig }>
                                                                        {
                                                                            item.detail[0].cluster
                                                                        }
                                                                    </span>
                                                                    </Col>
                                                                    <Col span={ 5 }>
                                                                    <span
                                                                        className={ style.fontBigStyle }
                                                                    >
                                                                        {
                                                                            (
                                                                                item.detail[0].serviceTraffic
                                                                                &&
                                                                                Number(
                                                                                    item.detail[0].serviceTraffic.value
                                                                                    )
                                                                            ) ? (
                                                                                Number(
                                                                                    item.detail[0].serviceTraffic.value
                                                                                    )
                                                                                    .toLocaleString('en-US')
                                                                            ) : '--'
                                                                        }
                                                                    </span>
                                                                    </Col>
                                                                    <Col span={ 3 }>
                                                                    <span
                                                                        className={ style.fontBig }
                                                                        style={ { marginLeft: '8px'} }
                                                                    >
                                                                        {
                                                                            Number(item.detail[0].cpuIdle.value)
                                                                            .toFixed(2) ? (
                                                                                Number(item.detail[0].cpuIdle.value)
                                                                                    .toFixed(2) + '%'
                                                                            ) : '--'
                                                                        }
                                                                    </span>
                                                                    </Col>
                                                                    <Col span={ 4 }>
                                                                    <span
                                                                        className={ style.memFontStyle }
                                                                    >
                                                                        {
                                                                            Number(item.detail[0].memUsedPercent.value)
                                                                                .toFixed(2) ? (
                                                                                Number(
                                                                                    item.detail[0].memUsedPercent.value
                                                                                    )
                                                                                    .toFixed(2) + '%'
                                                                            ) : '--'
                                                                        }
                                                                    </span>
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
            </Layout>
        );
    }
}
