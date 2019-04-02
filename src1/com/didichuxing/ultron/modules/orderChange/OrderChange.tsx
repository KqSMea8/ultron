import ModelOrderChange from '@ultron/modules/orderChange/ModelOrderChange';
import {AModule} from 'com/didichuxing/commonInterface/AModule';
import React from 'react';
import { observer } from 'mobx-react';
import { Bind } from 'lodash-decorators';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import Layout from '@antd/layout';
import Button from '@antd/button';
import Input from '@antd/input';
import Row from '@antd/row';
import Col from '@antd/col';
import Table from '@antd/table';
import Radio from '@antd/radio';

import SubMenu from '@ultron/modules/tool/SubMenu';
import style from './OrderChange.less';

const { Sider } = Layout;
const RadioGroup = Radio.Group;

const ObsRadioGroupSetting = bindObserver(RadioGroup, 'settingType', 'value');
const ObsLangOrder = bindObserver(Input.TextArea, 'langOrder', 'value');
const ObsShortOrder = bindObserver(Input.TextArea, 'shortOrder', 'value');
const ObsAreaCode = bindObserver(Input, 'areaCode', 'value');

@observer
export default class OrderChange extends AModule<ModelOrderChange> {
    private COL_SETTINGS = [
        {title: '区号', dataIndex: 'vDistrict', key: 'vDistrict'},
        {title: '短订单号', dataIndex: 'vShortOrder', key: 'vShortOrder'},
        {title: '长订单号', dataIndex: 'vLangOrder', key: 'vLangOrder'},
        {title: 'Base64订单号', dataIndex: 'vBaseOrder', key: 'vBaseOrder'}
    ];
    protected createModel(): ModelOrderChange {
        return new ModelOrderChange(this.query);
    }

    @Bind()
    private pushTo(key: string): void {
        this.push({ url: key });
    }

    /**
     * 选择订单类型
     * @param evt
     */
    @Bind()
    public onChangeSetting(evt): void {
        this.model.changeSettingType(evt.target.value);
    }

    /**
     * 设置长订单
     * @param evt
     */
    @Bind()
    public setLangOrder(evt): void {
        this.model.list = [];
        this.model.setLangOrder(evt.target.value);
    }

    /**
     * 设置短订单
     * @param evt
     */
    @Bind()
    public setShortOrder(evt): void {
        this.model.lists = [];
        this.model.setShortOrder(evt.target.value);
    }

    /**
     * 设置区号
     * @param evt
     */
    @Bind()
    public setAreaCode(evt): void {
        this.model.setAreaCode(evt.target.value);
    }

    /**
     * 转换按钮事件
     */
    @Bind()
    public change(): void {
        this.model.loadData();
    }
    private renderLangTable(): React.ReactNode {
        return (
            <Table
                columns={ this.COL_SETTINGS }
                dataSource={ this.model.list }
                pagination={ false }
                bordered={ true }
                className={ style.table }
            />
        );
    }
    private renderShortTable(): React.ReactNode {
        return (
            <Table
                columns={ this.COL_SETTINGS }
                dataSource={ this.model.lists }
                pagination={ false }
                bordered={ true }
                className={ style.table }
            />
        );
    }

    private renderSetting(): React.ReactNode {
        const settingType = this.model.settingType;
        if (settingType === 'lang') {
            return (
                <div>
                    <Row style={ {marginTop: '20px'} }>
                        <Col span={ 8 }>
                            <ObsLangOrder
                                className={ style.textArea }
                                model={ this.model }
                                onChange={ this.setLangOrder }
                            />
                        </Col>
                        <Col span={ 4 }>
                            <Button
                                type="primary"
                                className={ style.changButton }
                                onClick={ this.change }
                            >转换
                            </Button>
                        </Col>
                    </Row>
                    <div>
                        { this.model.list.length > 0 ? this.renderLangTable() : null }
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <Row style={ {marginTop: '20px'} }>
                        <Col span={ 8 }>
                            <ObsShortOrder
                                className={ style.textArea }
                                model={ this.model }
                                onChange={ this.setShortOrder }
                            />
                        </Col>
                        <Col span={ 4 }>
                            <Row>
                                <ObsAreaCode
                                    model={ this.model }
                                    placeholder="区号"
                                    onChange={ this.setAreaCode }
                                    className={ style.areaCodeCss }
                                />
                            </Row>
                            <Row>
                                <Button
                                    type="primary"
                                    className={ style.shortButton }
                                    onClick={ this.change }
                                >转换
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                    <div>
                        { this.model.lists.length > 0 ? this.renderShortTable() : null }
                    </div>
                </div>
            );
        }
    }

    public render(): React.ReactNode {
        return (
            <div>
                <div className={ style.detailLeft }>
                    <Layout>
                        <Sider>
                            <SubMenu pushTo={ this.pushTo }/>
                        </Sider>
                    </Layout>
                </div>
                <div className={ style.detailRight }>
                    <div className={ style.orderChange }>专快订单ID转换</div>
                    <div className={ style.orderType }>
                        <ObsRadioGroupSetting
                            model={ this.model }
                            onChange={ this.onChangeSetting }
                            value={ String(this.model.settingType) }
                        >
                            <Radio value={ 'lang' }>长订单号</Radio>
                            <Radio value={ 'short' }>短订单号</Radio>
                        </ObsRadioGroupSetting>
                        {
                            this.renderSetting()
                        }
                    </div>
                </div>
            </div>
        );
    }
}
