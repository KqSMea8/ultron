import { IPlainObject } from 'com/didichuxing/IPlainObject';
import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import ModelTestConfigMH from '@ultron/business/modelTestConfig/models/ConfigHttpMulti';

/**
 * Http多接口更多配置业务模型
 */
export default class ModelHttpMultiConfig extends AModuleModel {

    public modelTestConfigMH: ModelTestConfigMH;

    constructor(query: IPlainObject = {}) {
        super();

        this.initByQueryFields(query);
        this.modelTestConfigMH = new ModelTestConfigMH(query.planId, query.planName, query.cloneId);
    }

    protected getQueryFields(): string[] {
        return [];
    }
}
