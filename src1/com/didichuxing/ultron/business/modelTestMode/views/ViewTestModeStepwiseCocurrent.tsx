import React from 'react';
import InputNumber from '@antd/input-number';
import { AView } from 'com/didichuxing/commonInterface/AView';

import { observer } from 'mobx-react';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import { Bind } from 'lodash-decorators';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
import ModelTestModeStepwiseCocurrent from '@ultron/business/modelTestMode/models/ModeStepwiseCocurrent';

const ObsInputNumberBegin = bindObserver(InputNumber, 'beginCocurrent');
const ObsInputNumberMax = bindObserver(InputNumber, 'maxCocurrent');
const ObsInputNumberStep = bindObserver(InputNumber, 'stepCocurrent');
const ObsInputNumberSeconds = bindObserver(InputNumber, 'stepSeconds');

const ObsEChartSimple = bindObserver(EChartSimple, 'getEChartOptions', 'data');

@observer
export default class ViewTestModeStepwiseCocurrent extends AView<ModelTestModeStepwiseCocurrent> {

    @Bind()
    private onChangeObsInputNumberBegin(val: number) {
        this.model.setBeginCocurrent(val);
    }

    @Bind()
    private onChangeObsInputNumberMax(val: number) {
        this.model.setMaxCocurrent(val);
    }

    @Bind()
    private onChangeObsInputNumberStep(val: number) {
        this.model.setStepCocurrent(val);
    }

    @Bind()
    private onChangeObsInputNumberSeconds(val: number) {
        this.model.setStepSeconds(val);
    }

    public render(): React.ReactNode {
        const propsBegin = {
            min: 1,
            max: 20000,
            model: this.model,
            onChange: this.onChangeObsInputNumberBegin
        };
        const propsMax = {
            min: 1,
            max: 20000,
            model: this.model,
            onChange: this.onChangeObsInputNumberMax
        };
        const propsStep = {
            min: 1,
            max: 20000,
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
                    初始<ObsInputNumberBegin { ...propsBegin } />并发，
                    峰值<ObsInputNumberMax { ...propsMax } />并发，
                    递增<ObsInputNumberStep { ...propsStep } />并发，
                    每步持续<ObsInputNumberSeconds { ...propsSeconds } />秒
                </div>
                <div>
                    <ObsEChartSimple model={ this.model }/>
                </div>
            </div>
        );
    }
}
