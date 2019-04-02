import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import { observable, action } from 'mobx';
import { getDistance } from '@ultron/remote/tool';
import message from '@antd/message';
export interface ICreateWorkOrderQuery {
}

export default class ModelPressureUser extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public fromAry: string = '';
    @observable public destAry: string = '';
    @observable public computeResult: string = '';
    @observable public countryType: string = 'China';
    @observable public chinaLeft: string = '';
    @observable public chinaRight: string = '';
    @observable public brazilLeft: string = '';
    @observable public brazilRight: string = '';
    @observable private cur: any[] = [];
    @observable private rightCur: any[] = [];
    @observable private destArys: any[] = [];
    @observable private fromArys: any[] = [];
    @observable public objArray: any[] = [];
    @observable public objArrays: any[] = [];
    @observable public infoWindowPos: {} = {};
    @observable public infoWindowPoss: {} = {};
    @observable public isShow: boolean = false;
    @observable public isShows: boolean = false;

    constructor(query?: ICreateWorkOrderQuery, S?: string) {
        super();
        this.initByQueryFields(query);
    }

    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return [];
    }

    /**
     * 请求数据
     * @returns {Promise<void>}
     */
    public async compute(): Promise<void> {
        if (this.fromAry === '') {
            message.error('起点不能为空');
        } else if (this.destAry === '') {
            message.error('终点不能为空');
        } else {
            try {
                const startArray = this.fromAry.replace('，', ',').split(',');
                const endArray = this.destAry.replace('，', ',').split(',');
                const ajaxParams = {
                    fLng: startArray[0],
                    fLat: startArray[1],
                    tLng: endArray[0],
                    tLat: endArray[1]
                };
                const resData = await getDistance(ajaxParams);
                if (resData || resData === 0) {
                    this.computeResult = resData as any;
                }
            } catch (e) {
            }
        }
    }

    /**
     * 经度范围
     * @param lng
     * @returns {boolean}
     */
    private checkLng(lng) {
        return (lng < -180) || (lng > 180);
    }

    /**
     * 纬度范围
     * @param lat
     * @returns {boolean}
     */
    private checkLat(lat) {
        return (lat < -90) || (lat > 90);
    }

    /**
     * 浮点数
     * @param num
     * @returns {string}
     */
    private fixPoint(num) {
        return num.toFixed(8).replace(/\.?0+$/, '');
    }

    /**
     * 起点赋值事件
     * @param val
     */
    @action
    public setFromAry(val): void {
        this.fromAry = val;
    }

    /**
     * 终点赋值事件
     * @param val
     */
    @action
    public setDestAry(val): void {
        this.destAry = val;
    }

    /**
     * 选择国家
     * @param val
     */
    @action
    public setCountryType(val): void {
        this.countryType = val;
    }

    /**
     * 中国偏移传值事件
     * @param val
     */
    @action
    public setChinaLeft(val): void {
        this.chinaLeft = val;
    }

    /**
     * 巴西偏移传值事件
     * @param val
     */
    @action
    public setBrazilLeft(val): void {
        this.brazilLeft = val;
    }

    /**
     * 中国还原传值事件
     * @param val
     */
    @action
    public setChinaRight(val): void {
        this.chinaRight = val;
    }

    /**
     * 巴西还原传值事件
     * @param val
     */
    @action
    public setBrazilRight(val): void {
        this.brazilRight = val;
    }

    /**
     * 坐标偏移事件
     */
    @action
    public setSkewing(): void {
        if (this.countryType === 'China') {
            this.objArray = [];
            this.destArys = [];
            if (this.chinaLeft === '') {
                message.error('请输入要偏移的坐标');
            } else {
                const fromValue = this.chinaLeft;
                const fromAry = fromValue.split('\n');
                fromAry.map((item, index) => {
                    const obj = {
                        longitude: item.replace('，', ',').split(',')[0],
                        latitude: item.replace('，', ',').split(',')[1]
                    };
                    const objs = {
                        position: obj
                    };
                    this.objArray.push(objs);
                });
                fromAry.forEach((item) => {
                    this.cur = item.replace('，', ',').split(',');
                    const lng = this.fixPoint(Number(this.cur[0]) - 230.80078);
                    const lat = this.fixPoint(Number(this.cur[1]) - 59.63827);
                    if (
                        this.checkLng(
                            this.cur[0]) || this.checkLng(lng) || this.checkLat(this.cur[1] || this.checkLat(lat)
                        )
                    ) {
                        this.destArys.push(['error']);
                    } else {
                        this.destArys.push([`${lng},${lat}`]);
                    }
                });
                this.chinaRight = this.destArys.join('\n');
            }
        } else {
            this.objArrays = [];
            this.destArys = [];
            if (this.brazilLeft === '') {
                message.error('请输入要偏移的坐标');
            } else {
                const fromValue = this.brazilLeft;
                const fromAry = fromValue.split('\n');
                fromAry.map((item, index) => {
                    const obj = {
                        longitude: item.replace('，', ',').split(',')[0],
                        latitude: item.replace('，', ',').split(',')[1]
                    };
                    const objs = {
                        position: obj
                    };
                    this.objArrays.push(objs);
                });
                fromAry.forEach((item) => {
                    this.cur = item.replace('，', ',').split(',');
                    const lng = this.fixPoint(Number(this.cur[0]) + 46.0);
                    const lat = this.fixPoint(Number(this.cur[1]) - 34.0);
                    if (
                        this.checkLng(
                            this.cur[0]) || this.checkLng(lng) || this.checkLat(this.cur[1] || this.checkLat(lat)
                        )
                    ) {
                        this.destArys.push(['error']);
                    } else {
                        this.destArys.push([`${lng},${lat}`]);
                    }
                });
                this.brazilRight = this.destArys.join('\n');
            }
        }
    }

    /**
     * 坐标还原事件
     */
    @action
    public setBack(): void {
        if (this.countryType === 'China') {
            this.objArray = [];
            this.fromArys = [];
            if (this.chinaRight === '') {
                message.error('请输入要还原的坐标');
            } else {
                const destValue = this.chinaRight;
                const destAry = destValue.split('\n');
                destAry.map((item, index) => {
                    const obj = {
                        longitude: item.replace('，', ',').split(',')[0],
                        latitude: item.replace('，', ',').split(',')[1]
                    };
                    const objs = {
                        position: obj
                    };
                    this.objArray.push(objs);
                });
                destAry.forEach((item) => {
                    this.rightCur = item.replace('，', ',').split(',');
                    const lng = this.fixPoint(Number(this.rightCur[0]) + 230.80078);
                    const lat = this.fixPoint(Number(this.rightCur[1]) + 59.63827);
                    if (
                        this.checkLng(this.rightCur[0])
                        || this.checkLng(lng) || this.checkLat(this.rightCur[1] || this.checkLat(lat))
                    ) {
                        this.fromArys.push(['error']);
                    } else {
                        this.fromArys.push([`${lng},${lat}`]);
                    }
                });
                this.chinaLeft = this.fromArys.join('\n');
            }
        } else {
            this.objArrays = [];
            this.fromArys = [];
            if (this.brazilRight === '') {
                message.error('请输入要还原的坐标');
            } else {
                const destValue = this.brazilRight;
                const destAry = destValue.split('\n');
                destAry.map((item, index) => {
                    const obj = {
                        longitude: item.replace('，', ',').split(',')[0],
                        latitude: item.replace('，', ',').split(',')[1]
                    };
                    const objs = {
                        position: obj
                    };
                    this.objArrays.push(objs);
                });
                destAry.forEach((item) => {
                    this.rightCur = item.replace('，', ',').split(',');
                    const lng = this.fixPoint(Number(this.rightCur[0]) - 46.0);
                    const lat = this.fixPoint(Number(this.rightCur[1]) + 34.0);
                    if (
                        this.checkLng(this.rightCur[0])
                        || this.checkLng(lng) || this.checkLat(this.rightCur[1] || this.checkLat(lat))
                    ) {
                        this.fromArys.push(['error']);
                    } else {
                        this.fromArys.push([`${lng},${lat}`]);
                    }
                });
                this.brazilLeft = this.fromArys.join('\n');
            }
        }
    }
}
