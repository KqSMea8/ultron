import React from 'react';
import InputNumber from '@antd/input-number';
import { AView } from 'com/didichuxing/commonInterface/AView';

import { observer } from 'mobx-react';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import ModelTestModeStepwiseQPS from '@ultron/business/modelTestMode/models/ModeStepwiseQPS';
import { Bind } from 'lodash-decorators';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';

const ObsInputNumberBegin = bindObserver(InputNumber, 'beginQPS');
const ObsInputNumberMax = bindObserver(InputNumber, 'maxQPS');
const ObsInputNumberStep = bindObserver(InputNumber, 'stepQPS');
const ObsInputNumberSeconds = bindObserver(InputNumber, 'stepSeconds');

const ObsEChartSimple = bindObserver(EChartSimple, 'getEChartOptions', 'data');

@observer
export default class ViewTestModeStepwiseQPS extends AView<ModelTestModeStepwiseQPS> {

    @Bind()
    private onChangeObsInputNumberBegin(val: number) {
        this.model.setBeginQPS(val);
    }

    @Bind()
    private onChangeObsInputNumberMax(val: number) {
        this.model.setMaxQPS(val);
    }

    @Bind()
    private onChangeObsInputNumberStep(val: number) {
        this.model.setStepQPS(val);
    }

    @Bind()
    private onChangeObsInputNumberSeconds(val: number) {
        this.model.setStepSeconds(val);
    }

    public render(): React.ReactNode {
        const propsBegin = {
            min: 1,
            max: 200000,
            model: this.model,
            onChange: this.onChangeObsInputNumberBegin
        };
        const propsMax = {
            min: 1,
            max: 200000,
            model: this.model,
            onChange: this.onChangeObsInputNumberMax
        };
        const propsStep = {
            min: 1,
            max: 200000,
            model: this.model,
            onChange: this.onChangeObsInputNumberStep
        };
        const propsSeconds = {
            min: 10,
            max: 3600 * 24,
            model: this.model,
            onChange: this.onChangeObsInputNumberSeconds
        };

        return (
            <div>
                <div>
                    初始<ObsInputNumberBegin { ...propsBegin } />QPS，
                    峰值<ObsInputNumberMax { ...propsMax } />QPS，
                    递增<ObsInputNumberStep { ...propsStep } />QPS，
                    每步持续<ObsInputNumberSeconds { ...propsSeconds } />秒
                </div>
                <div>
                    <ObsEChartSimple model={ this.model }/>
                </div>
            </div>
        );
    }
}
