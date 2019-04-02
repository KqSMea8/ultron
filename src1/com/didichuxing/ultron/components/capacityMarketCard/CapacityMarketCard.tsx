import React, { Component } from 'react';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import { Tree, Input } from 'antd';
import { getOdinTree } from '@ultron/remote/testTask';
import DataTransferComponent from 'com/didichuxing/components/DataTransferComponent';
import { EChartSimple } from 'com/didichuxing/commonInterface/AEChart';
import { get } from 'com/didichuxing/utils/request';
import { Bind } from 'lodash-decorators';
import style from './CapacityMarketCard.less';
import Card from '@antd/card';
import Icon from '@antd/icon';

interface ICapacityMarketCardProps {
    paramsItemData;
    model;
    complianceRate;
    businessModule;
    isFromPlate;
}

interface ICapacityMarketCardState {
}

export default class CapacityMarketCard extends
DataTransferComponent<ICapacityMarketCardProps, ICapacityMarketCardState> {
    constructor(props: ICapacityMarketCardProps, context?: ICapacityMarketCardState) {
        super(props, context);
        this.state = {
        };
    }
    /**
     * 容量指标达标率
     */
    @Bind()
    private complianceRate(e): void {
        this.props.complianceRate(e);
    }
    /**
     * 业务模块
     */
    @Bind()
    private businessModule(e): void {
        this.props.businessModule(e);
    }
    public componentWillMount() {
        //
    }
    public render() {
        const val = this.props.paramsItemData;
        return (
            <Card
                bordered={ true }
                title={ val.name }
                className={ style.card }
                // extra={ <a href="#">More</a> }
                style={ { width: 330 } }
            >
                <div className={ style.occupiedBox }>
                    <div className={ style.echartSimple }>
                        <div className={ style.echartTitle }>
                            {
                                this.props.isFromPlate
                                    ?
                                <span className={ style.complianceRate } >核心容量指标</span>
                                    :
                                <a
                                    data-businessid={ val.id }
                                    data-businessname={ val.name }
                                    onClick={ this.complianceRate }
                                    href="javascript:;"
                                >
                                    核心容量指标
                                </a>
                            }
                        </div>
                        <div className={ style.echartBox }>
                            <EChartSimple
                                data={
                                    this.props.model.createOption({
                                        ratio: val.ratio
                                    })
                                }
                                height={ 130 }
                            />
                        </div>
                    </div>
                    <div
                        className={ style.occupiedBoxInfo }
                        style={ this.props.isFromPlate ? {borderLeft: 'none'} : {} }
                    >
                        <div className={ style.occupiedBoxInfoTitle }>
                            {
                                this.props.isFromPlate
                                    ?
                                <span className={ style.complianceRate }/>
                                    :
                                <a
                                    data-businessid={ val.id }
                                    data-businessname={ val.name }
                                    onClick={ this.businessModule }
                                    href="javascript:;"
                                >
                                    核心业务模块
                                </a>
                            }
                        </div>
                        <div className={ style.occupiedBoxInfoInner }>
                            <div className={ style.infoUnverified }>
                                <Icon type="question-circle" />
                                <span className={ style.word }>未验证: { val.unverified }</span>
                            </div>
                            <div className={ style.infoUnqualified }>
                                <Icon type="exclamation-circle" />
                                <span className={ style.word }>未达标: { val.unqualified }</span>
                            </div>
                            <div className={ style.infoQualified }>
                                <Icon type="check-circle" />
                                <span className={ style.word }>已达标: { val.qualified }</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
}
