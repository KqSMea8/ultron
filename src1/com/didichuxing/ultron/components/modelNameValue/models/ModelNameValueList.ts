import { IModelNameValueList } from '@ultron/components/modelNameValue/IModelNameValue';
import ModelNameValue from '@ultron/components/modelNameValue/models/ModelNameValue';
import { observable, action } from 'mobx';
import { IPlainObject } from 'com/didichuxing/IPlainObject';

export default class ModelNameValueList implements IModelNameValueList<ModelNameValue> {

    @observable private list: ModelNameValue[];

    constructor() {
        this.list = [];
    }

    public fromPlainObject(obj: IPlainObject, placeholderPrefix: string = '') {
        this.clear();
        Object.keys(obj).forEach((key) => {
            this.add(new ModelNameValue({ name: key, value: obj[key], placeholderPrefix }));
        });

        if (this.list.length === 0) {
            this.add(new ModelNameValue({ name: '', value: '', placeholderPrefix }));
        }
    }

    public getList(): ModelNameValue[] {
        return this.list;
    }

    @action
    public clear() {
        this.list.length = 0;
    }

    private getOnDelete(item) {
        return () => {
            if (this.list.length < 1) {
                return;
            }
            if (this.list.length === 1) {
                this.list[0].updateName('');
                this.list[0].updateValue('');
                return;
            }
            this.deleteByItem(item);
        };
    }

    @action
    public add(item: ModelNameValue): number {
        if (!item.onDelete) {
            item.onDelete = this.getOnDelete(item);
        }
        if (!item.onAdd) {
            item.onAdd = () => {
                const newHeader: ModelNameValue = new ModelNameValue({
                    placeholderPrefix: item.placeholderPrefix,
                    onAdd: item.onAdd
                });
                this.add(newHeader);
            };
        }
        this.list.push(item);
        return this.list.length - 1;
    }

    @action
    public deleteByItem(item: ModelNameValue): boolean {
        const index = this.findIndexByItem(item);
        if (index === -1) {
            return false;
        }
        return this.deleteByIndex(index);
    }

    @action
    public deleteByIndex(index: number): boolean {
        if (index >= this.list.length) {
            return false;
        }
        this.list.splice(index, 1);
        return true;
    }

    public findItemsByName(name: string): ModelNameValue[] {
        return this.list.filter((it) => it.name === name);
    }

    public findIndexByItem(item: ModelNameValue): number {
        return this.list.findIndex((it) => it === item);
    }

    public toPlainObject(): IPlainObject {
        const obj = this.list.reduce((pre, cur) => {
            if (cur.name) {
                pre[cur.name] = cur.value;
            }
            return pre;
        }, {});
        return obj;
    }

    public toString(): string {
        return this.list.map((it) => it.toString()).join('\n');
    }
}
