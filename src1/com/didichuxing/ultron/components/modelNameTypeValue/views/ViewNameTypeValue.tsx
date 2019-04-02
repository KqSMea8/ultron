import React from 'react';
import { AView } from 'com/didichuxing/commonInterface/AView';
import Button from '@antd/button';
import Input from '@antd/input';
import Select from '@antd/select';
import Col from '@antd/col';
import style from './ViewNameTypeValue.less';
import { observer } from 'mobx-react';
import ModelNameTypeValue from '@ultron/components/modelNameTypeValue/models/ModelNameTypeValue';
import {observable, runInAction} from 'mobx';
import {getThriftTypeList} from '@ultron/remote/testConfig';

const InputGroup = Input.Group;
const Option = Select.Option;

const ObsInput = observer(Input);
const ObsSelect = observer(Select);

interface IProType {
    name: string;
    value: string;
}

@observer
export default class ViewNameTypeValue extends AView<ModelNameTypeValue> {
    @observable public respar: IProType[] = [];

    public componentDidMount(): void {
        this.resparams();
    }
    private showType(val): string {
        switch (val) {
            case 1:
                return 'bool';
            case 2:
                return 'byte';
            case 3:
                return 'i16';
            case 4:
                return 'i32';
            case 5:
                return 'i64';
            case 6:
                return 'double';
            case 7:
                return 'string';
            case 8:
                return 'list';
            case 9:
                return 'map';
            case 10:
                return 'set';
            case 11:
                return 'struct';
            case 12:
                return 'trace';
            default :
                return '';
        }
    }

    private async resparams(): Promise<void> {
        const result = await getThriftTypeList({});
        runInAction(() => {
            this.respar = result.map((it) => {
                return {
                    name: it.name,
                    value: String(it.value)
                };
            });
        });
    }

    public render(): React.ReactNode {
        const propsName = {
            placeholder: this.model.placeholderPrefix + ' Name',
            value: this.model.name,
            onChange: (evt) => { this.model.updateName(evt.target.value); }
        };
        const propsType = {
            // placeholder: this.model.placeholderPrefix + ' Value',
            type: this.showType(this.model.type),
            onChange: (type) => { this.model.updateType(type); }
        };
        const propsValue = {
            placeholder: this.model.placeholderPrefix + ' Value',
            value: this.model.value,
            onChange: (evt) => { this.model.updateValue(evt.target.value); }
        };
        return (
            <div>
                <InputGroup size="large" className={ style.everyHeaderNameValue } >
                    <Col span={ 1 } className={ style.index }>{ this.props.index + 1 } ：</Col>
                    <Col span={ 3 }>
                        <ObsInput { ...propsName } value={ this.model.name }/>
                    </Col>
                    <Col span={ 2 }>
                        <ObsSelect
                            defaultValue={ propsType.type || '1' }
                            onChange={ propsType.onChange }
                            className={ style.parameterSelect }
                        >
                            {
                                this.respar
                                    .map((it) => <Option key={ it.name } value={ it.name }>{ it.value }</Option>)
                            }
                        </ObsSelect>
                    </Col>
                    <Col span={ 5 }>
                        <ObsInput { ...propsValue } value={ this.model.value }/>
                    </Col>
                    <Button className={ style.addButton } onClick={ this.model.onAdd }>添加</Button>
                    <Button className={ style.deleteButton } type="danger" onClick={ this.model.onDelete }>删除</Button>
                </InputGroup>
            </div>
        );
    }
}

// {
//     this.respar
//         .map((it) => <Option key={ it.value } value={ it.name }>{ it.value }</Option>)
// }
