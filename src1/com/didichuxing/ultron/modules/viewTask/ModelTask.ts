import { getApis, getPressureTask, getPressureTaskError, getStats, stopPressure } from '@ultron/remote/testTask';
import * as IGetPressureTask from '@ultron/remote/testTask/interfaces/IGetPressureTask';
import moment from 'moment';
import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import { IPlainObject } from 'com/didichuxing/IPlainObject';
import { textTestTaskState, ETestTaskState } from '@ultron/business/common/enum/ETestTaskState';
import { action, computed, observable, runInAction } from 'mobx';
import { ErrorListItem, ErrorList } from '@ultron/modules/viewTask/ModelTaskErrorList';
import { Bind } from 'lodash-decorators';
import message from '@antd/message';
import { textTestAgentState } from '@ultron/business/common/enum/ETestAgentState';
import { createTestModeModel } from '@ultron/business/common/enum/ETestModeType';
import AModelTestMode from '@ultron/business/modelTestMode/AMode';
import { ModelTaskDetailPerf } from '@ultron/modules/viewTask/ModelTaskPerf';
import { ETestConfigType } from '@ultron/business/common/enum/ETestConfigType';

let count: number = 0;

/**
 * 列表项
 */
class ModelListItem {
    public key: string = String(count++);
    public item: IGetPressureTask.IReturnItem;

    constructor(p: IGetPressureTask.IReturnItem) {
        this.item = p;
    }

    /**
     * 机房
     */
    public get vRegion(): string {
        return this.item.agentRegion;
    }

    /**
     * 名称
     */
    public get vAgentName(): string {
        return this.item.agentName;
    }

    /**
     * IP
     */
    public get vIp(): string {
        return this.item.agentIp;
    }

    /**
     * PID
     */
    public get vAgentPid(): number {
        return this.item.agentPid;
    }

    /**
     * 启动时间
     */
    public get vStartAt(): any {
        return this.item.startAt === 0 ? '--' : moment(this.item.startAt * 1000).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * 结束时间
     */
    public get vStopAt(): any {
        return this.item.stopAt === 0 ? '--' : moment(this.item.stopAt * 1000).format('YYYY-MM-DD HH:mm:ss');
    }

    /**
     * 状态
     */
    public get vStatus(): number {
        return textTestAgentState(this.item.status);
    }
}

const MAP_CONFIG_URL = {
    [ETestConfigType.HttpSingle]: '/new.html/ultron/interfaceTest/httpSingleDetail',
    [ETestConfigType.HttpMulti]: '/new.html/ultron/interfaceTest/httpMultiDetail',
    [ETestConfigType.HttpScene]: '/new.html/ultron/interfaceTest/httpSceneDetail',
    [ETestConfigType.Thrift]: '/new.html/ultron/interfaceTest/thriftDetail'
};

/**
 * 任务详情配置模型
 */
export default class ModelTaskDetails extends AModuleModel {
    private timer: any = null;
    @observable public selectTime: any = '';
    @observable public planId: string = '';
    @observable public planName: string = '';
    @observable public taskId: string = '';
    @observable public startTime: number = 0;
    @observable public stopTime: number = 0;
    @observable public status: number = 0;
    @observable public errors: ErrorList[] = [];

    @observable public isStopping: boolean = false;
    @observable public isTestModeUpdating: boolean = false;

    @observable public total: number = 0;
    @observable public list: ModelListItem[] = [];
    @observable public unassignedAgentNum: string = '';
    @observable public errorList: ErrorListItem[] = [];

    @observable public perfList: ModelTaskDetailPerf[] = [];

    @observable public type: ETestConfigType = ETestConfigType.HttpSingle;

    @observable public tabKey: string = '1';
    @observable public region: string = '';
    @observable public pressureMode: number = 0;
    @observable public businessCode: string = '';

    @action.bound
    public setTabKey(key: string) {
        this.tabKey = key;
    }

    public all: any[] = [];

    private dataTestMode?: IGetPressureTask.IReturnTestMode;

    public modelTestMode: AModelTestMode | null = null;

    constructor(query: IPlainObject = {}) {
        super();
        this.initByQueryFields(query);
        this.pressureMode = query.pressureMode;
        this.businessCode = query.businessCode;
    }

    protected getQueryFields(): string[] {
        return ['planId', 'planName', 'taskId', 'type', 'tabKey', 'businessCode'];
    }

    public get valDataTestMode() {
        return this.dataTestMode;
    }

