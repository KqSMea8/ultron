import React from 'react';
import AModelTestMode from 'com/didichuxing/ultron/business/modelTestMode/AMode';
import echarts from 'echarts';
import * as IStartPressure from 'com/didichuxing/ultron/remote/testMode/interfaces/IStartPressureMeasurement';
import { action, computed, observable } from 'mobx';
import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import { IReturnTestMode } from '@ultron/remote/testTask/interfaces/IGetPressureTask';

export default class ModelTestModeStepwiseQPS extends AModelTestMode {
    @observable public beginQPS: number = 500;
    @observable public maxQPS: number = 3000;
    @observable public stepQPS: number = 500;
    @observable public stepSeconds: number = 60;

    @action
    public setBeginQPS(val: number) {
        this.beginQPS = val;
    }

    @action
    public setMaxQPS(val: number) {
        this.maxQPS = val;
    }

    @action
    public setStepQPS(val: number) {
        this.stepQPS = val;
    }

    @action
    public setStepSeconds(val: number) {
        this.stepSeconds = val;
    }

    @computed
    public get getEChartOptions(): echarts.EChartOption {
        return this.createEChartOptions({
            startQps: this.beginQPS,
            endQps: this.maxQPS,
            duration: this.stepSeconds,
            step: this.stepQPS
        });
    }

    public isCanSave(): Promise<IResultBoolean> {
        let result = {
            text: '',
            isPass: true
        };
        if (this.beginQPS <= 0) {
            result = {
                text: '初始压力应该大于0',
                isPass: false
            };
        } else if (this.maxQPS > 200000 || this.maxQPS < 0) {
            result = {
                text: '峰值QPS应该在0-200000之间',
                isPass: false
            };
        } else if (this.maxQPS < this.beginQPS) {
            result = {
                text: '峰值压力应该大于初始压力',
                isPass: false
            };
        } else if ((this.maxQPS - this.beginQPS) <= this.stepQPS) {
            result = {
                text: '逐步增长应该小于峰值压力与初始压力的差值',
                isPass: false
            };
        } else if (this.stepQPS <= 0) {
            result = {
                text: '递增步长应该大于0',
                isPass: false
            };
        } else if (this.stepSeconds < 10) {
            result = {
                text: '每步持续时间应该大于10秒',
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
                type: 3, // 压力类型：1-固定QPS，2-固定并发，3-阶梯QPS，4-阶梯并发
                initThroughput: this.beginQPS, // 初始QPS
                lastThroughput: this.maxQPS, // 峰值QPS
                increasePerStep: this.stepQPS, // 每步增加
                durationPerStep: this.stepSeconds // 每步持续时间
            }
        };
    }

    public renderDetail(): React.ReactNode {
        return (
            <div>
                初始 { this.beginQPS } QPS，
                峰值 { this.maxQPS } QPS，
                每步增加 { this.stepQPS } QPS，
                每步持续 { this.stepSeconds } 秒
            </div>
        );
    }

    @action
    public fillByServerData(data: IReturnTestMode): void {
        data.initThroughput && (this.beginQPS = data.initThroughput);
        data.lastThroughput && (this.maxQPS = data.lastThroughput);
        data.increasePerStep && (this.stepQPS = data.increasePerStep);
        data.durationPerStep && (this.stepSeconds = data.durationPerStep);
    }

}
