/**
 * Created by didi on 2018/7/4.
 */
import React from 'react';
import Button from '@antd/button';
import Input from '@antd/input';
import Tabs from '@antd/tabs';
import Select from '@antd/select';
import Radio from '@antd/radio';
import Modal from '@antd/modal';
import Row from '@antd/row';
import Col from '@antd/col';
import Icon from '@antd/icon';
import { observer } from 'mobx-react';
import style from './ViewTask.less';
import { Bind } from 'lodash-decorators';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { ascetic } from 'react-syntax-highlighter/styles/hljs';

import { AView } from 'com/didichuxing/commonInterface/AView';
import { action, computed, observable, runInAction } from 'mobx';
import { getStats, getSamples } from '@ultron/remote/testTask';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
import { ETestTaskState } from '@ultron/business/common/enum/ETestTaskState';

const InputGroup = Input.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const RadioButton = Radio.Button;
const ObsSelectTime = bindObserver(Select, 'dateType', 'value');

export interface IModelTaskDetailPerf {
    url: string;
    planId: string;
    taskId: string;
    beginTime: number;
    endTime: number;
    status: number;
    types: number;
    businessCode: string;
}
export interface IObj {
    status: number;
    agent_ip: string;
    code: number;
    trace_id: string;
    request: string;
    response: string;
    error: string;
}

export enum ETimeRange {
    ALL = '0',
    HALF_HOUR = '1',
    ONE_HOUR = '2',
    TWO_HOUR = '3'
}

const MAP_DATE = {
    [ETimeRange.HALF_HOUR]: {
        name: '最后半小时',
        dataInterval: 5
    },
    [ETimeRange.ONE_HOUR]: {
        name: '最后一小时',
        dataInterval: 10
    },
    [ETimeRange.TWO_HOUR]: {
        name: '最后两小时',
        dataInterval: 20
    },
    [ETimeRange.ALL]: {
        name: '全部',
        dataInterval: 60
    }
};

const traceId = '{"url":"http://100.69.185.15:8001/test/jmeter/queryOrder?orderCode=1"}';
const aa = '{"body":"{\"data\":{\"orderCode\":99}}","status":200}}';
const liuliangUrl = 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=181687014';

export class ModelTaskDetailPerf {
    @observable public url: string = '';
    @observable public totalCount: number = 0;
    @observable public errorCount: number = 0;

    @observable public dataChartError: any = {};
    @observable public dataChartCode: any = {};
    @observable public dataChartQPS: any = {};
    @observable public dataChartAver: any = {};
    @observable public isShow: boolean = false;
    @observable public times: number = 0;
    @observable public dataArr: any[] = [];
    @observable public defaultRadioValue: any = '0';
    @observable public obj: IObj = {} as any;
    @observable public showHide: string = 'none';
    @observable public isLiuLiang: boolean = false;
    @observable public isHaoshi: boolean = false;
    @observable public isXiangYing: boolean =  false;
    @observable public isBusinessCode: boolean = false;

    @observable public dateType: ETimeRange = ETimeRange.HALF_HOUR;

    private planId: string;
    private taskId: string;
    private beginTime: number;
    private endTime: number;
    private status: number;
    @observable public types: number;
    @observable public businessCode: string;

    constructor({ url, planId, taskId, beginTime, endTime, status, types, businessCode }: IModelTaskDetailPerf) {
        this.planId = planId;
        this.taskId = taskId;
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.status = status;
        this.types = types;
        this.businessCode = businessCode;
        this.setUrl(url);
        this.loadTasStats();
    }

    @computed
    public get vBeginTime(): number {
        switch (this.dateType) {
            case ETimeRange.HALF_HOUR:
                return this.valEndTime - 60 * 30;
            case ETimeRange.ONE_HOUR:
                return this.valEndTime - 60 * 60;
            case ETimeRange.TWO_HOUR:
                return this.valEndTime - 60 * 120;
        }
        return this.beginTime;
    }

    public get valIsRunning() {
        return this.status === ETestTaskState.Running;
    }

    public get valEndTime(): number {
        if (this.valIsRunning || this.endTime === 0) {
            return Math.floor(new Date().getTime() / 1000);
        } else {
            return this.endTime;
        }
    }

