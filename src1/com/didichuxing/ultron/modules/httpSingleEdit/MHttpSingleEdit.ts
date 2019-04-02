import { IPlainObject } from 'com/didichuxing/IPlainObject';
import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import ModelTestConfigSH from '@ultron/business/modelTestConfig/ConfigHttpSingle';
import { action, observable } from 'mobx';

/**
 * Http单接口更多配置业务模型
 */
export default class ModelHttpSingleConfig extends AModuleModel {

    public modelTestConfigSH: ModelTestConfigSH;
    @observable public tabKey: string = '1';

    constructor(query: IPlainObject = {}) {
        super();

        this.initByQueryFields(query);
        this.modelTestConfigSH = new ModelTestConfigSH(query.planId, query.planName, query.cloneId);
    }

    @action.bound
    public setTabKey(key: string) {
        this.tabKey = key;
    }

    protected getQueryFields(): string[] {
        return [];
    }
}
