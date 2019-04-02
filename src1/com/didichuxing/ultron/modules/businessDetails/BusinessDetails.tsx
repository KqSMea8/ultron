import ModelBusinessDetails from './ModelBusinessDetails';
import {AModule} from 'com/didichuxing/commonInterface/AModule';
import TabContent from '@ultron/components/tabContent/TabContent';
import React from 'react';
import { observer } from 'mobx-react';
import { Bind } from 'lodash-decorators';
import { Menu, Spin, Icon, Layout, Tabs, Breadcrumb } from 'antd';
import moment from 'moment';
import style from './BusinessDetails.less';

@observer
export default class BusinessDetails extends AModule<ModelBusinessDetails> {
    protected createModel(): ModelBusinessDetails {
        return new ModelBusinessDetails(this.query);
    }

    /**
     * 更新topType
     */
    @Bind()
    private updataDetailData(topType) {
        this.model.updataDetailData(topType);
    }
    /**
     * 获取对话框数据
     */
    @Bind()
    private async getModalData(metricId) {
        await this.model.getModalData(metricId);
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
    /**
     * 跳容量报告页
     */
    @Bind()
    private goToCapacityReport() {
        const query = {
            module: 'capacityReport'
        };
        this.push({url: '/ultron/capacity/establish', query});
    }
    public render(): React.ReactNode {
        const params = this.model.params;
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
                                selectedKeys={ [this.model.selectedKey] }
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
                                <Breadcrumb
                                    separator=">"
                                    className={ style.breadcrumb }
                                >
                                    <Breadcrumb.Item >
                                        <span
                                            onClick={ this.goToCapacityReport }
                                            className={ style.capacityReportBreadcrumb }
                                        >
                                            容量报告
                                        </span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item >
                                        <span>
                                            { this.model.query.groupName }
                                        </span>
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                {
                                    Object.keys(params).length
                                        ?
                                    <div className={ style.spin }>
                                        <div className={ style.businessDetails }>
                                            <div className={ style.businessDetailsTitle }>
                                                { params['groupName'] }
                                            </div>
                                            <div className={ style.businessDetailsTime }>
                                                { params['dataTypeDesc'] }
                                                { ' (' }
                                                { moment(params['beginTime'] * 1000).format('YYYY.MM.DD HH.mm') }
                                                { ' ~ ' }
                                                { moment(params['endTime'] * 1000).format('YYYY.MM.DD HH.mm') }
                                                { ')' }
                                            </div>
                                        </div>
                                        {
                                            <Tabs defaultActiveKey={ this.model.defaultKey } animated={ true } >
                                                {
                                                    Object.keys(params['detail']).map((item, index) => {
                                                        return (
                                                            <Tabs.TabPane tab={ item } key={ item }>
                                                                <TabContent
                                                                    updataDetailData={ this.updataDetailData }
                                                                    detailData={ params['detail'][item] }
                                                                    reportId={ this.model.query.reportId }
                                                                    cluster={ item }
                                                                    getModalData={ this.getModalData }
                                                                    modalData={ this.model.modalData }
                                                                />
                                                            </Tabs.TabPane>
                                                        );
                                                    })
                                                }
                                            </Tabs>
                                        }
                                    </div>
                                        :
                                    <div className={ style.noData }>暂无数据</div>
                                }
                            </div>
                        </Layout.Content>
                        </Layout>
                    </div>
                </Spin>
            </Layout>
        );
    }
}
