import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import {action, observable, runInAction} from 'mobx';
import { targetLists, moduleLists, businessOptionsLists } from '@ultron/remote/plate';
export interface ICreateWorkOrderQuery {
    businessId: string;
    type: string;
    businessName: string;
}

/**
 * 压测大盘
 */

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
 * @param hasPoint 是否保留两位小数位
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
                result = `${hasPoint ? Math.round(num * 100) / 100 : num}${parseMap[key]}`;
                break;
            }
        }
    }

    return result;
};
export default class ModelPlate extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public type: string = 'aa';
    @observable public datas: any[] = [];
    @observable public moduleData: any[] = [];
    @observable public businessId: string = '';
    @observable public tabKey: string = '';
    @observable public businessName: string = '';
    @observable public loading: boolean = false;
    @observable public difference: any[] = [];
    @observable public businessOptionsData: any[] = [];
    @observable public complianceRateLeftPadding: number = 0;
    @observable public complianceRateRightPadding: number = 0;
    @observable public businessModuleLeftPadding: number = 0;
    @observable public businessModuleRightPadding: number = 0;
    @observable public query: ICreateWorkOrderQuery;
    constructor(query: ICreateWorkOrderQuery, S?: string) {
        super();
        this.getComplianceRatePadding();
        this.getBusinessModulePadding();
        this.businessId = query.businessId;
        this.tabKey = query.type;
        this.businessName = query.businessName;
        this.query = query;
        this.initByQueryFields(query);
        this.loadBusinessOptionsList();
        this.loadDataList();
        this.loadDataLists();
        window.onresize = () => {
            this.getComplianceRatePadding();
            this.getBusinessModulePadding();
        };
    }
    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return ['type'];
    }
    protected getComplianceRatePadding(): void {
        const clientWidth: any = document.documentElement;
        if ((clientWidth.clientWidth - 200) % 295 - 20) {
            this.complianceRateLeftPadding = ((clientWidth.clientWidth - 200) % 295 - 20) / 2 + 20;
            this.complianceRateRightPadding = ((clientWidth.clientWidth - 200) % 295 - 20) / 2;
        } else {
            this.complianceRateLeftPadding = ((clientWidth.clientWidth - 200) % 295 - 20 + 295) / 2 + 20;
            this.complianceRateRightPadding = ((clientWidth.clientWidth - 200) % 295 - 20 + 295) / 2;
        }
    }
    protected getBusinessModulePadding(): void {
        const clientWidth: any = document.documentElement;
        if ((clientWidth.clientWidth - 200) % 350 - 20) {
            this.businessModuleLeftPadding = ((clientWidth.clientWidth - 200) % 350 - 20) / 2 + 20;
            this.businessModuleRightPadding = ((clientWidth.clientWidth - 200) % 350 - 20) / 2;
        } else {
            this.businessModuleLeftPadding = ((clientWidth.clientWidth - 200) % 350 - 20 + 350) / 2 + 20;
            this.businessModuleRightPadding = ((clientWidth.clientWidth - 200) % 350 - 20 + 350) / 2;
        }
    }
    @action
    /**
     * changeMenuSelectedKeys
     */
    public changeMenuSelectedKeys(MenuSelectedKeys, businessName) {
        this.businessId = MenuSelectedKeys;
        this.businessName = businessName;
        this.loadDataList();
        this.loadDataLists();
    }
    @action
    /**
     * changeType
     */
    public changeType(type) {
        this.type = type;
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
                        formatter: `实际: ${ParseNumToKMBT(data.test, true)}`,
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
    public createOption(obj) {
        let axisLineColor: any[] = [];
        switch (true) {
            case obj['ratio'] < 0.6:
            axisLineColor = [[obj['ratio'].toFixed(1), '#FE0000'], [1, '#E4E8EB']];
            break;
            case obj['ratio'] >= 0.6 && obj['ratio'] < 1:
            axisLineColor = [[obj['ratio'].toFixed(1), '#FA8919'], [1, '#E4E8EB']];
            break;
            default:
            axisLineColor = [[1, '#11A699']];
            break;

        }
        const option = {
            title: {
                text: '达标率',
                textStyle: {
                    fontSize: 12,
                    color: '#CDCDCD'
                },
                left: 55,
                bottom: 58
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
                        formatter: '{value}%',
                        fontSize: 22,
                        fontWeight: 500,
                        offsetCenter: [0, 17],
                        color: axisLineColor[0][1]
                    },
                    pointer : {
                        show: false
                    },
                    startAngle: 200,
                    endAngle: -25,
                    radius: [65],
                    center: ['43%', 70],
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
                                value: Math.round(obj['ratio'] * 100)
                            }
                    ]
                }
            ]
        };
        return option;
    }
    public async loadDataList(): Promise<void> {
        runInAction(() => {
            this.loading = true;
        });
        try {
            const result = await targetLists({}, { businessId: this.businessId });
            this.datas = [];
            if (Object.keys(result).length > 0) {
                for ( const arr in result) {
                    if (result) {
                        const obj = {
                            title: arr,
                            value: result[arr]
                        };
                        this.datas.push(obj);
                    }
                }
                // console.log(this.datas);
            }
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }
    public async loadDataLists(): Promise<void> {
        try {
            const resData = await moduleLists({}, { businessId: this.businessId });
            this.moduleData = [];
            if (resData.length > 0) {
                this.moduleData = resData;
            }
            // console.log(this.moduleData);
        } catch (e) {}
    }
    public async loadBusinessOptionsList(): Promise<void> {
        try {
            const resData = await businessOptionsLists({}, {});
            this.businessOptionsData = resData;
        } catch (e) {}
    }
}