    @action
    public setUrl(url: string): void {
        this.url = url;
    }

    @action
    public setDateType(val: ETimeRange): void {
        this.dateType = val;
        this.loadTasStats();
    }

    /**
     * 加载测试配置列表
     */
    public async loadTasStats(): Promise<void> {
        const respData = await getStats({
            api: this.url,
            beginTime: this.vBeginTime,
            endTime: this.valEndTime
        }, {
            planId: this.planId,
            taskId: this.taskId
        });

        runInAction(() => {
            this.totalCount = respData.total.count;
            this.errorCount = respData.total.err_count;
            this.newChart(respData.data);
        });
    }

    /**
     * 点击echarts图表时请求接口
     * @returns {Promise<void>}
     */
    public async samplesList(): Promise<void> {
        const resData = await getSamples({
            api: this.url,
            timestamp: this.times
        }, {
            planId: this.planId,
            taskId: this.taskId
        });
        if (resData.samples.length > 0) {
            this.dataArr = resData.samples as any;
            this.defaultRadioValue = resData.samples[0].code;
            this.obj = this.dataArr.find((item) => {
                return item.code === this.defaultRadioValue;
            });
        }
    }

    private createOption(obj, state = false) {
        if (Array.isArray(obj.series)) {
            obj.series.forEach((item) => {
                item.symbolSize = 1;
            });
        } else if (obj.series) {
            obj.series.symbolSize = 1;
        }
        const option = {
            title: {
                // text: `压测记录-${obj.date}`,
                textStyle: {
                    fontSize: 14,
                    fontWeight: 200
                }
            },
            dataZoom: [
                {
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],
                    filterMode: 'filter'
                }
            ],
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    }
                    /*myTool1: state ? false : {
                     show: true,
                     title: '大图',
                     icon: 'path://M161.691,55.809c1.033,1.032,2.254,1.549,3.666,1.549c0.651,0,1.332-0.136,' +
                     '2.037-0.408c2.119-0.923,3.178-2.526,' +
                     '3.178-4.807v-36.5c0-1.412-0.516-2.634-1.549-3.666c-1.031-1.032-2.254-1.548-3.666-' +
                     '1.548h-36.5c-2.281,0-3.883,1.086-4.808,3.259c-0.922,2.118-0.543,3.992,1.142,' +
                     '5.621l11.731,11.732L108,59.964L79.077,31.04l11.732-11.732c1.684-1.629,2.064-3.503,' +
                     '1.141-5.621c-0.924-2.173-2.526-3.259-4.807-3.259h-36.5c-1.413,0-2.635,0.516-3.667,' +
                     '1.548c-1.032,1.032-1.548,2.254-1.548,3.666v36.5c0,2.282,1.087,3.884,3.259,4.807c0.652,' +
                     '0.271,' +
                     '1.304,0.408,1.956,0.408c1.412,0,2.634-0.517,3.666-1.549l11.732-11.731L94.964,73l-28.923,' +
                     '28.922L54.309,90.189c-1.63-1.684-3.503-2.063-5.622-1.141c-2.173,0.924-3.259,2.527-3.259,' +
                     '4.809v36.5c0,1.412,0.516,2.634,1.548,3.666c1.033,1.031,2.255,1.547,3.667,1.547h36.5c2.282,' +
                     '0,3.884-1.086,4.807-3.258c0.923-2.119,0.543-3.992-1.141-5.623l-11.732-11.73L108,' +
                     '86.035l28.922,' +
                     '28.925l-11.732,11.731c-1.684,1.629-2.063,3.504-1.141,5.621c0.924,2.174,2.527,3.26,4.809,' +
                     '3.26h36.5c1.412,0,2.634-0.517,3.666-1.549c1.031-1.031,1.547-2.254,' +
                     '1.547-3.666v-36.5c0-2.281-1.059-3.884-3.178-4.808c-2.226-0.922-4.127-0.543-5.703,' +
                     '1.142l-11.73,11.731L121.036,73l28.923-28.923L161.691,55.809z',
                     onclick: () => {
                     // this.showLargeChart();
                     }
                     }*/
                }
            },
            legend: {
                data: obj.legend,
                orient: 'horizontal',
                // x: "right",
                tooltip: {
                    show: true
                },
                selected: obj.selected
            },
            grid: {
                top: 30,
                left: 20,
                right: 35,
                bottom: 40,
                containLabel: true
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
                // boundaryGap: false,
                // data: obj.dataX,
                // axisLabel: {
                //     rotate: 45,
                //     margin: 5,
                // }
            },
            yAxis: obj.yAxis || {
                type: 'value'
            },
            series: obj.series
        };
        return option;
    }

    private combineData(data) {
        const dataY: any = {
            error: { 500: [], 200: [] },
            prepare: [],
            qps: [],
            tps: [],
            average: [],
            rt_75: [],
            rt_95: [],
            code: { '': [] }
        };
        if (data.length) {
            data.forEach((item, index) => {
                if (Object.keys(item['status_counts']).indexOf('500') === -1) {
                    dataY.error['500'].push({
                        name: '500',
                        value: [item.timestamp, 0]
                    });
                }
                for (const attr in item['status_counts']) {
                    if (Number(attr) > 399) {
                        dataY.error[attr] ? dataY.error[attr].push({
                            name: attr,
                            value: [item.timestamp, item.status_counts[attr] || 0]
                        }) : dataY.error[attr] = [{
                            name: attr,
                            value: [item.timestamp, item.status_counts[attr] || 0]
                        }];
                    } else {
                        dataY.error[attr] ? dataY.error[attr].push({
                            name: attr,
                            value: [item.timestamp, item.status_counts[attr]]
                        }) : dataY.error[attr] = [{
                            name: attr,
                            value: [item.timestamp, item.status_counts[attr]]
                        }];
                    }
                }
                for (const attr in item['code_counts']) {
                    if (attr) {
                        dataY.code[attr] ? dataY.code[attr].push({
                            name: attr,
                            value: [item.timestamp, item.code_counts[attr] || 0]
                        }) : dataY.code[attr] = [{
                            name: attr,
                            value: [item.timestamp, item.code_counts[attr] || 0]
                        }];
                    }
                }
                dataY.prepare.push({
                    name: 'prepare',
                    value: [item.timestamp, item.prepare_qps]
                });
                dataY.qps.push({
                    name: 'send',
                    value: [item.timestamp, item.qps]
                });
                dataY.tps.push({
                    name: 'receive',
                    value: [item.timestamp, item.tps]
                });
                dataY.average.push({
                    name: 'average',
                    value: [item.timestamp, item.rt_avg]
                });
                dataY.rt_75.push({
                    name: 'rt_75',
                    value: [item.timestamp, item.rt_75]
                });
                dataY.rt_95.push({
                    name: 'rt_95',
                    value: [item.timestamp, item.rt_95]
                });
            });
        }
        return dataY;
    }

    @action
    private newChart(data) {
        const dataY = this.combineData(data);
        const series = [];
        const errorObj: any = {
            series: [],
            legend: [],
            selected: {}
        };
        const codeObj: any = {
            series: [],
            legend: [],
            selected: {}
        };
        for (const attr in dataY.error) {
            if (dataY.error.hasOwnProperty(attr)) {
                errorObj.series.push({
                    name: attr,
                    type: 'line',
                    stack: attr,
                    data: dataY.error[attr]
                });
                errorObj.legend.push(attr);
                errorObj.selected[200] = false;
            }
        }
        for (const attr in dataY.code) {
            if (dataY.code.hasOwnProperty(attr)) {
                codeObj.series.push({
                    name: attr,
                    type: 'line',
                    stack: attr,
                    data: dataY.code[attr]
                });
                codeObj.legend.push(attr);
            }
        }
        const qpsObj = {
            series: [
                {
                    name: '发送总数',
                    type: 'line',
                    stack: '发送总数',
                    data: dataY.prepare
                },
                {
                    name: '发送成功数',
                    type: 'line',
                    stack: '发送成功数',
                    data: dataY.qps
                },
                {
                    name: '响应总数',
                    type: 'line',
                    stack: '响应总数',
                    data: dataY.tps
                }
            ],
            legend: ['发送总数', '发送成功数', '响应总数'],
            selected: {}
        };
        const averageObj = {
            series: [
                {
                    name: '平均耗时',
                    type: 'line',
                    stack: '平均耗时',
                    data: dataY.average
                },
                {
                    name: '75分位',
                    type: 'line',
                    stack: '75分位',
                    data: dataY.rt_75
                },
                {
                    name: '95分位',
                    type: 'line',
                    stack: '95分位',
                    data: dataY.rt_95
                }
            ],
            legend: ['平均耗时', '75分位', '95分位'],
            yAxis: {
                name: '单位/ms',
                type: 'value'
            },
            selected: {}
        };

        this.dataChartError = this.createOption(errorObj);
        this.dataChartCode = this.createOption(codeObj);
        this.dataChartQPS = this.createOption(qpsObj);
        this.dataChartAver = this.createOption(averageObj);
    }

    public renderView(): React.ReactNode {
        return <ViewTaskDetailPerf key={ this.url } model={ this }/>;
    }
}

