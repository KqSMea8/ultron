import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import { observable, action, runInAction, computed } from 'mobx';
import * as ILangDecodeoid from '@ultron/remote/tool/interfaces/ILangDecodeoid';
import { getDecode, getEncode } from '@ultron/remote/tool';
import message from '@antd/message';
const base64Js = require('base-64');
export interface ICreateWorkOrderQuery {
}
export interface IModelList {
    district: string;
    shortOrder: string;
    langOrder: string;
    baseOrder: string;
}

let count: number = 0;
/**
 * 列表项
 */
export class ModelListItem {
    public key: string = String(count++);
    public item: IModelList;

    constructor(p: IModelList) {
        this.item = p;
    }

    /**
     * 区号
     * @returns {any}
     */
    public get vDistrict(): string {
        return this.item.district;
    }

    /**
     * 短订单号
     * @returns {any}
     */
    public get vShortOrder(): string {
        return this.item.shortOrder;
    }

    /**
     * 长订单号
     * @returns {any}
     */
    public get vLangOrder(): string {
        return this.item.langOrder;
    }

    /**
     * Base64订单号
     * @returns {any}
     */
    public get vBaseOrder(): string {
        return this.item.baseOrder;
    }
}

export default class ModelOrderChange extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public settingType: string = 'lang';
    @observable public langOrder: string = '';
    @observable public shortOrder: string = '';
    @observable public areaCode: string = '';
    @observable public list: ModelListItem[] = [];
    @observable public lists: ModelListItem[] = [];

    constructor(query?: ICreateWorkOrderQuery, S?: string) {
        super();
        this.initByQueryFields(query);
    }
    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return [];
    }

    public async loadData(): Promise<void> {
        if (this.settingType === 'lang') {
            if (this.langOrder === '') {
                message.error('订单号不能为空');
            } else {
                let langOrder;
                let langBaseOrder;
                /^\d+$/.test(this.langOrder) ? langOrder = this.langOrder : langBaseOrder = this.langOrder;
                if (langOrder && !langBaseOrder) {
                    langBaseOrder = base64Js.encode(base64Js.encode(langOrder));
                }
                if (!langOrder && langBaseOrder) {
                    langOrder = base64Js.decode(base64Js.decode(langBaseOrder));
                }
                try {
                    const resData = await getDecode({
                        oid: langBaseOrder
                    });
                    if (resData && Object.keys(resData).length > 0) {
                        const dataArray = [] as any;
                        const data = {
                            district: resData.district,
                            shortOrder: resData.oid,
                            langOrder: langOrder,
                            baseOrder: langBaseOrder
                        };
                        dataArray.push(data);
                        if (dataArray.length > 0) {
                            this.list = dataArray.map((item) => new ModelListItem(item));
                        }
                    }
                } catch (e) {}
            }
        } else {
            if (this.shortOrder === '' || this.areaCode === '') {
                message.error('订单号和区号不能为空');
            } else {
                try {
                    const ajaxParams = {
                        oid: this.shortOrder,
                        district: this.areaCode
                    };
                    const resData = await getEncode(ajaxParams);
                    if (resData && Object.keys(resData).length > 0) {
                        const langOrder = base64Js.decode(base64Js.decode(resData.oid));
                        const dataArray = [] as any;
                        const data = {
                            district: this.areaCode,
                            shortOrder: this.shortOrder,
                            langOrder: langOrder,
                            baseOrder: resData.oid
                        };
                        dataArray.push(data);
                        if (dataArray.length > 0) {
                            this.lists = dataArray.map((item) => new ModelListItem(item));
                        }
                    }
                } catch (e) {}
            }
        }
    }

    /**
     * 选择订单类型
     * @param val
     */
    @action
    public changeSettingType(val): void {
        this.settingType = val;
    }

    /**
     * 设置长订单号
     * @param val
     */
    @action
    public setLangOrder(val): void {
        this.langOrder = val;
    }

    /**
     * 设置短订单号
     * @param val
     */
    @action
    public setShortOrder(val): void {
        this.shortOrder = val;
    }

    /**
     * 设置区号
     * @param val
     */
    @action
    public setAreaCode(val): void {
        this.areaCode = val;
    }
}
