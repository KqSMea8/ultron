import React from 'react';
import AModelTestMode from 'com/didichuxing/ultron/business/modelTestMode/AMode';
import echarts from 'echarts';
import * as IStartPressure from 'com/didichuxing/ultron/remote/testMode/interfaces/IStartPressureMeasurement';
import { action, observable, computed } from 'mobx';
import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import { IReturnTestMode } from '@ultron/remote/testTask/interfaces/IGetPressureTask';

export default class ModelTestModeFixCocurrent extends AModelTestMode {
    @observable public fixCocurrent: number = 100;
    @observable public preheatSeconds: number = 10;
    @observable public keepSeconds: number = 120;

    @action
    public setFixCocurrent(val: number) {
        this.fixCocurrent = val;
    }

    @action
    public setPreheatSeconds(val: number) {
        this.preheatSeconds = val;
    }

    @action
    public setKeepSeconds(val: number) {
        this.keepSeconds = val;
    }

    @computed
    public get getEChartOptions(): echarts.EChartOption {
        return this.createEChartOptions({
            qps: this.fixCocurrent,
            rampup: this.preheatSeconds,
            duration: this.keepSeconds
        });
    }

    public isCanSave(): Promise<IResultBoolean> {
        return new Promise<IResultBoolean>((resolve) => {
            let result = {
                text: '',
                isPass: true
            };
            if (this.fixCocurrent <= 0 || this.fixCocurrent > 10000) {
                result = {
                    text: '允许固定并发的QPS范围应该在0-10000之间',
                    isPass: false
                };
            } else if (this.preheatSeconds <= 0) {
                result = {
                    text: '预热时间应大于0秒',
                    isPass: false
                };
            } else if (this.keepSeconds < 10) {
                result = {
                    text: '持续时间应大于等于10秒',
                    isPass: false
                };
            } else if (this.keepSeconds < this.preheatSeconds) {
                result = {
                    text: '预热时间小于持续时间',
                    isPass: false
                };
            }
            resolve(result);
        });
    }

    public getAjaxParams(): IStartPressure.IParams {
        return {
            region: this.region, // 1 机房
            pressure: { // 压力
                type: 2, // 压力类型：1-固定QPS，2-固定并发，3-阶梯QPS，4-阶梯并发
                concurrency: this.fixCocurrent, // 100 // QPS
                rampup: this.preheatSeconds, // 100 预热时间
                duration: this.keepSeconds // 1  // 持续时间
            }
        };
    }

    public renderDetail(): React.ReactNode {
        return (
            <div>
                压力 { this.fixCocurrent } 并发 (预热 { this.preheatSeconds } 秒)，
                持续 { this.keepSeconds } 秒
            </div>
        );
    }

    @action
    public fillByServerData(data: IReturnTestMode): void {
        data.concurrency && (this.fixCocurrent = data.concurrency);
        data.rampup && (this.preheatSeconds = data.rampup);
        data.duration && (this.keepSeconds = data.duration);
    }

    /**
     * 保存：正式发出请求
     */
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