@observer
export class ViewTaskDetailPerf extends AView<ModelTaskDetailPerf> {
    @Bind()
    private onClickRefresh(e): void {
        this.model.loadTasStats();
    }

    @Bind()
    private onChangeDateType(val): void {
        this.model.setDateType(val);
    }

    /**
     * Modal显示事件
     */
    @Bind()
    private isShow(): void {
        this.model.isShow = true;
    }

    /**
     * Modal隐藏事件
     */
    @Bind()
    private hide(): void {
        this.model.isShow = false;
    }

    /**
     * 获取时间、显示Modal、请求接口事件
     * @param evt
     */
    @Bind()
    private setTime(evt): void {
        this.model.times = evt.value[0] / 1000;
        this.model.isShow = true;
        this.model.samplesList();
    }

    /**
     * RadioGroup在改变时的事件
     * @param evt
     */
    @Bind()
    private radioChange(evt): void {
        if (this.model.dataArr.length > 0) {
            this.model.obj = this.model.dataArr.find((item) => {
                return item.code === evt.target.value;
            });
        }
        this.model.defaultRadioValue = evt.target.value;
    }

    @Bind()
    private isBlock(): void {
        this.model.showHide = 'block';
    }

    @Bind()
    private isNone(): void {
        this.model.showHide = 'none';
    }
    @Bind()
    private liuLiangIconOver(): void {
        this.model.isLiuLiang = true;
    }
    @Bind()
    private liuLiangIconLeave(): void {
        this.model.isLiuLiang = false;
    }
    @Bind()
    private haoShiIconOver(): void {
        this.model.isHaoshi = true;
    }
    @Bind()
    private haoShiIconLeave(): void {
        this.model.isHaoshi = false;
    }
    @Bind()
    private xiangYingIconOver(): void {
        this.model.isXiangYing = true;
    }
    @Bind()
    private xiangYingIconLeave(): void {
        this.model.isXiangYing = false;
    }
    @Bind()
    private businessCodeIconOver(): void {
        this.model.isBusinessCode = true;
    }
    @Bind()
    private businessCodeIconLeave(): void {
        this.model.isBusinessCode = false;
    }

