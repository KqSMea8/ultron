import React from 'react';
import { AView } from 'com/didichuxing/commonInterface/AView';
import ModelNameValue from '@ultron/components/modelNameValue/models/ModelNameValue';
import Button from '@antd/button';
import Input from '@antd/input';
import Col from '@antd/col';
import style from './ViewNameValue.less';
import { observer } from 'mobx-react';

const InputGroup = Input.Group;

const ObsInput = observer(Input);

@observer
export default class ViewNameValue extends AView<ModelNameValue> {
    public render(): React.ReactNode {
        const propsName = {
            placeholder: this.model.placeholderPrefix + ' Name',
            value: this.model.name,
            onChange: (evt) => { this.model.updateName(evt.target.value); }
        };
        const propsValue = {
            placeholder: this.model.placeholderPrefix + ' Value',
            value: this.model.value,
            onChange: (evt) => { this.model.updateValue(evt.target.value); }
        };
        return (
            <div>
                <InputGroup size="large" className={ style.everyHeaderNameValue }>
                    <Col span={ 3 }>
                        <ObsInput { ...propsName } value={ this.model.name }/>
                    </Col>
                    <Col span={ 9 }>
                        <ObsInput { ...propsValue } value={ this.model.value }/>
                    </Col>
                    <Button className={ style.addButton } onClick={ this.model.onAdd }>添加</Button>
                    <Button className={ style.deleteButton } type="danger" onClick={ this.model.onDelete }>删除</Button>
                </InputGroup>
            </div>
        );
    }
}
