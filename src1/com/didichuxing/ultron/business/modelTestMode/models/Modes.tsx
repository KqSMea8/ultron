import React from 'react';
import { action, computed, observable, runInAction } from 'mobx';
import ModelTestModeFixQPS from '@ultron/business/modelTestMode/models/ModeFixQPS';
import ModelTestModeFixCocurrent from '@ultron/business/modelTestMode/models/ModeFixCocurrent';
import ModelTestModeStepwiseQPS from '@ultron/business/modelTestMode/models/ModeStepwiseQPS';
import ModelTestModeStepwiseCocurrent from '@ultron/business/modelTestMode/models/ModeStepwiseCocurrent';
import ModeCustomQPS from '@ultron/business/modelTestMode/models/ModeCustomQPS';
import ModeConcurrency from '@ultron/business/modelTestMode/models/ModeConcurrency';
import * as IStartPressure from '@ultron/remote/testMode/interfaces/IStartPressureMeasurement';
import AModelTestMode from '@ultron/business/modelTestMode/AMode';
import { IResultBoolean } from 'com/didichuxing/commonInterface/IResultBoolean';
import { ETestModeType } from '@ultron/business/common/enum/ETestModeType';
import { IReturnTestMode } from '@ultron/remote/testTask/interfaces/IGetPressureTask';
import * as IGetRegions from '@ultron/remote/testTask/interfaces/IGetRegions';
import { getRegions } from '@ultron/remote/testTask';
import { getAgentNum } from '@ultron/remote/testMode';

export default class ModelTestModes extends AModelTestMode {
    public modelTMFixQPS: ModelTestModeFixQPS = new ModelTestModeFixQPS();
    public modelTMFixCocurrent: ModelTestModeFixCocurrent = new ModelTestModeFixCocurrent();
    public modelTMStepwiseQPS: ModelTestModeStepwiseQPS = new ModelTestModeStepwiseQPS();
    public modelTMStepwiseCocurrent: ModelTestModeStepwiseCocurrent = new ModelTestModeStepwiseCocurrent();
    public modelTMCustomQPS: ModeCustomQPS = new ModeCustomQPS();
    public modelTMCustomConcurrency: ModeConcurrency = new ModeConcurrency();

    private testModes = {
        [ETestModeType.FixQPS]: this.modelTMFixQPS,
        [ETestModeType.FixCocurrent]: this.modelTMFixCocurrent,
        [ETestModeType.StepQPS]: this.modelTMStepwiseQPS,
        [ETestModeType.StepCocurrent]: this.modelTMStepwiseCocurrent,
        [ETestModeType.CustomQPS]: this.modelTMCustomQPS,
        [ETestModeType.CustomConcurrency]: this.modelTMCustomConcurrency
    };

    @observable public regions: IGetRegions.IReturn = [];

    @observable private type: ETestModeType = ETestModeType.FixQPS;
    @observable public agentCount: string = '';
    @observable public isUse: string = '自动分配';
    @observable public ifUseCustom: boolean = true;
    @observable public pressureMode?: number;
    @observable public agentNum: string = '';

    constructor() {
        super();
    }

    public async loadRegions() {
        const respData = await getRegions({ type: 2000 });
        runInAction(() => {
            this.regions = respData;
            this.region = respData[0].value;
            if (this.region) {
                if (this.pressureMode === 3) {
                    this.getAgent();
                }
            }
        });
    }
    public async getAgent() {
        try {
            const ajaxParams = {
                type: 2000,
                region: this.region
            };
            const resData = await getAgentNum(ajaxParams);
            if (resData) {
                this.agentNum = String(resData.idleAgentNumber);
            }
        } catch (e) {}
    }

    @computed
    public get vType(): string { return String(this.type); }

    @action
    public setTestModeType(type: ETestModeType) {
        this.type = type;
    }
    @action
    public setPressureMode(val): void {
        this.pressureMode = val;
    }
    @action
    public setIsUse(val): void {
        this.isUse = val;
        if (val === '自动分配') {
            this.ifUseCustom = true;
        } else {
            this.ifUseCustom = false;
        }
    }
    @action
    public setAgentCount(val): void {
        this.agentCount = val;
    }

    public get getEChartOptions(): echarts.EChartOption {
        return this.testModes[this.type].getEChartOptions;
    }

    public isCanSave(): Promise<IResultBoolean> {
        return this.testModes[this.type].isCanSave();
    }

    public getAjaxParams(): IStartPressure.IParams {
        return this.testModes[this.type].getAjaxParams();
    }

    public renderDetail(): React.ReactNode {
        return this.testModes[this.type].renderDetail();
    }

    public fillByServerData(data: IReturnTestMode): void {
        if (this.testModes[data.type] != null) {
            this.setTestModeType(data.type);
            this.testModes[this.type].fillByServerData(data);
        } else {
            throw new Error('data.type=' + data.type + ' is invalid');
        }
    }
}