    @computed
    public get vConfigUrl() {
        return MAP_CONFIG_URL[this.type] + '?planId=' + this.planId + '&planName=' + this.planName;
    }

    @computed
    public get vStartTime() {
        return this.startTime === 0 ? '--' : moment(this.startTime * 1000).format('YYYY-MM-DD HH:mm:ss');
    }

    @computed
    public get vStopTime() {
        return this.stopTime === 0 ? '--' : moment(this.stopTime * 1000).format('YYYY-MM-DD HH:mm:ss');
    }

    @computed
    public get vStatus() {
        return textTestTaskState(this.status);
    }

    @computed
    public get vIsButtonDisabled() {
        if (this.isStopping) {
            return true;
        } else if (this.isTestModeUpdating) {
            return true;
        } else if (this.vIsRunning) {
            return false;
        } else if (this.vIsReady) {
            return false;
        } else {
            return true;
        }
        // return this.isStopping || this.isTestModeUpdating || this.vIsRunning || this.vIsReady || true;
    }

    @computed
    public get vIsRunning() {
        return this.status === ETestTaskState.Running;
    }
    @computed
    public get vIsReady() {
        return this.status === ETestTaskState.Waiting;
    }

    @action
    public beginTestModeUpdating() {
        this.isTestModeUpdating = true;
    }

    @action
    public endTestModeUpdating() {
        this.isTestModeUpdating = false;
    }

    @Bind()
    public async stopTask(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            if (this.vIsRunning || this.vIsReady) {
                runInAction(() => {
                    this.isStopping = true;
                });
                try {
                    await stopPressure({}, {
                        planId: this.planId,
                        taskId: this.taskId
                    });
                    const stop = message.loading('正在停止压测，请稍候', 0);
                    setTimeout(() => {
                        stop();
                        runInAction(() => {
                            this.status = ETestTaskState.Finished;
                        });
                    }, 5000);
                    resolve(true);
                } catch (e) {
                    resolve(false);
                } finally {
                    runInAction(() => {
                        this.isStopping = false;
                    });
                    this.loadTaskDetail();
                }
            } else {
                message.info('当前任务未运行');
            }
        });
    }

    /**
     * 加载数据（程序的起点）
     */
    public async loadData(): Promise<void> {
        this.loadTaskDetail();
        this.loadTaskErrors();
        this.loadTaskUrls();
    }

    /**
     * 加载测试配置列表
     */
    private async loadTaskDetail(): Promise<void> {
        const result = await getPressureTask({}, {
            planId: this.planId,
            taskId: this.taskId
        });
        runInAction(() => {
            this.list = result.agents.map((it) => new ModelListItem(it));
            this.startTime = result.startAt;
            this.stopTime = result.stopAt;
            this.status = result.status;
            this.region = String(result.region);
            this.unassignedAgentNum = result.unassignedAgentNum;
            this.modelTestMode = createTestModeModel(this.dataTestMode = result.pressure);
        });
        if (this.status === 10 && !this.timer) {
            this.timer = setInterval(() => {
                this.loadTaskDetail();
            }, 5000);
        } else if (this.status !== 10 && this.timer) {
            clearInterval(this.timer);
        }
    }

    /**
     * 加载测试配置列表
     */
    public async loadTaskErrors(): Promise<void> {
        const respData = await getPressureTaskError({
            planId: this.planId,
            taskId: this.taskId
        }, {
            planId: this.planId,
            taskId: this.taskId
        });

        runInAction(() => {
            this.errors = respData.errors.map((error) => new ErrorList(error));
        });
    }

    /**
     * 加载测试配置列表
     */
    public async loadTaskUrls(): Promise<void> {
        const respData = await getApis({}, {
            planId: this.planId,
            taskId: this.taskId
        });
        runInAction(() => {
            this.perfList = respData.map((url) => new ModelTaskDetailPerf({
                url,
                planId: this.planId,
                taskId: this.taskId,
                beginTime: this.startTime,
                endTime: this.stopTime,
                status: this.status,
                types: this.type,
                businessCode: this.businessCode
            }));
            if (this.perfList[0]) {
                this.perfList[0].showHide = 'block';
            }
        });
    }

    /**
     * 加载测试配置列表
     */
    private async loadTasStats(): Promise<void> {
        const respData = await getStats({
            api: '',
            beginTime: 1528966018,
            endTime: 1528967818
        }, {
            planId: this.planId,
            taskId: this.taskId
        });

        runInAction(() => {
            //
        });
    }
}
