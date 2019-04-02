import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import { action, observable, runInAction } from 'mobx';
import moment from 'moment';
import {
    businessOptionsLists
} from '@ultron/remote/plate';
export interface ICreateWorkOrderQuery {
    businessId: string;
    type: string;
    businessName: string;
    id: string;
    name: string;
}

/**
 * 新建容量指标
 */
export default class ModelPlate extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public loading: boolean = false;
    @observable public type: string = 'aa';
    @observable public selectedKey: string = '';
    @observable public businessId: string = '';
    @observable public tabKey: string = '';
    @observable public businessName: string = '';
    @observable public businessOptionsData: any[] = [];
    @observable public id: string = '';
    @observable public name: string = '';
    @observable public query: ICreateWorkOrderQuery;
    @observable public module: any;
    @observable public layoutHeight: number = 0;

    constructor(query: ICreateWorkOrderQuery, S?: string) {
        super();
        this.businessId = query.businessId;
        this.tabKey = query.type;
        this.businessName = query.businessName;
        this.name = query.name;
        this.id = query.id;
        this.selectedKey = query['module'] || '';
        this.query = query;
        this.layoutHeight = document.documentElement.clientHeight - 64 - 50;
        this.loadBusinessOptionsList();
    }

    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return ['type'];
    }

    @action
    /**
     * changeSelectedKey
     */
    public changeSelectedKey(selectedKey: string) {
        this.selectedKey = selectedKey;
    }

    public async loadBusinessOptionsList(): Promise<void> {
        try {
            const resData = await businessOptionsLists({}, {});
            this.businessOptionsData = resData;
            window['businessOptionsData'] = resData;
        } catch (e) {
        }
    }
}
