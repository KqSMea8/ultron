import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import {action, observable} from 'mobx';
import { businessOptionsLists } from '@ultron/remote/plate';
import { BusinessDetailsParams, BusinessDetailsModalParams } from '@ultron/remote/testPressure';
export interface ICreateWorkOrderQuery {
    type: string;
}

/**
 * 压测大盘
 */

export default class ModelBusinessCapacityConfig extends AModuleModel implements ICreateWorkOrderQuery {
    @observable public query: any = {};
    @observable public loading: boolean = true;
    @observable public topType: number = 1;
    @observable public params = {};
    @observable public modalData = {};
    @observable public defaultKey: string = '';
    @observable public businessDetailsTitle: string = '专快全链路';
    @observable public type: string = 'aa';
    @observable public businessOptionsData: any[] = [];
    @observable public selectedKey: string = '';
    constructor(query?: ICreateWorkOrderQuery, S?: string) {
        super();
        this.query = query;
        this.initByQueryFields(query);
        this.loadDataList(query);
    }
    @action
    /**
     * changeSelectedKey
     */
    public changeSelectedKey(selectedKey: string) {
        this.selectedKey = selectedKey;
    }
    @action
    /**
     * 更新BusinessDetailsParams
     */
    public updataDetailData(topType) {
        this.topType = topType;
        this.loadDataList(this.query);
    }
    /**
     * 获取对话框数据
     */
    public async getModalData(metricId: string) {
        try {
            const result = await BusinessDetailsModalParams({
                metricId
            });
            this.modalData = result;
        } catch { }
    }
    protected getQueryFields(): Array<keyof ICreateWorkOrderQuery> {
        return ['type'];
    }

    private async loadDataList(query): Promise<void> {
        try {
            const businessOptionsData = await businessOptionsLists({}, {});
            const result = await BusinessDetailsParams({
                topType: this.topType
            }, query.reportId || 1);
            this.businessOptionsData = businessOptionsData;
            this.loading = false;
            this.params = result || {};
            this.defaultKey = result && Object.keys(result['detail']).length ? Object.keys(result['detail'])[0] : '';
        } catch { }
    }
}
