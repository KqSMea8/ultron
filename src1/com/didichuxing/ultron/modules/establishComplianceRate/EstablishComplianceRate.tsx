import MEstablishComplianceRate from '@ultron/modules/establishComplianceRate/MEstablishComplianceRate';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import { Bind } from 'lodash-decorators';
import CapacityReport from '@ultron/components/capacityReport/CapacityReport';
import EstablishReport from './establishReport/EstablishReport';
import EstablishCapacity from '@ultron/components/establishCapacity/EstablishCapacity';
import ReviseCapacity from './reviseCapacity/ReviseCapacity';
import React from 'react';
import { observer } from 'mobx-react';
import Icon from '@antd/icon';
import Spin from '@antd/spin';
import Menu from '@antd/menu';
import Layout from '@antd/layout';
import style from './EstablishComplianceRate.less';

@observer
export default class EstablishComplianceRate extends AModule<MEstablishComplianceRate> {
    protected createModel(): MEstablishComplianceRate {
        return new MEstablishComplianceRate(this.query);
    }
    @Bind()
    private handleClick(e) {
        if (e.key === 'capacityReport') {
            const query = {
                module: 'capacityReport'
            };
            this.push({url: '/ultron/capacity/establish', query});
            this.model.changeSelectedKey('capacityReport');
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
    private goToCapacityReport() {
        this.model.changeSelectedKey('capacityReport');
    }
    /**
     * 跳容量报告页
     */
    @Bind()
    private changeSelectedKey(key) {
        this.model.changeSelectedKey(key);
    }
    @Bind()
    private backToComplianceRate(data) {
        const query = {
            type: 'complianceRate',
            businessId: data['businessId'],
            businessName: data['businessName']
        };
        this.push({url: '/ultron/capacity/target', query});
    }
    /**
     * 跳业务详情
     */
    @Bind()
    private goToBusinessDetails(reportId, groupName: string): void {
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
    private historyReplace(param) {
        this.replace(param);
    }

    public render(): React.ReactNode {
        let mainRight: React.ReactNode;
        switch (this.model.selectedKey) {
            case 'capacityReport':
                mainRight = (
                    <CapacityReport
                        changeSelectedKey={ this.changeSelectedKey }
                        goToBusinessDetails={ this.goToBusinessDetails }
                    />
                );
                break;
            case 'establishReport':
                mainRight = (
                    <EstablishReport
                        changeSelectedKey={ this.changeSelectedKey }
                        goToCapacityReport={ this.goToCapacityReport }
                    />
                );
                break;
            case 'reviseCapacity':
                mainRight = (
                    <ReviseCapacity replace={ this.historyReplace } fatherQuery={ this.model.query }/>
                    );
                break;
            default:
                mainRight = (
                    <EstablishCapacity
                        query={ this.model.query }
                        backToComplianceRate={ this.backToComplianceRate }
                    />
                );
                break;
        }
        return (
            <Layout style={ {minHeight: this.model.layoutHeight} }>
                <Spin
                    spinning={ this.model.loading }
                    size="large"
                    wrapperClassName={ style.spin }
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
                                {
                                    mainRight
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
