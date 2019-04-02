import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import { action, observable, runInAction } from 'mobx';
import moment from 'moment';
import {
    businessOptionsLists,
    targetDetail,
    targetDetailEcharts,
    targetDetailHistory
} from '@ultron/remote/plate';
export interface ICreateWorkOrderQuery {
    businessId: string;
    type: string;
    businessName: string;
    id: string;
}

/**
 * 压测大盘
 */
export default class ModelPlate extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public type: string = 'aa';
    @observable public businessId: string = '';
    @observable public tabKey: string = '';
    @observable public businessName: string = '';
    @observable public loading: boolean = false;
    @observable public businessOptionsData: any[] = [];
    @observable public id: string = ''; // 给后端传的id
    @observable public resBusinessName: string = ''; // 专快（国内）
    @observable public moduleName: string = ''; // 指标所属模块
    @observable public indicatorName: string = '';
    @observable public prod: any = {};
    @observable public test: any = {};
    @observable public goal: any = {};
    @observable public relation: any = [];
    @observable public echartsData: any = {};
    @observable public echartsDatas: any = {};
    @observable public leftTitle: string = '';
    @observable public leftTime: string = '';
    @observable public rightTitle: string = '';
    @observable public rightTime: string = '';
    @observable public time: string = '15552000000';
    @observable public startTime: string = '';
    @observable public historyArr: any = [];
    @observable public actual: number = 0;
    @observable public goals: number = 0;
    @observable public topGoals: number = 0;
    @observable public goalsArr: any = [];
    @observable public topGoalsArr: any = [];
    @observable public goalWid: string = '0%';
    @observable public testWid: string = '0%';
    @observable public prodWid: string = '0%';
    @observable public moduleId: string = '';
    @observable public isAddPressureHistory: boolean = false;

    constructor(query: ICreateWorkOrderQuery, S?: string) {
        super();
        this.businessId = query.businessId;
        this.tabKey = query.type;
        this.businessName = query.businessName;
        this.id = query.id;
        this.loadBusinessOptionsList();
    }

    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return ['type'];
    }

    @action
    /**
     * changeMenuSelectedKeys
     */
    public changeMenuSelectedKeys(MenuSelectedKeys, businessName) {
        this.businessId = MenuSelectedKeys;
        this.businessName = businessName;
    }
    @action
    /**
     * 新增压测历史
     */
    public addPressureHistory(isAddPressureHistory: boolean) {
        this.isAddPressureHistory = isAddPressureHistory;
    }

    public async loadBusinessOptionsList(): Promise<void> {
        try {
            const resData = await businessOptionsLists({}, {});
            this.businessOptionsData = resData;
        } catch (e) {
        }
    }

    /**
     * 获取容量指标详情
     */
    public async getTargetDetail(): Promise<void> {
        try {
            const resData = await targetDetail({}, { id: this.id });
            if (resData) {
                runInAction(() => {
                    this.resBusinessName = resData.businessName;
                    this.moduleName = resData.moduleName;
                    this.indicatorName = resData.indicatorName;
                    this.moduleId = String(resData.moduleId);
                    this.prod = resData.prod;
                    this.test = resData.test;
                    this.goal = resData.goal;
                    this.topGoalsArr = [
                        resData.goal.goal || 0,
                        resData.test.capacityActual || 0,
                        resData.prod.capacityActual || 0
                    ];
                    this.topGoals = this.topGoalsArr.reduce((pre, cur) => {
                        return pre > cur ? pre : cur;
                    });
                    if (Number(resData.goal.goal) !== 0) {
                        if (Math.ceil((resData.goal.goal / this.topGoals) * 100) < 20) {
                            this.goalWid = '25%';
                        } else {
                            this.goalWid = String(Math.ceil((resData.goal.goal / this.topGoals) * 100)) + '%';
                        }
                    } else {
                        this.goalWid = '0px';
                    }
                    if (Number(resData.test.capacityActual) !== 0) {
                        if (Math.ceil((resData.test.capacityActual / this.topGoals) * 100) < 20) {
                            this.testWid = '25%';
                        } else {
                            this.testWid = String(Math.ceil((resData.test.capacityActual / this.topGoals) * 100)) + '%';
                        }
                    } else {
                        this.testWid = '0px';
                    }
                    if (Number(resData.prod.capacityActual) !== 0) {
                        if (Math.ceil((resData.prod.capacityActual / this.topGoals) * 100) < 20) {
                            this.prodWid = '25%';
                        } else {
                            this.prodWid = String(Math.ceil((resData.prod.capacityActual / this.topGoals) * 100)) + '%';
                        }
                    } else {
                        this.prodWid = '0px';
                    }
                    if (Object.keys(resData.relation).length > 0) {
                        const obj = {
                            name: '',
                            value: ''
                        };
                        for (const key in resData.relation) {
                            if (resData.relation.hasOwnProperty(key)) {
                                obj.name = key;
                                obj.value = resData.relation[key];
                                this.relation.push(obj);
                            }
                        }
                    }
                });
            }
        } catch (e) {
        }
    }

    /**
     * 获取echarts图表数据
     */
    public async getTargetDetailEcharts(): Promise<void> {
        try {
            const result = await targetDetailEcharts({}, { id: this.id });
            if (result.length > 0) {
                if (result[0]) {
                    this.leftTitle = result[0].dataTypeDesc;
                    this.leftTime = moment(result[0].beginTime * 1000).format('YYYY-MM-DD');
                }
                if (result[1]) {
                    this.rightTitle = result[1].dataTypeDesc;
                    this.rightTime = moment(result[1].beginTime * 1000).format('YYYY-MM-DD');
                }
                this.newChart(result);
            } else {
                this.newChart([{curve: []}, {curve: []}]);
            }
        } catch (e) {
        }
    }
    public async getHistory(): Promise<void> {
        this.startTime = String(Math.ceil((new Date().getTime() - Number(this.time)) / 1000));
        try {
            const ajaxParams = {
                start: this.startTime
            };
            const resData = await targetDetailHistory(ajaxParams, { id: this.id });
            this.historyArr = resData as any;
            resData.map((item) => {
                this.goalsArr.push(item.actual);
            });
            this.goals = this.goalsArr.reduce((pre, cur) => {
                return pre > cur ? pre : cur;
            });
        } catch (e) {}
    }

    /**
     * 绘制echarts图表
     * @param data
     */

    @action
    private newChart(data) {
        let dataSource: any[] = [];
        let dataSources: any[] = [];
        if (data[0]) {
            dataSource = data[0].curve;
        } else {
            dataSource = [{curve: []}];
        }
        if (data[1]) {
            dataSources = data[1].curve;
        } else {
            dataSources = [{curve: []}];
        }
        const chartConfig: any = {
            seriesData: [],
            xAxisData: []
        };
        const chartConfigs: any = {
            seriesData: [],
            xAxisData: []
        };
        dataSource.forEach((item: any, index: number) => {
            chartConfig.seriesData.push({
                value: item.value,
                name: +item.time * 1000
            });
            if (item.time) {
                chartConfig.xAxisData.push(moment(item.time * 1000).format('HH:mm'));
            }
        });
        dataSources.forEach((item: any, index: number) => {
            chartConfigs.seriesData.push({
                value: item.value,
                name: +item.time * 1000
            });
            if (item.time) {
                chartConfigs.xAxisData.push(moment(item.time * 1000).format('HH:mm'));
            }
        });
        this.echartsData = this.createOption(chartConfig);
        this.echartsDatas = this.createOption(chartConfigs);
    }

    public createOption(chartConfig) {
        return {
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    start: 0,
                    end: 100
                }
            ],
            grid: {
                left: 55,
                top: 40
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: chartConfig.xAxisData
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: chartConfig.seriesData,
                type: 'line'
            }]
        };
    }
    @action
    public setTime(val): void {
        this.time = val;
        this.getHistory();
    }
}
