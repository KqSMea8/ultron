import { IModelNameTypeValue } from 'com/didichuxing/ultron/components/modelNameTypeValue/IModelNameTypeValue';
import { observable, runInAction, action } from 'mobx';

let INDEX = 0;

export default class ModelNameTypeValue implements IModelNameTypeValue<string> {
    public readonly key = INDEX++;
    @observable public name: string = '';
    @observable public type: string = '1';
    @observable public value: string = '';
    public placeholderPrefix?: string;
    public showButton?: boolean = true;

    public onAdd?(): void;

    public onDelete?(): void;

    @action
    public updateName(name) {
        this.name = name;
    }
    @action
    public updateType(type) {
        this.type = type;
    }

    @action
    public updateValue(value) {
        this.value = value;
    }

    constructor(model?: IModelNameTypeValue<string>) {
        model && runInAction(() => {
            Object.assign(this, model);
        });
    }

    public toString(): string {
        if (!this.name) {
            return '';
        }
        return this.name + ': ' + this.value;
    }
}
