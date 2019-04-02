import React from 'react';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import { AView } from 'com/didichuxing/commonInterface/AView';
import { Bind } from 'lodash-decorators';
import { observer } from 'mobx-react';
import ModelHttpSingleConfig from '@ultron/modules/httpSingleEdit/MHttpSingleEdit';

import Button from '@antd/button';
import Input from '@antd/input';
import message from '@antd/message';
import style from './ModalFileContent.less';

const ObsNumberInput = bindObserver(Input, 'numberInput', 'value');
@observer
export default class ModalFileContent extends AView<ModelHttpSingleConfig> {
    constructor(p, c) {
        super(p, c);
    }
    @Bind()
    private searchNumberInput(): void {
        if (this.model.modelTestConfigSH.moreConfig.numberInput === '') {
            message.error('起始行不能为空');
        } else {
            this.model.modelTestConfigSH.numberInput();
        }
    }
    @Bind()
    private setNumberInput(e): void {
        this.model.modelTestConfigSH.setNumberInput(e.target.value);
        // this.model.modelTestConfigSH.moreConfig.fileContentArr = [];
    }
    @Bind()
    public search(e): void {
        if (e.keyCode === 13) {
            if (this.model.modelTestConfigSH.moreConfig.numberInput === '') {
                message.error('起始行不能为空');
            } else {
                this.model.modelTestConfigSH.numberInput();
            }
        }
    }
    public render(): React.ReactNode {
        return (
            <div>
                <ObsNumberInput
                    model={ this.model.modelTestConfigSH.moreConfig }
                    onKeyUp={ this.search }
                    onChange={ this.setNumberInput }
                    style={ { width: '50%', marginBottom: '15px'} }
                />
                <Button
                    type="primary"
                    style={ { marginLeft: '10px'} }
                    onClick={ this.searchNumberInput }
                >查询
                </Button>
                <div className={ style.box }>
                    {
                        this.model.modelTestConfigSH.moreConfig.fileContentArr.map((item, index) => {
                            return (
                                <div key={ index } className={ style.p }>
                                    <span className={ style.nums }>
                                        { item.index + index }
                                    </span>
                                    <span className={ style.aa }>{ item.content }</span>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
