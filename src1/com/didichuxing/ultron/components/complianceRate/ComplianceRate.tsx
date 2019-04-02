import React, { Component } from 'react';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import { Tree, Input } from 'antd';
import { getOdinTree } from '@ultron/remote/testTask';
import DataTransferComponent from 'com/didichuxing/components/DataTransferComponent';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
import { get } from 'com/didichuxing/utils/request';
import { Bind } from 'lodash-decorators';
import style from './ComplianceRate.less';
import moment from 'moment';
import Card from '@antd/card';
import Breadcrumb from '@antd/breadcrumb';
import Icon from '@antd/icon';

interface ICapacityMarketCardProps {
    complianceRateIt;
    model;
    childrenRender;
    isShow;
    targetDetail;
    push;
    replace(param);
    fatherQuery;
    changeMenuSelectedKey?;
}

interface ICapacityMarketCardState {
}

interface ICardTitleProps {
    it;
    targetDetail;
    goToReviseCapacity();
}
interface ICardTitleState {
}
export class CardTitle extends DataTransferComponent<ICardTitleProps, ICardTitleState> {
    constructor(props: ICardTitleProps, context?: ICardTitleState) {
        super(props, context);
        this.state = {
        };
    }

    public render() {
        return (
            <div className={ style.title }>
                <span className={ style.cardTitle } onClick={ this.props.targetDetail }>{ this.props.it.name }</span>
                <span className={ style.setting } onClick={ this.props.goToReviseCapacity }>
                    <Icon type="setting" />
                </span>
            </div>
        );
    }
}
export default class CapacityMarketCard
extends DataTransferComponent<ICapacityMarketCardProps, ICapacityMarketCardState> {
    constructor(props: ICapacityMarketCardProps, context?: ICapacityMarketCardState) {
        super(props, context);
        this.state = {
        };
    }
    @Bind()
    private moduleBusiness(): void {
        const { businessId, businessName } = this.props.complianceRateIt;
        const query = {
            type: 'complianceRate',
            businessId: businessId,
            businessName: businessName
        };
        this.props.push({url: '/ultron/capacity/target', query});
        this.props.changeMenuSelectedKey(String(businessId), businessName);
    }
    @Bind()
    private bindModuleDetail(): void {
        const { businessId, businessName, moduleId, moduleName } = this.props.complianceRateIt;
        const query = {
            businessId: businessId,
            businessName: businessName,
            name: moduleName,
            id: moduleId
        };
        this.props.push({url: '/ultron/capacity/moduleDetail', query});
    }
    @Bind()
    private goToReviseCapacity(): void {
        const query = Object.assign(
            {
                module: 'reviseCapacity',
                indicatorId: this.props.complianceRateIt.id,
                fatherPathname: location.pathname.replace('/new.html', '')
            }, this.props.fatherQuery
        );
        this.props.replace({url: '/ultron/capacity/establish', query});
    }
    public render() {
        const it = this.props.complianceRateIt;
        const isShow = this.props.isShow;
        return (
            <Card
                title={
                        <CardTitle
                            targetDetail={ this.props.targetDetail }
                            it={ it }
                            goToReviseCapacity={ this.goToReviseCapacity }
                        />
                    }
                className={ style.cardClass }
                bordered={ true }
                style={ { width: 275 } }
            >
                {
                    isShow === false ? null : (
                        <Breadcrumb
                            separator=">"
                        >
                            <Breadcrumb.Item >
                                <span onClick={ this.moduleBusiness } className={ style.businessName }>
                                    { it.businessName }
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item >
                                <span onClick={ this.bindModuleDetail } className={ style.moduleName }>
                                    { it.moduleName }
                                </span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    )
                }
                <div className={ style.centerLeft }>
                    <div className={ style.unit }>{ it.unit }</div>
                    <EChartSimple
                        data={
                            this.props.model.createOptionComplianceRate({
                                test: it.test,
                                goal: it.goal,
                                unit: it.unit
                            })
                        }
                        height={ 150 }
                    />
                </div>
                <div
                    className={ style.centerRight }
                >
                    {
                        this.props.childrenRender(it)
                    }
                </div>
                <p
                    className={ style.time }
                >更新日期：
                    <span>
                        { moment(it.updateTime * 1000).format('YYYY.MM.DD') }
                    </span>
                </p>
            </Card>
        );
    }
}
