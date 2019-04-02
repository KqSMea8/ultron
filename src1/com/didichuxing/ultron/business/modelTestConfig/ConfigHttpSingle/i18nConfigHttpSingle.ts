import { Ai18n } from '@ultron/business/common/i18n/Ai18n';

interface Ii18nConfigHttpSingle {
    maxRedirect: string;
}

/**
 * i18n HTTP单接口
 */
class Ci18nConfigHttpSingle extends Ai18n<Ii18nConfigHttpSingle> {
    protected createChinese(): Ii18nConfigHttpSingle {
        return {
            maxRedirect: '允许重定向次数的范围应该在1-10之间'
        };
    }

    protected createEnglish(): Ii18nConfigHttpSingle {
        return {
            maxRedirect: 'max redirect must between 1 and 10'
        };
    }

}

export const i18nConfigHttpSingle: Ci18nConfigHttpSingle = new Ci18nConfigHttpSingle();
