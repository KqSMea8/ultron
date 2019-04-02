import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import { action, observable, runInAction } from 'mobx';
import moment from 'moment';
import {
    businessOptionsLists,
    moduleDetailEcharts,
    moduleDetailHistory
} from '@ultron/remote/plate';
export interface ICreateWorkOrderQuery {
    businessId: string;
    type: string;
    businessName: string;
    id: string;
    name: string;
}

/**
 * 将数字转换为千位符
 * @param num
 * @example 1000 => 1,000
 */
export const ParseNumToKbit = (num: string | number): string => {
    return num.toString().replace(/(\d{1,3})(?=(\d{3})+($|\.))/g, '$1,');
};

/**
 * 将数字转换为K、M、B、T
 * @param num 数字
 * @param hasPoint 是否保留小数位
 * @example 1000 => 1K
 */
export const ParseNumToKMBT = (num: number, hasPoint?: boolean) => {
    let result: number | string = num;
    const parseMap = {
        1000: 'K',
        1000000: 'M',
        1000000000: 'B',
        1000000000000: 'T'
    };
    if (result < 10000) {
        result = ParseNumToKbit(result);
    } else {
        for (const key in parseMap) {
            if (parseMap.hasOwnProperty(key) && num >= +key && num < +key * 1000) {
                num = num / +key;
                result = `${hasPoint ? num : Math.round(num)}${parseMap[key]}`;
                break;
            }
        }
    }

    return result;
};

/**
 * 压测大盘
 */
export default class ModelPlate extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public type: string = 'aa';
    @observable public datas: any[] = [];
    @observable public businessId: string = '';
    @observable public tabKey: string = '';
    @observable public businessName: string = '';
    @observable public loading: boolean = false;
    @observable public businessOptionsData: any[] = [];
    @observable public complianceRateLeftPadding: number = 0;
    @observable public complianceRateRightPadding: number = 0;
    @observable public id: string = ''; // 给后端传的moduleId
    @observable public indicatorName: string = '';
    @observable public name: string = '';
    @observable public time: string = '15552000000';
    @observable public startTime: string = '';
    @observable public historyData: any = [];
    @observable public query: ICreateWorkOrderQuery;

    constructor(query: ICreateWorkOrderQuery, S?: string) {
        super();
        this.businessId = query.businessId;
        this.tabKey = query.type;
        this.businessName = query.businessName;
        this.name = query.name;
        this.id = query.id;
        this.query = query;
        this.loadBusinessOptionsList();
        this.getComplianceRatePadding();
        window.onresize = () => {
            this.getComplianceRatePadding();
        };
    }

    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return ['type'];
    }

    protected getComplianceRatePadding(): void {
        const clientWidth: any = document.documentElement;
        if (((clientWidth.clientWidth - 200 - 30) % 295 - 20) / 2 + 20) {
            this.complianceRateLeftPadding = ((clientWidth.clientWidth - 200 - 30) % 295 - 20) / 2 + 20;
            this.complianceRateRightPadding = ((clientWidth.clientWidth - 200 - 30) % 295 - 20) / 2;
        } else {
            this.complianceRateLeftPadding = ((clientWidth.clientWidth - 200 - 30) % 295 - 20 + 295) / 2 + 20;
            this.complianceRateRightPadding = ((clientWidth.clientWidth - 200 - 30) % 295 - 20 + 295) / 2;
        }
    }

    @action
    /**
     * changeMenuSelectedKeys
     */
    public changeMenuSelectedKeys(MenuSelectedKeys, businessName) {
        this.businessId = MenuSelectedKeys;
        this.businessName = businessName;
    }

    public async loadBusinessOptionsList(): Promise<void> {
        try {
            const resData = await businessOptionsLists({}, {});
            this.businessOptionsData = resData;
        } catch (e) {
        }
    }
    public async getEchartsData(): Promise<void> {
        try {
            const resData = await moduleDetailEcharts({}, { moduleId: this.id });
            this.datas = [];
            if (Object.keys(resData).length > 0) {
                for ( const arr in resData) {
                    if (resData) {
                        const obj = {
                            title: arr,
                            value: resData[arr]
                        };
                        this.datas.push(obj);
                    }
                }
            }
        } catch (e) {}
    }
    public async getHistory(): Promise<void> {
        this.startTime = String(Math.ceil((new Date().getTime() - Number(this.time)) / 1000));
        try {
            const ajaxParams = {
                start: this.startTime
            };
            const result = await moduleDetailHistory(ajaxParams, { moduleId: this.id });
            this.historyData = result as any;
        } catch (e) {}
    }
    @action
    public createOptionComplianceRate(data) {
        let axisLineColor: any[] = [];
        switch (true) {
            case Math.round((data.test / data.goal) * 10) / 10 < 1:
                axisLineColor = [[Math.round((data.test / data.goal) * 10) / 10, '#FA8919'], [1, '#E4E8EB']];
                break;
            default:
                axisLineColor = [[1, '#11A699']];
                break;
        }
        const option = {
            title: {
                text: data.goal === 0 ? ' ' : `目标: ${ParseNumToKMBT(data.goal, true)}`,
                textStyle: {
                    fontSize: 14,
                    fontWeight: 400,
                    color: 'rgba(0,0,0,0.65)'
                },
                left: 'center',
                bottom: -2
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true}
                }
            },
            series: [
                {
                    name: '容量指标',
                    type: 'gauge',
                    detail : {
                        formatter: `实际: ${ParseNumToKMBT(data.test)}`,
                        fontSize: 16,
                        color: 'rgba(0, 0, 0, 0.85)',
                        fontWeight: 500,
                        offsetCenter: [0, -5]
                    },
                    pointer : {
                        show: false
                    },
                    startAngle: 200,
                    endAngle: -25,
                    radius: [100],
                    center: ['50%', '80%'],
                    splitNumber: 10,       // 分割段数，默认为5
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: axisLineColor,
                            width: 10
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        splitNumber: 10,   // 每份split细分多少段
                        length : 0         // 属性length控制线长
                    },
                    axisLabel: {
                        show: false         // 坐标轴文本标签，详见axis.axisLabel
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        length : 0         // 属性length控制线长
                    },
                    data: [
                        {
                            // value: obj['ratio'].toFixed(2) * 100
                        }
                    ]
                }
            ]
        };
        return option;
    }
    @action
    public setTime(val): void {
        this.time = val;
        this.getHistory();
    }
}
