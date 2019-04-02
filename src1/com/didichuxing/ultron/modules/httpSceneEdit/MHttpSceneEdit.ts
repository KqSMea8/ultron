
import { IPlainObject } from 'com/didichuxing/IPlainObject';
import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import ModelTestConfigScene from '@ultron/business/modelTestConfig/models/ConfigHttpScene';

/**
 * Http单接口更多配置业务模型
 */
export default class ModelSceneConfig extends AModuleModel {

    public modelTestConfigScene;

    constructor(query: IPlainObject = {}) {
        super();

        this.initByQueryFields(query);
        this.modelTestConfigScene = new ModelTestConfigScene(query.planId, query.planName, query.cloneId);
    }

    protected getQueryFields(): string[] {
        return [];
    }
}
