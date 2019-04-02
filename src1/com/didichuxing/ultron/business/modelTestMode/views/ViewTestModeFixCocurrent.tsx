import React from 'react';
import InputNumber from '@antd/input-number';
import { AView } from 'com/didichuxing/commonInterface/AView';

import { observer } from 'mobx-react';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import { Bind } from 'lodash-decorators';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
import ModelTestModeFixCocurrent from '@ultron/business/modelTestMode/models/ModeFixCocurrent';

const ObsInputNumberFix = bindObserver(InputNumber, 'fixCocurrent');
const ObsInputNumberPre = bindObserver(InputNumber, 'preheatSeconds');
const ObsInputNumberSeconds = bindObserver(InputNumber, 'keepSeconds');

const ObsEChartSimple = bindObserver(EChartSimple, 'getEChartOptions', 'data');

@observer
export default class ViewTestModeFixCocurrent extends AView<ModelTestModeFixCocurrent> {

    @Bind()
    private onChangeObsInputNumberFix(val: number) {
        this.model.setFixCocurrent(val);
    }

    @Bind()
    private onChangeObsInputNumberPre(val: number) {
        this.model.setPreheatSeconds(val);
    }

    @Bind()
    private onChangeObsInputNumberSeconds(val: number) {
        this.model.setKeepSeconds(val);
    }

    public render(): React.ReactNode {
        const propsFix = {
            min: 1,
            max: 20000,
            model: this.model,
            onChange: this.onChangeObsInputNumberFix
        };
        const propsPre = {
            min: 1,
            max: 3600 * 24,
            model: this.model,
            onChange: this.onChangeObsInputNumberPre
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
                    固定<ObsInputNumberFix { ...propsFix } />并发，
                    预热<ObsInputNumberPre { ...propsPre } />秒，
                    持续<ObsInputNumberSeconds { ...propsSeconds } />秒
                </div>
                <div>
                    <ObsEChartSimple model={ this.model }/>
                </div>
            </div>
        );
    }
}
