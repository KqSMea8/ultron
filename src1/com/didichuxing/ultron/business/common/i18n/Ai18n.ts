import { Ei18nLangType, i18nLangType } from '@ultron/business/common/i18n/Ei18nLangType';

abstract class Ai18nBase<T> {
    private map?: T;
    private langType: Ei18nLangType = i18nLangType.getLangType;

    protected abstract createChinese(): T;

    protected abstract createEnglish(): T;

    public get current(): T {
        if (!this.map || this.langType !== i18nLangType.getLangType) {
            this.langType = i18nLangType.getLangType;
            switch (i18nLangType.getLangType) {
                default:
                case Ei18nLangType.Chinese:
                    this.map = this.createChinese();
                    break;
                case Ei18nLangType.English:
                    this.map = this.createEnglish();
                    break;
            }
        }
        return this.map;
    }
}

interface Ii18nCommon {
    Query: string;
    AddNew: string;
    Edit: string;
    EmptyData: string;

    /**
     * 此为带有参数的国际化文案示例
     * @param {{name: string}} data
     * @returns {string}
     * @constructor
     */
    EditHandler(data: { name: string }): string;
}

/**
 * i18n 公用文案实现
 */
class Ci18nCommon extends Ai18nBase<Ii18nCommon> {
    protected createChinese(): Ii18nCommon {
        return {
            Query: '查询',
            AddNew: '新建',
            Edit: '编辑',
            EmptyData: '暂无数据',
            EditHandler({ name }) {
                return `${this.Edit}${name}`;
            }
        };
    }

    protected createEnglish(): Ii18nCommon {
        return {
            Query: 'query',
            AddNew: 'addNew',
            Edit: 'edit',
            EmptyData: 'empty data',
            EditHandler({ name }) {
                return `${this.Edit} the ${name}`;
            }
        };
    }
}

const i18nCommon = new Ci18nCommon();

/**
 * i18n 抽象类：各实现均需继承此类
 */
export abstract class Ai18n<T> extends Ai18nBase<T> {
    public readonly common: Ci18nCommon = i18nCommon;

    protected abstract createChinese(): T;

    protected abstract createEnglish(): T;
}
