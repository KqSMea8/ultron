import React from 'react';
import echarts from 'echarts';
import { IAjaxParams } from 'com/didichuxing/commonInterface/IAjaxParams';
import * as IStartPressureMeasurement from '@ultron/remote/testMode/interfaces/IStartPressureMeasurement';
import { IIsCanSave } from 'com/didichuxing/commonInterface/IIsCanSave';
import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import { IReturnTestMode } from '@ultron/remote/testTask/interfaces/IGetPressureTask';
import { observable, action } from 'mobx';

export interface ICreateEChartOptions {
    qps?: number;
    rampup?: number;
    startQps?: number;
    endQps?: number;
    step?: number;
    duration: number;
}

export interface ICreateEChartOptionsStep {
    startQps;
    duration: number;
    type?: string;
    endQps?: number;
    step?: number;
}

export interface ICreateEChartOptionsFix {
    qps: number;
    rampup: number;
    duration: number;
}

export interface IModelTestModeConstructor {
    new(data?: IReturnTestMode): AModelTestMode;
}

/**
 * 压测模式抽象类
 */
export default abstract class AModelTestMode implements IAjaxParams<IStartPressureMeasurement.IParams>, IIsCanSave {
    @observable public region: string = '';
    @observable public isDisabledRegion: boolean = false;

    @action
    public setRegion(val) {
        this.region = val;
    }

    @action
    public setIsDisabledRegion(val: boolean = true) {
        this.isDisabledRegion = val;
    }

    /**
     * 当前的压测方式的 echarts 配置
     * @returns {echarts.EChartOption}
     */
    public abstract get getEChartOptions(): echarts.EChartOption;

    /**
     * 保存：前置检查，可取消保存操作
     * @returns {Promise<IResultBoolean>}
     */
    public abstract async isCanSave(): Promise<IResultBoolean>;

    /**
     * 保存时所需的 ajax 参数
     * @returns {IParams}
     */
    public abstract getAjaxParams(): IStartPressureMeasurement.IParams;

    /**
     * 渲染详情
     * @returns {React.ReactNode}
     */
    public abstract renderDetail(): React.ReactNode;

    /**
     * 通过接口数据赋值
     * @param {IReturnTestMode} data
     */
    public abstract fillByServerData(data: IReturnTestMode): void;

    private sumData(result, dataX, data, range) {
        let cur = dataX[dataX.length - 1] + 10;
        for (let i = 10; i <= range;) {
            dataX.push(cur);
            result.push(data);
            i += 10;
            cur += 10;
        }
    }
    /**
     * 自定义QPS
     * @param data
     */
    private excuteData(series, data, dataX) {
        data['startQps'] = data['startQps'].replace(/，/ig, ',');
        const newStartQps = /^([1-9](\d)*,)+([1-9](\d)*)$/.test(data['startQps']);
        if (!newStartQps) {
            return;
        }
        series.data = data['startQps'].split(',').map((item) => {
            return +item;
        });
        for (let i = 1; i <= series.data.length - 1; i++) {
            dataX.push(i * data['duration']);
        }
    }
    protected createEChartOptions(data: ICreateEChartOptionsStep | ICreateEChartOptionsFix): echarts.EChartOption;
    protected createEChartOptions(data: any): echarts.EChartOption {
        const series: any = {
            name: '预期压力(或并发数)',
            type: 'line',
            stack: '总量',
            data: []
        };
        const dataX = [0];
        switch (data.type) {
            case 'customQPS':
                this.excuteData(series, data, dataX);
                break;
            case 'concurrency':
                this.excuteData(series, data, dataX);
                break;
            default:
                if (data.rampup) {
                    dataX.push(data.rampup);
                    series.data.push(0);
                }
                if (data.startQps) {
                    series.data.push(data.startQps);
                    this.sumData(series.data, dataX, data.startQps, data.duration);
                    let qps = data.startQps + data.step;
                    while (data.endQps > qps) {
                        this.sumData(series.data, dataX, qps, data.duration);
                        qps += (data.step || 50);
                    }
                    this.sumData(series.data, dataX, data.endQps, data.duration);
                } else if (data.qps) {
                    series.data.push(data.qps);
                    this.sumData(series.data, dataX, data.qps, data.duration);
                }
        }
        const option = {
            title: {
                // text: `压力曲线`,
                textStyle: {
                    fontSize: 14,
                    fontWeight: 200
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    }
                }
            },
            legend: {
                data: ['预期压力(或并发数)'],
                orient: 'horizontal',
                // x: "left",
                tooltip: {
                    show: true
                }
            },
            grid: {
                top: 30,
                left: 20,
                right: 10,
                bottom: 5,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dataX,
                axisLabel: {
                    // rotate: 45,
                    margin: 15,
                    bottom: 50
                }
            },
            yAxis: {
                type: 'value'
            },
            series: series
        };
        return option;
    }
}
