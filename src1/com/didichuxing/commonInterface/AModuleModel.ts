import { action, observable, runInAction } from 'mobx';
import { IPlainObject } from 'src/com/didichuxing/IPlainObject';

export abstract class AModuleModel {

    /**
     * 与页面状态相关的字段名
     * @returns {string[]}
     */
    protected abstract getQueryFields(): string[];

    /**
     * 通用的可设置 observable 类型的字段
     * @param {string} key
     * @param val
     */
    @action
    private setVal(key: string, val: any) {
        this[key] = val;
    }

    /**
     * 根据 getQueryFields 在构造函数中初始化字段
     * @param {IPlainObject} query
     */
    protected initByQueryFields(query: IPlainObject = {}) {
        this.getQueryFields().forEach((key) => {
            query[key] != null && this.setVal(key, query[key]);
        });
    }

    /**
     * 根据 getQueryFields 获取当前页面状态
     * @returns {IPlainObject}
     */
    public getQueryState(): IPlainObject {
        const p: IPlainObject = this.getQueryFields().reduce((pre, cur) => {
            pre[cur] = this[cur];
            return pre;
        }, {});

        return p;
    }
}
