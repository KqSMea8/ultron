import React from 'react';
import { AView } from 'com/didichuxing/commonInterface/AView';
import Tabs from '@antd/tabs';
import message from '@antd/message';
import Modal from '@antd/modal';
import Select from '@antd/select';
import Input from '@antd/input';

import { observer } from 'mobx-react';

import ModelTestModes from '@ultron/business/modelTestMode/models/Modes';
import ViewTestModeFixQPS from '@ultron/business/modelTestMode/views/ViewTestModeFixQPS';
import ViewTestModeStepwiseQPS from '@ultron/business/modelTestMode/views/ViewTestModeStepwiseQPS';
import ViewTestModeFixCocurrent from '@ultron/business/modelTestMode/views/ViewTestModeFixCocurrent';
import ViewTestModeStepwiseCocurrent from '@ultron/business/modelTestMode/views/ViewTestModeStepwiseCocurrent';
import ViewTestModeCustomQPS from '@ultron/business/modelTestMode/views/ViewTestModeCustomQPS';
import ViewTestModeCustomConcurrency from '@ultron/business/modelTestMode/views/ViewTestModeCustomConcurrency';
import { adjustmentPressure, startPressureMeasurement } from '@ultron/remote/testMode';
import { ETestModeType } from '@ultron/business/common/enum/ETestModeType';
import { Bind } from 'lodash-decorators';
import AModelTestMode from '@ultron/business/modelTestMode/AMode';
import * as IGetPressureTask from '@ultron/remote/testTask/interfaces/IGetPressureTask';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

const ObsSelectRegion = bindObserver(Select, 'region', 'value');
const ObsSelectAgent = bindObserver(Select, 'isUse', 'value');
const ObsAgentCount = bindObserver(Input, 'agentCount', 'value');

@observer
export default class ViewTestModes extends AView<ModelTestModes> {
    @Bind()
    private onChangeTabs(key: string) {
        this.model.setTestModeType(Number(key) as ETestModeType);
    }

    @Bind()
    private onChangeRegion(val: string) {
        this.model.setRegion(val);
        if (this.model.pressureMode === 3) {
            this.model.getAgent();
        }
    }
    @Bind()
    private onChangeUse(val: string) {
        this.model.setIsUse(val);
    }
    @Bind()
    private setAgengCount(evt): void {
        this.model.setAgentCount(evt.target.value);
    }

    @Bind()
    private tabBarExtraContent() {
        return (
            <div>
                <span style={ { marginRight: '5px'} }>选择机房</span>
                <ObsSelectRegion
                    disabled={ this.model.isDisabledRegion }
                    model={ this.model }
                    style={ { width: '120px' } }
                    onChange={ this.onChangeRegion }
                >
                    {
                        this.model.regions.map((it) => <Option key={ it.value } value={ it.value }>{ it.name }</Option>)
                    }

                </ObsSelectRegion>
            </div>
        );
    }

    public render(): React.ReactNode {
        return (
            this.model.pressureMode === 3 ? (
                <div>
                    <span style={ { marginRight: '5px'} }>选择机房</span>
                    <ObsSelectRegion
                        disabled={ this.model.isDisabledRegion }
                        model={ this.model }
                        style={ { width: '120px' } }
                        onChange={ this.onChangeRegion }
                    >
                        {
                            this.model.regions.map((it) => <Option
                                key={ it.value }
                                value={ it.value }
                            >{ it.name }
                            </Option>)
                        }
                    </ObsSelectRegion>
                    <span style={ { marginRight: '5px', marginLeft: '15px'} }>Agent</span>
                    <ObsSelectAgent
                        model={ this.model }
                        style={ { width: '120px'} }
                        onChange={ this.onChangeUse }
                    >
                        <Option key="自动分配" value="自动分配">自动分配</Option>
                        <Option key="手动选择" value="手动选择">手动选择</Option>
                    </ObsSelectAgent>
                    {
                        this.model.ifUseCustom === false ? (
                            <ObsAgentCount
                                model={ this.model }
                                onChange={ this.setAgengCount }
                                style={ { width: '50px', marginLeft: '5px'} }
                            />
                        ) : null
                    }
                    {
                        this.model.ifUseCustom === false ? (
                            <span>&nbsp;个</span>
                        ) : null
                    }
                    <span style={ { marginLeft: '15px', color: '#1890ff'} }>
                        当前可用Agent: { this.model.agentNum }&nbsp;个
                    </span>
                    <Tabs
                        type="line"
                        activeKey={ this.model.vType }
                        onChange={ this.onChangeTabs }
                    >
                        <TabPane tab="固定QPS" key={ ETestModeType.FixQPS }>
                            <ViewTestModeFixQPS model={ this.model.modelTMFixQPS }/>
                        </TabPane>
                        <TabPane tab="阶梯QPS" key={ ETestModeType.StepQPS }>
                            <ViewTestModeStepwiseQPS model={ this.model.modelTMStepwiseQPS }/>
                        </TabPane>
                        <TabPane tab="固定并发数" key={ ETestModeType.FixCocurrent }>
                            <ViewTestModeFixCocurrent model={ this.model.modelTMFixCocurrent }/>
                        </TabPane>
                        <TabPane tab="阶梯并发数" key={ ETestModeType.StepCocurrent }>
                            <ViewTestModeStepwiseCocurrent model={ this.model.modelTMStepwiseCocurrent }/>
                        </TabPane>
                        <TabPane tab="自定义QPS" key={ ETestModeType.CustomQPS }>
                            <ViewTestModeCustomQPS model={ this.model.modelTMCustomQPS }/>
                        </TabPane>
                        <TabPane tab="自定义并发" key={ ETestModeType.CustomConcurrency }>
                            <ViewTestModeCustomConcurrency model={ this.model.modelTMCustomConcurrency }/>
                        </TabPane>
                    </Tabs>
                </div>
            ) : (
                <Tabs
                    type="line"
                    activeKey={ this.model.vType }
                    onChange={ this.onChangeTabs }
                    tabBarExtraContent={ this.tabBarExtraContent() }
                >
                    <TabPane tab="固定QPS" key={ ETestModeType.FixQPS }>
                        <ViewTestModeFixQPS model={ this.model.modelTMFixQPS }/>
                    </TabPane>
                    <TabPane tab="阶梯QPS" key={ ETestModeType.StepQPS }>
                        <ViewTestModeStepwiseQPS model={ this.model.modelTMStepwiseQPS }/>
                    </TabPane>
                    <TabPane tab="固定并发数" key={ ETestModeType.FixCocurrent }>
                        <ViewTestModeFixCocurrent model={ this.model.modelTMFixCocurrent }/>
                    </TabPane>
                    <TabPane tab="阶梯并发数" key={ ETestModeType.StepCocurrent }>
                        <ViewTestModeStepwiseCocurrent model={ this.model.modelTMStepwiseCocurrent }/>
                    </TabPane>
                    <TabPane tab="自定义QPS" key={ ETestModeType.CustomQPS }>
                        <ViewTestModeCustomQPS model={ this.model.modelTMCustomQPS }/>
                    </TabPane>
                    <TabPane tab="自定义并发" key={ ETestModeType.CustomConcurrency }>
                        <ViewTestModeCustomConcurrency model={ this.model.modelTMCustomConcurrency }/>
                    </TabPane>
                </Tabs>
            )
        );
    }
}

