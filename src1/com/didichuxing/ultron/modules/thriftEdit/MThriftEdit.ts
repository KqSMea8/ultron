import { IPlainObject } from 'com/didichuxing/IPlainObject';
import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import ModelTestConfigThrift from '@ultron/business/modelTestConfig/models/ConfigThrift';
import { action, observable } from 'mobx';

/**
 * thrift更多配置业务模型
 */
export default class ModelThriftConfig extends AModuleModel {

    public modelTestConfigThrift: ModelTestConfigThrift;
    @observable public tabKey: string = '1';

    constructor(query: IPlainObject = {}) {
        super();

        this.initByQueryFields(query);
        this.modelTestConfigThrift = new ModelTestConfigThrift(query.planId, query.planName, query.cloneId);
    }

    // @action.bound
    // public setTabKey(key: string) {
    //     this.tabKey = key;
    // }

    protected getQueryFields(): string[] {
        return [];
    }
}
