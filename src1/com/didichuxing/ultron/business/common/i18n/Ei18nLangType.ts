export enum Ei18nLangType {
    Chinese = 'zh-cn',
    English = 'en'
}

export interface ILangListItem {
    name: string;
    value: Ei18nLangType;
    checked: boolean;
}

class I18nLangType {
    private langType: Ei18nLangType = Ei18nLangType.Chinese;

    public get getLangType(): Ei18nLangType { return this.langType; }

    public getLangList(): ILangListItem[] {
        return [
            {
                name: '中文',
                value: Ei18nLangType.Chinese,
                checked: this.langType === Ei18nLangType.Chinese
            },
            {
                name: 'English',
                value: Ei18nLangType.English,
                checked: this.langType === Ei18nLangType.English
            }
        ];
    }

    public setLangType(langType: Ei18nLangType): void { this.langType = langType; }
}

export const i18nLangType = new I18nLangType();