export function showTestModes(planId: string, pressureMode?: number,
                              taskId?: string, data?: IGetPressureTask.IReturnTestMode,
                              region?: string): Promise<string> {
    return new Promise<string>(async (resolveReq, rejectReq) => {
        const modelTestModes: ModelTestModes = new ModelTestModes();
        if (pressureMode && pressureMode === 3) {
            modelTestModes.setPressureMode(pressureMode);
        }
        await modelTestModes.loadRegions();

        if (data) {
            modelTestModes.setIsDisabledRegion();
            modelTestModes.setRegion(region);
            modelTestModes.fillByServerData(data);
        }
        const inst = Modal.confirm({
            maskClosable: true,
            title: taskId ? '调整压力' : '选择压测方式',
            width: 900,
            content: (
                <div style={ { paddingRight: '38px' } }>
                    <ViewTestModes model={ modelTestModes }/>
                </div>
            ),
            onOk: () => {
                return new Promise(async (resolve, reject) => {
                    const result = await modelTestModes.isCanSave();
                    if (result.isPass) {
                        try {
                            if (taskId) {
                                const respData = await adjustmentPressure(
                                Object.assign(modelTestModes.getAjaxParams(), { region: modelTestModes.regions }),
                                    {
                                        planId: planId,
                                        taskId: taskId
                                    }
                                );
                                message.success('调整压力成功');
                                resolve();
                                inst && inst.destroy && inst.destroy();
                                resolveReq('');
                            } else {
                                if (pressureMode === 3) {
                                    const respData = await startPressureMeasurement(
                                        Object.assign(modelTestModes.getAjaxParams(), {
                                            region: modelTestModes.region,
                                            agentCount: modelTestModes.agentCount,
                                            ifUseAutomaticAllot: modelTestModes.ifUseCustom
                                        }),
                                        { planId: planId }
                                    );
                                    const hide = message.loading('发起压测成功, 5 秒后显示任务详情链接...', 0);
                                    setTimeout(() => {
                                        hide();
                                        resolve();
                                        inst && inst.destroy && inst.destroy();
                                        resolveReq(String(respData.taskId));
                                    }, 5000);
                                } else {
                                    const respData = await startPressureMeasurement(
                                        Object.assign(modelTestModes.getAjaxParams(), {
                                            region: modelTestModes.region
                                        }),
                                        { planId: planId }
                                    );
                                    const hide = message.loading('发起压测成功, 5 秒后显示任务详情链接...', 0);
                                    setTimeout(() => {
                                        hide();
                                        resolve();
                                        inst && inst.destroy && inst.destroy();
                                        resolveReq(String(respData.taskId));
                                    }, 5000);
                                }
                            }
                        } catch {
                            reject();
                            rejectReq();
                        }
                    } else {
                        message.error(result.text);
                        reject();
                        rejectReq();
                    }
                });
            },
            onCancel: () => { rejectReq(); }
        });
    });
}
