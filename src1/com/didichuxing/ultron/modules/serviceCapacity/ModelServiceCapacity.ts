
import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import {action, observable} from 'mobx';
import { ServiceCapacityParams } from '@ultron/remote/testPressure';
export interface ICreateWorkOrderQuery {
    type: string;
}

/**
 * 压测大盘
 */
export default class ModelpressureTestMarketConfig extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public type: string = 'aa';
    @observable public proportion: number = 0;
    @observable public difference: any[] = [];
    @observable public params: any[] = [];
    @observable public colorAny: any[] = [];
    @observable public dataChartAver: any = {};
    constructor(query?: ICreateWorkOrderQuery, S?: string) {
        super();
        this.initByQueryFields(query);
        this.loadDataList();
    }
    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return ['type'];
    }
    @action
    public createOption(obj) {
        this.proportion = Number(obj.two / obj.one);
        if (!obj.three) {
            obj.three = '';
        }
        if (obj.one === 0 || (obj.two > obj.one)) {
            this.difference = [
                {value: obj.two, name: ''},
                {value: 0, name: ''}
            ];
        } else {
            this.difference = [
                {value: obj.two, name: ''},
                {value: obj.one - obj.two, name: ''}
            ];
        }
        if (obj.one === 0 || obj.two === 0) {
            this.colorAny = ['#f44', '#f44'];
        } else if (this.proportion <= 0.5) {
            this.colorAny = ['#f44', '#f2f2f2'];
        } else if (this.proportion <= 0.9) {
            this.colorAny = ['#ef941a', '#f2f2f2'];
        } else if (this.proportion > 0.9) {
            this.colorAny = ['#393', '#f2f2f2'];
        }
        const option = {
            graphic: {
                type: 'text',
                left: 'center',
                top: 'center',
                z: 2,
                zlevel: 100,
                style: {
                    text:  '实际容量' + '\n\n' + obj.two  + '\n\n' + obj.three,
                    x: 100,
                    y: 100,
                    textAlign: 'center',
                    width: 30,
                    height: 30
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['60%', '70%'],
                    color: this.colorAny,
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: this.difference
                }
            ]
        };
        return option;
    }

    private async loadDataList(): Promise<void> {
        try {
            const result = await ServiceCapacityParams({});
            this.params = result;
        } catch { }
    }
}
