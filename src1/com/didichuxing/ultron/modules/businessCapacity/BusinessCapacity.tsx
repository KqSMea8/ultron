import ModelBusinessCapacityConfig from '@ultron/modules/businessCapacity/ModelBusinessCapacity';
import {AModule} from 'com/didichuxing/commonInterface/AModule';
import CapacityMarketCard from '@ultron/components/capacityMarketCard/CapacityMarketCard';
import React from 'react';
import { observer } from 'mobx-react';
import style from './BusinessCapacity.less';
import { Bind } from 'lodash-decorators';
import Icon from '@antd/icon';
import Spin from '@antd/spin';
import Col from '@antd/col';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';

@observer
export default class BusinessCapacityConfig extends AModule<ModelBusinessCapacityConfig> {
    protected createModel(): ModelBusinessCapacityConfig {
        return new ModelBusinessCapacityConfig(this.query);
    }

    /**
     * 容量指标达标率
     */
    @Bind()
    private complianceRate(e): void {
        this.push({ url: '/ultron/capacity/target', query: {
            type: 'complianceRate',
            businessId: e.target.getAttribute('data-businessid'),
            businessName: e.target.getAttribute('data-businessname')
        } });
    }
    /**
     * 业务模块
     */
    @Bind()
    private businessModule(e): void {
        this.push({ url: '/ultron/capacity/target', query: {
            type: 'businessModule',
            businessId: e.target.getAttribute('data-businessid'),
            businessName: e.target.getAttribute('data-businessname')
        } });
    }
    public render(): React.ReactNode {
        return (
            <Spin
                spinning={ this.model.loading }
                size="large"
            >
                <div
                    className={ style.spin }
                    style={ {paddingLeft: this.model.leftPadding, paddingRight: this.model.rightPadding } }
                >
                    {
                        this.model.params.map((item, index) => {
                            return (
                                <div
                                    key={ index }
                                    className={ style.SpinCol }
                                >
                                    <CapacityMarketCard
                                        paramsItemData={ item }
                                        model={ this.model }
                                        complianceRate={ this.complianceRate }
                                        businessModule={ this.businessModule }
                                        isFromPlate={ false }
                                    />
                                </div>
                            );
                        })
                    }
                </div>
            </Spin>
        );
    }
}
