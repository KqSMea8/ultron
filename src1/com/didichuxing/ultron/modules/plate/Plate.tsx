import ModelPlate from '@ultron/modules/plate/ModelPlate';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import { Bind } from 'lodash-decorators';
import ComplianceRate from '@ultron/components/complianceRate/ComplianceRate';
import CapacityMarketCard from '@ultron/components/capacityMarketCard/CapacityMarketCard';
import React from 'react';
import { observer } from 'mobx-react';
import Layout from '@antd/layout';
import Tabs from '@antd/tabs';
import Icon from '@antd/icon';
import Progress from '@antd/progress';
import Spin from '@antd/spin';
import Button from '@antd/button';
import Menu from '@antd/menu';
import Row from '@antd/row';
import Col from '@antd/col';
import style from './Plate.less';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
import moment from 'moment';
const { Sider } = Layout;
const TabPane = Tabs.TabPane;
const aa = (percent) => `${percent}`;

@observer
export default class Plate extends AModule<ModelPlate> {
    protected createModel(): ModelPlate {
        return new ModelPlate(this.query);
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
    private changeMenuSelectedKeys(businessId, businessName) {
        this.model.changeMenuSelectedKeys(businessId, businessName);
    }
    @Bind()
    private tabsonChange(e) {
        const query = {
            type: e,
            businessId: this.model.businessId,
            businessName: this.model.businessName
        };
        this.replace({url: '/ultron/capacity/target', query});
        this.model.changeType(e);
    }
    @Bind()
    private bindTargetDetail(it) {
        const query = {
            businessId: it.businessId,
            businessName: it.businessName,
            id: it.id
        };
        this.replace({url: '/ultron/capacity/targetDetail', query});
    }
    @Bind()
    private bindModuleDetail(it) {
        const query = {
            businessId: this.model.businessId,
            businessName: this.model.businessName,
            name: it.name,
            id: it.id
        };
        this.push({url: '/ultron/capacity/moduleDetail', query});
    }
    @Bind()
    private executeMenuItem() {
        return this.model.businessOptionsData.map((item, index) => {
            return (
                <Menu.Item key={ item.value }>{ item.name }</Menu.Item>
            );
        });
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
    /**
     * 新建容量指标
     */
    @Bind()
    private establishComplianceRate(event) {
        this.push({ url: '/ultron/capacity/establish', query: {
            businessId: this.model.businessId,
            businessName: this.model.businessName
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
                                onClick={ this.goToBusinessDetails }
                                className={ style.childrenRender }
                                data-reportid={ items.reportId }
                                data-groupname={ items.dataTypeDesc }
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
                            <div
                                className={ style.box }
                            >
                                <Tabs
                                    tabPosition="top"
                                    className={ style.tabsText }
                                    onChange={ this.tabsonChange }
                                    defaultActiveKey={ this.model.type }
                                    animated={ true }
                                >
                                    <TabPane tab="核心容量指标" key="complianceRate">
                                        <Button
                                            className={ style.establishComplianceRate }
                                            onClick={ this.establishComplianceRate }
                                        >
                                            新建容量指标
                                        </Button>
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
                                                                        this.bindTargetDetail(it);
                                                                    };
                                                                    const push = (p) => {
                                                                        this.push(p);
                                                                    };
                                                                    return (
                                                                        <div
                                                                            className={
                                                                                    style.colComplianceRateClassname
                                                                                }
                                                                            key={ inx }
                                                                        >
                                                                            <ComplianceRate
                                                                                targetDetail={ targetDetail }
                                                                                complianceRateIt={ it }
                                                                                model={ this.model }
                                                                                childrenRender={ this.childrenRender }
                                                                                isShow={ true }
                                                                                push={ push }
                                                                                replace={ this.historyReplace }
                                                                                fatherQuery={ this.model.query }
                                                                                changeMenuSelectedKey={
                                                                                    this.changeMenuSelectedKeys
                                                                                }
                                                                            />
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </Row>
                                                    );
                                                })
                                            }
                                        </div>
                                    </TabPane>
                                    <TabPane tab="核心业务模块" key="businessModule">
                                        <div
                                            className={ style.spin }
                                            style={ {
                                                paddingLeft: this.model.businessModuleLeftPadding,
                                                paddingRight: this.model.businessModuleRightPadding
                                            } }
                                        >
                                            {
                                                this.model.moduleData.map((item, index) => {
                                                    const moduleDetail = () => {
                                                        this.bindModuleDetail(item);
                                                    };
                                                    return (
                                                        <div
                                                            key={ index }
                                                            className={ style.SpinCol }
                                                            onClick={ moduleDetail }
                                                            style={ { cursor: 'pointer'} }
                                                        >
                                                            <CapacityMarketCard
                                                                paramsItemData={ item }
                                                                model={ this.model }
                                                                complianceRate={ null }
                                                                businessModule={ null }
                                                                isFromPlate={ true }
                                                            />
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Layout.Content>
                        </Layout>
                    </div>
                </Spin>
            </Layout>
        );
    }
}
