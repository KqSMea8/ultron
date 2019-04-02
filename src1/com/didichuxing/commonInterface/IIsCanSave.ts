
import { IResultBoolean } from './IResultBoolean';

export interface IIsCanSave {
    /**
     * 保存：前置检查，可取消保存操作
     * @returns {Promise<IResultBoolean>}
     */
    isCanSave(): Promise<IResultBoolean>;
}
