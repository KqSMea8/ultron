/**
 * Created by zhukai.
 */
import React from 'react';
import AModelTestMode from 'com/didichuxing/ultron/business/modelTestMode/AMode';
import echarts from 'echarts';
import * as IStartPressure from 'com/didichuxing/ultron/remote/testMode/interfaces/IStartPressureMeasurement';
import { action, observable, computed } from 'mobx';
import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import { IReturnTestMode } from '@ultron/remote/testTask/interfaces/IGetPressureTask';

export default class ModelTestModeStepwiseCocurrent extends AModelTestMode {
    @observable public beginCocurrent: any = '';
    @observable public maxCocurrent: number = 300;
    @observable public stepCocurrent: number = 50;
    @observable public stepSeconds: number = 60;
    @observable public type: string = 'concurrency';

    @action
    public setBeginCocurrent(value: string) {
        this.beginCocurrent = value;
    }

    @action
    public setMaxCocurrent(val: number) {
        this.maxCocurrent = val;
    }

    @action
    public setStepCocurrent(val: number) {
        this.stepCocurrent = val;
    }

    @action
    public setStepSeconds(val: number) {
        this.stepSeconds = val;
    }

    @computed
    public get getEChartOptions(): echarts.EChartOption {
        return this.createEChartOptions({
            startQps: this.beginCocurrent,
            duration: this.stepSeconds,
            type: this.type
        });
    }

    public isCanSave(): Promise<IResultBoolean> {
        return new Promise<IResultBoolean>((resolve) => {
            let result = {
                text: '',
                isPass: true
            };
            if (this.beginCocurrent.length <= 0 || this.maxCocurrent > 10000) {
                result = {
                    text: '初始并发数应该在0～10000之间',
                    isPass: false
                };
            } else if (this.maxCocurrent <= 0 || this.maxCocurrent > 10000) {
                result = {
                    text: '峰值并发数范围应该在0～10000之间',
                    isPass: false
                };
            } else if (this.beginCocurrent.length > this.maxCocurrent) {
                result = {
                    text: '初始并发数应小于峰值并发数',
                    isPass: false
                };
            } else if (this.stepCocurrent >= (this.maxCocurrent - this.beginCocurrent.length)) {
                result = {
                    text: '逐步增长值应该小于峰值并发与初始并发的差值',
                    isPass: false
                };
            } else if (this.stepSeconds < 10) {
                result = {
                    text: '每步持续时间应该大于等于10秒',
                    isPass: false
                };
            }
            resolve(result);
        });
    }

    public getAjaxParams(): IStartPressure.IParams {
        const concurrencies = this.beginCocurrent.split(',').map((item) => {
            return +item;
        });
        return {
            region: this.region, // 1
            pressure: { // 压力
                type: 6, // 压力类型：1-固定QPS，2-固定并发，3-阶梯QPS，4-阶梯并发, 5-自定义QPs
                concurrencies, // 初始并发
                unit: this.stepSeconds // 每步持续时间
            }
        };
    }

    public renderDetail(): React.ReactNode {
        return (
            <div>
                初始 { this.beginCocurrent } 并发，
                峰值 { this.maxCocurrent } 并发，
                每步增加 { this.stepCocurrent } 并发，
                每步持续 { this.stepSeconds } 秒
            </div>
        );
    }

    @action
    public fillByServerData(data: IReturnTestMode): void {
        data.initConcurrency && (this.beginCocurrent = data.initConcurrency);
        data.lastConcurrency && (this.maxCocurrent = data.lastConcurrency);
        data.increasePerStep && (this.stepCocurrent = data.increasePerStep);
        data.durationPerStep && (this.stepSeconds = data.durationPerStep);
    }

    // protected async doSave(): Promise<IResultBoolean> {
    //     startPressureMeasurement({params: this.getAjaxParams()});
    //     return new Promise<IResultBoolean>((resolve) => {
    //         resolve({
    //             text: '',
    //             isPass: true
    //         });
    //     });
    // }
}
