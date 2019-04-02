import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import { IIsCanSave } from 'com/didichuxing/commonInterface/IIsCanSave';
import { IModelTestConfig } from '@ultron/business/modelTestConfig/IConfig';
import ModelTestConfigGroup from '@ultron/business/modelTestConfig/models/ConfigGroup';
import { ETestConfigType, textTestConfigType } from '@ultron/business/common/enum/ETestConfigType';

/**
 * 测试配置业务模型
 */
export default abstract class AModelTestConfig implements IModelTestConfig, IIsCanSave {
    public id?: string;
    public name?: string;
    public group: ModelTestConfigGroup;
    public creator?: string;
    public readonly type?: ETestConfigType;

    constructor() {
        this.group = new ModelTestConfigGroup();
    }

    public get valType(): string {
        return textTestConfigType(this.type || ETestConfigType.HttpSingle);
    }

    /**
     * 保存：前置检查，可取消保存操作
     * @returns {Promise<IResultBoolean>}
     */
    public abstract async isCanSave(): Promise<IResultBoolean>;

    /**
     * 保存：正式发出请求
     * @returns {Promise<IResultBoolean>}
     */
    protected abstract async doSave(): Promise<IResultBoolean>;

    /**
     * 保存
     * @returns {Promise<IResultBoolean>}
     */
    public async save(): Promise<IResultBoolean> {
        let result = await this.isCanSave();
        if (result.isPass) {
            result = await this.doSave();
        }
        return result;
    }
}