    public render(): React.ReactNode {
        return (
            <div className={ style.ViewDetailPerf } style={ { marginBottom: '15px' } }>
                <div className={ style.title }>
                    <div className={ style.float }>{ this.model.url }</div>
                    <div className={ style.right }>
                        <span>请求总量:<span>{ this.model.totalCount }</span></span>
                        <span>错误数:<span>{ this.model.errorCount }</span></span>
                        <div>
                            <ObsSelectTime
                                model={ this.model }
                                style={ { width: '120px' } }
                                onChange={ this.onChangeDateType }
                            >
                                {
                                    Object.keys(MAP_DATE).map(
                                        (key) => <Option key={ key } value={ key }>{ MAP_DATE[key].name }</Option>
                                    )
                                }
                            </ObsSelectTime>
                        </div>
                        <Button onClick={ this.onClickRefresh }>刷新</Button>
                    </div>
                </div>
                <div style={ { height: '0.1px' } }>&nbsp;</div>
                {
                    String(this.model.types) !== '4' ? (
                        this.model.showHide === 'block' ? (
                            <div>
                                <ul className={ style.echart }>
                                    <li>
                                        <span className={ style.name }>流量</span>
                                        <span
                                            onMouseOver={ this.liuLiangIconOver }
                                            onMouseLeave={ this.liuLiangIconLeave }
                                            className={ style.icon }
                                        >
                                            <Icon
                                                type="question-circle"
                                                style={ { color: '#1890ff' } }
                                            />
                                            {
                                                this.model.isLiuLiang === true ? (
                                                    <div className={ style.hideShow }>
                                                        <span>
                                                            发送总数：每秒尝试发送的请求数
                                                        </span>
                                                        <br/>
                                                        <span>
                                                            发送成功数：每秒发送成功的请求数
                                                        </span>
                                                        <br/>
                                                        <span>
                                                            响应总数：每秒收到的响应数
                                                        </span>
                                                        <br/>
                                                        <span>
                                                            详情请查看
                                                            <a
                                                                href={ liuliangUrl }
                                                                target="_blank"
                                                            >
                                                                Ultron监控统计规则
                                                            </a>
                                                        </span>
                                                    </div>
                                                ) : null
                                            }
                                        </span>
                                        <div className={ style.chart }>
                                            <EChartSimple data={ this.model.dataChartQPS }/>
                                        </div>
                                    </li>
                                    <li>
                                        <span className={ style.name }>耗时（单位：毫秒）</span>
                                        <span
                                            onMouseOver={ this.haoShiIconOver }
                                            onMouseLeave={ this.haoShiIconLeave }
                                            className={ style.icon }
                                        >
                                            <Icon
                                                type="question-circle"
                                                style={ { color: '#1890ff' } }
                                            />
                                            {
                                                this.model.isHaoshi === true ? (
                                                    <div className={ style.hideShow }>
                                                        <span>
                                                            平均耗时：当前这一时刻所有请求的平均响应时间
                                                        </span>
                                                        <br/>
                                                        <span>
                                                            75分位：75%的请求的最大响应耗时
                                                        </span>
                                                        <br/>
                                                        <span>
                                                            95分位：95%的请求的最大响应耗时
                                                        </span>
                                                        <br/>
                                                        <span>
                                                            详情请查看
                                                            <a
                                                                href={ liuliangUrl }
                                                                target="_blank"
                                                            >
                                                                Ultron监控统计规则
                                                            </a>
                                                        </span>
                                                    </div>
                                                ) : null
                                            }
                                        </span>
                                        <div className={ style.chart }>
                                            <EChartSimple data={ this.model.dataChartAver }/>
                                        </div>
                                    </li>
                                </ul>
                                <div className={ style.code }>
                                    <div className={ style.oLi }>
                                        {
                                            Number(this.model.types) === 4 ? (
                                                <span className={ style.name }>响应错误码（每10秒钟）</span>
                                            ) : (
                                                <span className={ style.name }>HTTP响应码（每10秒钟）</span>
                                            )
                                        }
                                        <span
                                            onMouseOver={ this.xiangYingIconOver }
                                            onMouseLeave={ this.xiangYingIconLeave }
                                            className={ style.icon }
                                        >
                                            <Icon
                                                type="question-circle"
                                                style={ { color: '#1890ff' } }
                                            />
                                            {
                                                this.model.isXiangYing === true ? (
                                                    <div className={ style.hideShow }>
                                                        <span>
                                                            统计粒度：10s，即图中每一节点为10s数据的聚合
                                                        </span>
                                                        <br/>
                                                        <span>
                                                            点击
                                                            <a
                                                                href={ liuliangUrl }
                                                                target="_blank"
                                                            >
                                                                Ultron监控统计规则
                                                            </a>
                                                            查看常见响应码
                                                        </span>
                                                    </div>
                                                ) : null
                                            }
                                        </span>
                                        <div>
                                            <EChartSimple data={ this.model.dataChartError }/>
                                        </div>
                                    </div>
                                    <div className={ style.oLi }>
                                        <span className={ style.name }>
                                            业务码
                                            {
                                                this.model.businessCode ? (
                                                    '(' + this.model.businessCode + ')'
                                                ) : null
                                            }
                                            （每10秒钟）
                                        </span>
                                        <span
                                            onMouseOver={ this.businessCodeIconOver }
                                            onMouseLeave={ this.businessCodeIconLeave }
                                            className={ style.icon }
                                        >
                                            <Icon
                                                type="question-circle"
                                                style={ { color: '#1890ff' } }
                                            />
                                            {
                                                this.model.isBusinessCode === true ? (
                                                    <div className={ style.hideShow }>
                                                        <span>
                                                            统计粒度：10s，即图中每一节点为10s数据的聚合
                                                        </span>
                                                        <br/>
                                                        <span>
                                                            点击
                                                            <a
                                                                href={ liuliangUrl }
                                                                target="_blank"
                                                            >
                                                                Ultron监控统计规则
                                                            </a>
                                                            查看使用方式
                                                        </span>
                                                    </div>
                                                ) : null
                                            }
                                        </span>
                                        <div>
                                            <EChartSimple data={ this.model.dataChartCode } onClick={ this.setTime }/>
                                        </div>
                                    </div>
                                    <Modal
                                        visible={ this.model.isShow }
                                        closable={ false }
                                        width={ 800 }
                                        title="请求采样"
                                        footer={
                                            <Button
                                                onClick={ this.hide }
                                                type="primary"
                                            >取消
                                            </Button>
                                        }
                                    >
                                        业务码：
                                        <RadioGroup
                                            value={ this.model.defaultRadioValue }
                                            size="small"
                                            onChange={ this.radioChange }
                                        >
                                            {
                                                this.model.dataArr.length > 0 &&
                                                this.model.dataArr.map((item, index) => {
                                                    return (
                                                        <RadioButton
                                                            value={ item.code }
                                                            key={ index }
                                                            className={ style.radioStyle }
                                                        >
                                                            { item.code }
                                                        </RadioButton>
                                                    );
                                                })
                                            }
                                        </RadioGroup>
                                        <div className={ style.border }>
                                            <Row gutter={ 8 }>
                                                <Col span={ 3 }>trace_id</Col>
                                                <Col span={ 21 }>
                                                    <a
                                                        href={
                                                            'http://bamai.xiaojukeji.com/search/trace?key='
                                                            + this.model.obj.trace_id + '&index=allindex'
                                                        }
                                                        target="_blank"
                                                        style={ { textDecoration: 'none', color: '#666' } }
                                                    >
                                                        {
                                                            this.model.obj.trace_id
                                                        }
                                                    </a>
                                                </Col>
                                            </Row>
                                            <Row gutter={ 8 }>
                                                <Col span={ 3 }>request</Col>
                                                <Col span={ 21 }>
                                                    {
                                                        this.model.obj.request && (
                                                            <SyntaxHighlighter language="json" style={ ascetic }>
                                                                {
                                                                    JSON.stringify(JSON.parse(this.model.obj.request),
                                                                        null, 2)
                                                                }
                                                            </SyntaxHighlighter>
                                                        )
                                                    }
                                                </Col>
                                            </Row>
                                            <Row gutter={ 8 }>
                                                <Col span={ 3 }>response</Col>
                                                <Col span={ 21 }>
                                                    {
                                                        this.model.obj.response && (
                                                            <SyntaxHighlighter language="json" style={ ascetic }>
                                                                {
                                                                    JSON.stringify(JSON.parse(this.model.obj.response),
                                                                        null, 2) }
                                                            </SyntaxHighlighter>
                                                        )
                                                    }
                                                </Col>
                                            </Row>
                                            <Row gutter={ 8 }>
                                                <Col span={ 3 }>error</Col>
                                                <Col span={ 21 }>
                                                    {
                                                        this.model.obj.error
                                                    }
                                                </Col>
                                            </Row>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        ) : null
                    ) : (
                        <div>
                            <ul className={ style.echart }>
                                <li>
                                    <span className={ style.name }>流量</span>
                                    <span
                                        onMouseOver={ this.liuLiangIconOver }
                                        onMouseLeave={ this.liuLiangIconLeave }
                                        className={ style.icon }
                                    >
                                        <Icon
                                            type="question-circle"
                                            style={ { color: '#1890ff' } }
                                        />
                                        {
                                            this.model.isLiuLiang === true ? (
                                                <div className={ style.hideShow }>
                                                    <span>
                                                        发送总数：每秒尝试发送的请求数
                                                    </span>
                                                    <br/>
                                                    <span>
                                                        发送成功数：每秒发送成功的请求数
                                                    </span>
                                                    <br/>
                                                    <span>
                                                        响应总数：每秒收到的响应数
                                                    </span>
                                                    <br/>
                                                    <span>
                                                        详情请查看
                                                        <a
                                                            href={ liuliangUrl }
                                                            target="_blank"
                                                        >
                                                            Ultron监控统计规则
                                                        </a>
                                                    </span>
                                                </div>
                                            ) : null
                                        }
                                    </span>
                                    <div className={ style.chart }>
                                        <EChartSimple data={ this.model.dataChartQPS }/>
                                    </div>
                                </li>
                                <li>
                                    <span className={ style.name }>耗时（单位：毫秒）</span>
                                    <span
                                        onMouseOver={ this.haoShiIconOver }
                                        onMouseLeave={ this.haoShiIconLeave }
                                        className={ style.icon }
                                    >
                                        <Icon
                                            type="question-circle"
                                            style={ { color: '#1890ff' } }
                                        />
                                        {
                                            this.model.isHaoshi === true ? (
                                                <div className={ style.hideShow }>
                                                    <span>
                                                            平均耗时：当前这一时刻所有请求的平均响应时间
                                                        </span>
                                                    <br/>
                                                    <span>
                                                            75分位：75%的请求的最大响应耗时
                                                        </span>
                                                    <br/>
                                                    <span>
                                                            95分位：95%的请求的最大响应耗时
                                                        </span>
                                                    <br/>
                                                    <span>
                                                        详情请查看
                                                        <a
                                                            href={ liuliangUrl }
                                                            target="_blank"
                                                        >
                                                            Ultron监控统计规则
                                                        </a>
                                                    </span>
                                                </div>
                                            ) : null
                                        }
                                    </span>
                                    <div className={ style.chart }>
                                        <EChartSimple data={ this.model.dataChartAver }/>
                                    </div>
                                </li>
                            </ul>
                            <div className={ style.code }>
                                <div className={ style.oLi }>
                                    {
                                        Number(this.model.types) === 4 ? (
                                            <span className={ style.name }>响应错误码（每10秒钟）</span>
                                        ) : (
                                            <span className={ style.name }>HTTP响应码（每10秒钟）</span>
                                        )
                                    }
                                    <span
                                        onMouseOver={ this.xiangYingIconOver }
                                        onMouseLeave={ this.xiangYingIconLeave }
                                        className={ style.icon }
                                    >
                                        <Icon
                                            type="question-circle"
                                            style={ { color: '#1890ff' } }
                                        />
                                        {
                                            this.model.isXiangYing === true ? (
                                                <div className={ style.hideShow }>
                                                    <span>
                                                            统计粒度：10s，即图中每一节点为10s数据的聚合
                                                        </span>
                                                    <br/>
                                                    <span>
                                                        点击
                                                        <a
                                                            href={ liuliangUrl }
                                                            target="_blank"
                                                        >
                                                            Ultron监控统计规则
                                                        </a>
                                                        查看常见响应码
                                                    </span>
                                                </div>
                                            ) : null
                                        }
                                    </span>
                                    <div>
                                        <EChartSimple data={ this.model.dataChartError }/>
                                    </div>
                                </div>
                                {
                                    String(this.model.types) !== '4' ? (
                                        <div className={ style.oLi }>
                                            <span className={ style.name }>
                                                业务码
                                                {
                                                    this.model.businessCode ? (
                                                        '(' + this.model.businessCode + ')'
                                                    ) : null
                                                }
                                                （每10秒钟）
                                            </span>
                                            <span
                                                onMouseOver={ this.businessCodeIconOver }
                                                onMouseLeave={ this.businessCodeIconLeave }
                                                className={ style.icon }
                                            >
                                                <Icon
                                                    type="question-circle"
                                                    style={ { color: '#1890ff' } }
                                                />
                                                {
                                                    this.model.isBusinessCode === true ? (
                                                        <div className={ style.hideShow }>
                                                        <span>
                                                            统计粒度：10s，即图中每一节点为10s数据的聚合
                                                        </span>
                                                            <br/>
                                                            <span>
                                                            点击
                                                            <a
                                                                href={ liuliangUrl }
                                                                target="_blank"
                                                            >
                                                                Ultron监控统计规则
                                                            </a>
                                                            查看使用方式
                                                        </span>
                                                        </div>
                                                    ) : null
                                                }
                                            </span>
                                            <div>
                                                <EChartSimple
                                                    data={ this.model.dataChartCode }
                                                    onClick={ this.setTime }
                                                />
                                            </div>
                                        </div>
                                    ) : null
                                }
                                <Modal
                                    visible={ this.model.isShow }
                                    closable={ false }
                                    width={ 800 }
                                    title="请求采样"
                                    footer={
                                        <Button
                                            onClick={ this.hide }
                                            type="primary"
                                        >取消
                                        </Button>
                                    }
                                >
                                    业务码：
                                    <RadioGroup
                                        value={ this.model.defaultRadioValue }
                                        size="small"
                                        onChange={ this.radioChange }
                                    >
                                        {
                                            this.model.dataArr.length > 0 &&
                                            this.model.dataArr.map((item, index) => {
                                                return (
                                                    <RadioButton
                                                        value={ item.code }
                                                        key={ index }
                                                        className={ style.radioStyle }
                                                    >
                                                        { item.code }
                                                    </RadioButton>
                                                );
                                            })
                                        }
                                    </RadioGroup>
                                    <div className={ style.border }>
                                        <Row gutter={ 8 }>
                                            <Col span={ 3 }>trace_id</Col>
                                            <Col span={ 21 }>
                                                <a
                                                    href={
                                                        'http://bamai.xiaojukeji.com/search/trace?key='
                                                        + this.model.obj.trace_id + '&index=allindex'
                                                    }
                                                    target="_blank"
                                                    style={ { textDecoration: 'none', color: '#666' } }
                                                >
                                                    {
                                                        this.model.obj.trace_id
                                                    }
                                                </a>
                                            </Col>
                                        </Row>
                                        <Row gutter={ 8 }>
                                            <Col span={ 3 }>request</Col>
                                            <Col span={ 21 }>
                                                {
                                                    this.model.obj.request && (
                                                        <SyntaxHighlighter language="json" style={ ascetic }>
                                                            {
                                                                JSON.stringify(JSON.parse(this.model.obj.request),
                                                                    null, 2)
                                                            }
                                                        </SyntaxHighlighter>
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                        <Row gutter={ 8 }>
                                            <Col span={ 3 }>response</Col>
                                            <Col span={ 21 }>
                                                {
                                                    this.model.obj.response && (
                                                        <SyntaxHighlighter language="json" style={ ascetic }>
                                                            {
                                                                JSON.stringify(JSON.parse(this.model.obj.response),
                                                                    null, 2) }
                                                        </SyntaxHighlighter>
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                        <Row gutter={ 8 }>
                                            <Col span={ 3 }>error</Col>
                                            <Col span={ 21 }>
                                                {
                                                    this.model.obj.error
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    )
                }
                {
                    String(this.model.types) !== '4' ? (this.model.showHide === 'none' ? (
                        <div
                            onClick={ this.isBlock }
                            className={ style.zhankai }
                        >
                            <span>点击展开</span>&nbsp;<Icon type="arrow-down" style={ { color: '#808080' } }/>
                        </div>
                    ) : (
                        <div
                            onClick={ this.isNone }
                            className={ style.shouqi }
                        >
                            <span>点击收起</span>&nbsp;<Icon type="arrow-up" style={ { color: '#808080' } }/>
                        </div>
                    )) : null
                }
            </div>
        );
    }
}
