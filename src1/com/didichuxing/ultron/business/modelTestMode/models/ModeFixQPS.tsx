import React from 'react';
import AModelTestMode from 'com/didichuxing/ultron/business/modelTestMode/AMode';
import echarts from 'echarts';
import * as IStartPressure from 'com/didichuxing/ultron/remote/testMode/interfaces/IStartPressureMeasurement';
import { action, observable, computed } from 'mobx';
import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import { IReturnTestMode } from '@ultron/remote/testTask/interfaces/IGetPressureTask';

export default class ModelTestModeFixQPS extends AModelTestMode {
    @observable public fixQPS: number = 1000;
    @observable public preheatSeconds: number = 10;
    @observable public keepSeconds: number = 120;

    @action
    public setFixQPS(val: number) {
        this.fixQPS = val;
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
            qps: this.fixQPS,
            rampup: this.preheatSeconds,
            duration: this.keepSeconds
        });
    }

    public isCanSave(): Promise<IResultBoolean> {
        let result = {
            text: '',
            isPass: true
        };
        if (this.fixQPS <= 0 || this.fixQPS > 200000) {
            result = {
                text: '固定QPS应该在1-200000之间',
                isPass: false
            };
        } else if (this.preheatSeconds > this.keepSeconds) {
            result = {
                text: '预热时间应该小于持续时间',
                isPass: false
            };
        } else if (this.preheatSeconds < 0) {
            result = {
                text: '预热时间不应该小于0秒',
                isPass: false
            };
        } else if (this.keepSeconds < 10) {
            result = {
                text: '持续时间不应该小于10秒',
                isPass: false
            };
        }
        return new Promise<IResultBoolean>((resolve) => {
            resolve(result);
        });
    }

    public getAjaxParams(): IStartPressure.IParams {
        return {
            region: this.region, // 机房
            pressure: { // 压力
                type: 1, // 压力类型：1-固定QPS，2-固定并发，3-阶梯QPS，4-阶梯并发
                throughput: this.fixQPS, // QPS
                duration: this.keepSeconds, // 持续时间
                rampup: this.preheatSeconds // 预热时间
            }
        };
    }

    public renderDetail(): React.ReactNode {
        return (
            <div>
                压力{ this.fixQPS }QPS (预热{ this.preheatSeconds }秒)，
                持续{ this.keepSeconds }秒
            </div>
        );
    }

    @action
    public fillByServerData(data: IReturnTestMode): void {
        data.throughput && (this.fixQPS = data.throughput);
        data.rampup && (this.preheatSeconds = data.rampup);
        data.duration && (this.keepSeconds = data.duration);
    }

}
