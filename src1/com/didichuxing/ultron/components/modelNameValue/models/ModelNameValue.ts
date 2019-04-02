import { IModelNameValue } from 'com/didichuxing/ultron/components/modelNameValue/IModelNameValue';
import { observable, runInAction, action } from 'mobx';

let INDEX = 0;

export default class ModelNameTypeValue implements IModelNameValue<string> {
    public readonly key = INDEX++;
    @observable public name?: string = '';
    @observable public value?: string = '';
    // @observable public type?: string = '';
    public placeholderPrefix?: string;

    public onAdd?(): void;

    public onDelete?(): void;

    @action
    public updateName(name) {
        this.name = name;
    }
    // @action
    // public updateType(type) {
    //     this.type = type;
    // }

    @action
    public updateValue(value) {
        this.value = value;
    }

    constructor(model?: IModelNameValue<string>) {
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
