import ModelServiceCapacityConfig from '@ultron/modules/serviceCapacity/ModelServiceCapacity';
import {AModule} from 'com/didichuxing/commonInterface/AModule';
import React from 'react';
import { observer } from 'mobx-react';
import Layout from '@antd/layout';
import style from './Service.less';
import SubMenu from '@ultron/modules/pressureTestMarket/SubMenu';
import { Bind } from 'lodash-decorators';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
const { Sider } = Layout;

@observer
export default class ServiceCapacityConfig extends AModule<ModelServiceCapacityConfig> {
    protected createModel(): ModelServiceCapacityConfig {
        return new ModelServiceCapacityConfig(this.query);
    }

    @Bind()
    private pushTo(key: string): void {
        this.push({ url: key });
    }

    public render(): React.ReactNode {
        return (
            <div>
                <div className={ style.navigationTree }>
                    <Layout>
                        <Sider>
                            <SubMenu pushTo={ this.pushTo }/>
                        </Sider>
                    </Layout>
                </div>
                <div className={ style.detailRight }>
                    { this.model.params.map((elem) => (
                        <div key={ elem.businessName } className={ style.box }>
                            <div className={ style.broaderDetailTab }>{ elem.businessName }</div>
                            { elem.modules.map((val) => (
                                <div key={ val.moduleName } className={ style.broaderListLabel }>
                                    <div className={ style.h3 }>{ val.moduleName }</div>
                                    <div className={ style.occupiedBox }>
                                        <EChartSimple
                                            data={
                                                this.model.createOption({
                                                    one: val.estimateCapacity, two: val.actualCapacity, three: val.unit
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <div className={ style.floatGroup }>
                                            <div>预估容量</div>
                                            <div>{ val.estimateCapacity }{ val.unit }</div>
                                        </div>
                                        <div className={ style.floatGroup }>
                                            <div>实际容量</div>
                                            <div>{ val.actualCapacity }{ val.unit }</div>
                                        </div>
                                    </div>
                                </div>
                            )) }
                        </div>
                    )) }
                </div>
            </div>
        );
    }
}
