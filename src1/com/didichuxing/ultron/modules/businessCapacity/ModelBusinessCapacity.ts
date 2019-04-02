import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import {action, observable} from 'mobx';
import { BusinessCapacityParams } from '@ultron/remote/testPressure';
export interface ICreateWorkOrderQuery {
    type: string;
}

/**
 * 压测大盘
 */

export default class ModelBusinessCapacityConfig extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public type: string = 'aa';
    @observable public proportion: number = 0;
    @observable public difference: any[] = [];
    @observable public params: any[] = [];
    @observable public colorAny: any[] = [];
    @observable public dataChartAver: any = {};
    @observable public loading: boolean = true;
    @observable public leftPadding: number = 0;
    @observable public rightPadding: number = 0;
    constructor(query?: ICreateWorkOrderQuery, S?: string) {
        super();
        this.getPadding();
        this.initByQueryFields(query);
        this.loadDataList();
        window.onresize = () => {
            this.getPadding();
        };
    }
    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return ['type'];
    }
    protected getPadding(): void {
        const clientWidth: any = document.documentElement;
        if (clientWidth.clientWidth % 350 - 20) {
            this.rightPadding = (clientWidth.clientWidth % 350 - 20) / 2;
            this.leftPadding = (clientWidth.clientWidth % 350 - 20) / 2 + 20;
        } else {
            this.rightPadding = (clientWidth.clientWidth % 350 + 350 - 20) / 2;
            this.leftPadding = (clientWidth.clientWidth % 350 + 350 - 20) / 2 + 20;
        }
    }
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
                        fontSize: 25,
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

    private async loadDataList(): Promise<void> {
        try {
            const result = await BusinessCapacityParams({});
            this.loading = false;
            this.params = result;
        } catch { }
    }
}
