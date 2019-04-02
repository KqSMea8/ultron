import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import { observable, action, runInAction, computed } from 'mobx';
import * as ISearch from '@ultron/remote/tool/interfaces/ISearch';
import { getSearch } from '@ultron/remote/tool';
import message from '@antd/message';
export interface ICreateWorkOrderQuery {
}

let count: number = 0;
/**
 * 列表项
 */
export class ModelListItem {
    public key: string = String(count++);
    public item: ISearch.IReturnItem;

    constructor(p: ISearch.IReturnItem) {
        this.item = p;
    }

    /**
     * 类型
     * @returns {string}
     */
    public get vType(): string {
        return this.item.role;
    }

    /**
     * 地区
     * @returns {any}
     */
    public get vRegion(): string {
        return this.item.region;
    }

    /**
     * uid
     * @returns {any}
     */
    public get vUid(): string {
        return this.item.uid;
    }

    /**
     * 手机号
     * @returns {any}
     */
    public get vPhone(): string {
        return this.item.phone;
    }

    /**
     * 业务线
     * @returns {any}
     */
    public get vBusiness(): string {
        return this.item.business;
    }

    /**
     * 城市
     * @returns {any}
     */
    public get vCity(): string {
        if (Number(this.item.cityId) === -1) {
            return '--';
        } else {
            return this.item.cityId;
        }
    }
}

export default class ModelPressureUser extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public searchNumber: string = '';
    @observable public list: ModelListItem[] = [];

    constructor(query?: ICreateWorkOrderQuery, S?: string) {
        super();
        this.initByQueryFields(query);
    }
    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return [];
    }

    public async searchData(): Promise<void> {
        if (this.searchNumber === '') {
            message.error('UID或者手机号不能为空');
        }
        try {
            if (this.searchNumber !== '') {
                const resData = await getSearch({
                    checkValue: this.searchNumber
                });
                runInAction(() => {
                    if (resData && resData.length > 0) {
                        this.list = resData.map((item) => new ModelListItem(item));
                    }
                });
            }
        } catch (e) {}
    }

    /**
     * 接收传过来的UID或者手机号
     * @param val
     */
    @action
    public searchInput(val: string): void {
        this.searchNumber = val;
    }
}
