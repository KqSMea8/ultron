import {IModelNameTypeValueList} from '@ultron/components/modelNameTypeValue/IModelNameTypeValue';
import ModelNameTypeValue from '@ultron/components/modelNameTypeValue/models/ModelNameTypeValue';
import {observable, action} from 'mobx';
import {IPlainObject} from 'com/didichuxing/IPlainObject';
import {IParamsConfigItem} from 'com/didichuxing/ultron/remote/testConfig/interfaces/ICreatConfigThrift';

export default class ModelNameTypeValueList implements IModelNameTypeValueList<ModelNameTypeValue> {

    @observable private list: ModelNameTypeValue[];

    constructor() {
        this.list = [];
    }

    public fromPlainObject(obj: IPlainObject, placeholderPrefix: string = '') {
        this.clear();
        const showButton: boolean = false;
        obj.map( (it) => {
            this.add(new ModelNameTypeValue(
                {name: it.name, value: it.value, type: it.type, placeholderPrefix, showButton}));
        } );

        if (this.list.length === 0) {
            this.add(new ModelNameTypeValue({name: '', value: '', placeholderPrefix}));
        }
    }

    public getList(): ModelNameTypeValue[] {
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
    public add(item: ModelNameTypeValue): number {
        if (!item.onDelete) {
            item.onDelete = this.getOnDelete(item);
        }
        if (!item.onAdd) {
            item.onAdd = () => {
                const newHeader: ModelNameTypeValue = new ModelNameTypeValue({
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
    public deleteByItem(item: ModelNameTypeValue): boolean {
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

    public findItemsByName(name: string): ModelNameTypeValue[] {
        return this.list.filter((it) => it.name === name);
    }

    public findIndexByItem(item: ModelNameTypeValue): number {
        return this.list.findIndex((it) => it === item);
    }

    public toPlainObject(): IParamsConfigItem[] {
        return this.list.reduce<IParamsConfigItem[]>((pre, cur) => {
            if (cur.name) {
                pre.push({
                    name: cur.name,
                    type: Number(cur.type),
                    value: cur.value
                });
            }
            return pre;
        }, []);
    }

    public toString(): string {
        return this.list.map((it) => it.toString()).join('\n');
    }
}
