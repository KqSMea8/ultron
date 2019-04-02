import React from 'react';
import InputNumber from '@antd/input-number';
import Input from '@antd/input';
import Select from '@antd/select';
import { AView } from 'com/didichuxing/commonInterface/AView';

import { observer } from 'mobx-react';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import { Bind } from 'lodash-decorators';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
import ModeConcurrency from '@ultron/business/modelTestMode/models/ModeConcurrency';

const ObsInputNumberBegin = bindObserver(Input, 'beginCocurrent');
const ObsInputNumberSeconds = bindObserver(InputNumber, 'stepSeconds');

const ObsEChartSimple = bindObserver(EChartSimple, 'getEChartOptions', 'data');

@observer
export default class ViewTestModeConcurrency extends AView<ModeConcurrency> {
    @Bind()
    private onChangeObsInputNumberBegin(event: React.FormEvent<HTMLInputElement>) {
        this.model.setBeginCocurrent(event.currentTarget.value);
    }

    @Bind()
    private onChangeObsInputNumberSeconds(val: any) {
        this.model.setStepSeconds(
            {
                sixty: 60,
                thirty: 30,
                ten: 10
            }[val]
        );
    }

    public render(): React.ReactNode {
        const propsBegin = {
            min: 1,
            max: 20000,
            model: this.model,
            onChange: this.onChangeObsInputNumberBegin
        };

        return (
            <div>
                <div>
                    值：
                    <ObsInputNumberBegin
                        style={ {width: '70%'} }
                        { ...propsBegin }
                        placeholder="请输入100,200,300...300的格式，且最少10个数字"
                    />
                    ,&nbsp;&nbsp;&nbsp;每步持续
                    <Select
                        defaultValue="sixty"
                        style={ { width: 70 } }
                        onChange={ this.onChangeObsInputNumberSeconds }
                    >
                        <Select.Option value="sixty">60</Select.Option>
                        <Select.Option value="thirty">30</Select.Option>
                        <Select.Option value="ten">10</Select.Option>
                    </Select>
                    秒
                </div>
                <div>
                    <ObsEChartSimple model={ this.model }/>
                </div>
            </div>
        );
    }
}
