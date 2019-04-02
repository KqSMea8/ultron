import { action, computed, observable, runInAction } from 'mobx';
import { getPressureTaskList, deleteTask } from '@ultron/remote/testTask';
import * as IGetPressureTaskList from '@ultron/remote/testTask/interfaces/IGetPressureTaskList';
import * as IGetReports from '@ultron/remote/testConfig/interfaces/IGetReports';
import ModelTestConfigSH from '@ultron/business/modelTestConfig/ConfigHttpSingle';
import moment from 'moment';
import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import { IPlainObject } from 'com/didichuxing/IPlainObject';
import { textTestTaskState } from '@ultron/business/common/enum/ETestTaskState';
import { getReports, getApi } from '@ultron/remote/testConfig';

let count: number = 0;

/**
 * 列表项
 */
export class ModelListItem {
    public key: string = String(count++);
    public item: IGetPressureTaskList.IReturnItem;

    constructor(p: IGetPressureTaskList.IReturnItem) {
        this.item = p;
    }

    /**
     * 压测ID
     */
    public get vTaskId(): number {
        return this.item.taskId;
    }

    /**
     * 压测时间
     * @returns {string}
     */
    public get vTestTime(): string {
        if (this.item.startAt === 0) {
            return moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
        } else {
            return moment(this.item.startAt * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
    }

    /**
     * 操作人
     */
    public get vCreateUser(): string {
        return this.item.createUser;
    }

    /**
     * 机房
     */
    public get vRegion(): string {
        return this.item.region;
    }

    /**
     * 压力
     */
    public get vPressure(): any {
        if (this.item.pressure.type === 1) {
            return `固定QPS：${this.item.pressure.throughput}QPS，
            预热${this.item.pressure.rampup}秒，持续${this.item.pressure.duration}秒`;
        } else if (this.item.pressure.type === 2) {
            return `固定并发：${this.item.pressure.concurrency}并发，
            预热${this.item.pressure.rampup}秒，持续${this.item.pressure.duration}秒`;
        } else if (this.item.pressure.type === 3) {
            return `阶梯QPS：初始${this.item.pressure.initThroughput}QPS，峰值
            ${this.item.pressure.lastThroughput}QPS，每步增加${this.item.pressure.increasePerStep}，
            每步持续${this.item.pressure.durationPerStep}秒`;
        } else {
            return `阶梯并发：初始${this.item.pressure.initConcurrency}并发，峰值
            ${this.item.pressure.lastConcurrency}并发，每部增加${this.item.pressure.increasePerStep}，
            每步持续${this.item.pressure.durationPerStep}秒`;
        }
    }

    /**
     * 状态
     */
    public get vStatus(): number {
        return textTestTaskState(this.item.status);
    }
}

/**
 * 第二个列表项
 */
export class ModelListItems {
    public key: string = String(count++);
    public item: IGetReports.IReturnItem;

    constructor(p: IGetReports.IReturnItem) {
        this.item = p;
    }

    /**
     * 压测ID
     */
    public get vTaskIds(): number {
        return this.item.taskId;
    }

    /**
     * 压测时间
     * @returns {string}
     */
    public get vTestTimes(): string {
        return this.item.createTime;
    }

    /**
     * 请求总数
     * @returns {number}
     */
    public get vTotal(): string {
        // return this.item.requests;
        let num = (this.item.requests).toString();
        let result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
        return result;
    }

    /**
     * 峰值qps
     * @returns {number}
     */
    public get vTopQPS(): string {
        // return this.item.qps;
        let num = (this.item.qps).toString();
        let result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
        return result;
    }
    /**
     * 平均耗时
     * @returns {number}
     */
    public get vAvg(): number {
        return this.item.rt_avg;
    }
}

/**
 * http单接口查看配置模型
 */
export default class ModelHttpSingleTask extends AModuleModel {
    public modelConfigHttpSingle: ModelTestConfigSH;
    public readonly SIZE: number = 10;
    @observable private page: number = 0;
    @observable public planId: string = '280';

    @observable public total: number = 0;
    @observable public list: ModelListItem[] = [];
    @observable public lists: ModelListItems[] = [];
    @observable public taskId: string = '';
    @observable public flag: boolean = false;
    @observable public taskIds: string = '';
    @observable public apiValue: string = '';
    @observable public apiArr: any[] = [];
    @observable private deleteTaskId: number = 0;

    @action
    public setTaskId(val: string) { this.taskId = val; }

    @computed
    public get vUrlTaskDetail() {
        const p = {
            planId: this.planId,
            taskId: this.taskId,
            type: this.modelConfigHttpSingle.type,
            planName: this.modelConfigHttpSingle.planName,
            businessCode: this.modelConfigHttpSingle.moreConfig.businessNum
        };
        const search = Object.keys(p).map((key) => key + '=' + encodeURIComponent(p[key])).join('&');
        return '/new.html/ultron/interfaceTest/taskDetail?' + search;
    }
    @computed
    public get vUrlTaskDetails() {
        const p = {
            planId: this.planId,
            taskId: this.taskIds,
            type: this.modelConfigHttpSingle.type,
            planName: this.modelConfigHttpSingle.planName,
            businessCode: this.modelConfigHttpSingle.moreConfig.businessNum
        };
        const search = Object.keys(p).map((key) => key + '=' + encodeURIComponent(p[key])).join('&');
        return '/new.html/ultron/interfaceTest/taskDetail?' + search;
    }

    constructor(query: IPlainObject = {}) {
        super();
        this.initByQueryFields(query);
        this.modelConfigHttpSingle = new ModelTestConfigSH(query.planId, query.planName);
    }

    protected getQueryFields(): string[] {
        return ['planId'];
    }

    /**
     * 加载测试配置列表
     */
    public async loadDataList(): Promise<any> {
        const result = await getPressureTaskList({
            planId: this.planId,
            page: this.page,
            size: this.SIZE
        });
        runInAction(() => {
            this.total = result.total;
            this.list = result.results.map((it) => new ModelListItem(it));
            if (this.list.length > 0 && this.list[0].item.status === 20) {
                this.taskId = String(this.list[0].item.taskId);
            }
        });
        if (this.list.some((it) => it.item.status === 10)) {
            this.list.some((items): any => {
                items.item.status === 10 ? this.taskIds = String(items.item.taskId) : '';
            });
            this.flag = true;
        } else {
            this.flag = false;
        }
    }
    public async loadDataLists(): Promise<any> {
      const resData = await getReports({ api: this.apiValue }, { planId: this.planId });
      runInAction(() => {
         this.lists = resData.map((it) => new ModelListItems(it));
      });
    }

    public async loadDataApi(): Promise<any> {
        try {
            const resData = await getApi({}, {planId: this.planId});
            if (resData) {
                if (resData.length > 0) {
                    this.apiValue = resData[0];
                }
                this.apiArr = resData as any;
                this.loadDataLists();
            }
        } catch (e) {}
    }

    /**
     * 删除压测任务
     * @returns {Promise<void>}
     */
    public async getDeleteTask(): Promise<void> {
        try {
            await deleteTask({}, { planId: Number(this.planId), taskId: this.deleteTaskId});
            await this.loadDataList();
            await this.loadDataApi();
        } catch (e) {}
    }

    /**
     * 最小页数
     * @returns {number}
     */
    private get minPage(): number {
        return 1;
    }

    /**
     * 最大页数
     * @returns {number}
     */
    private get maxPage(): number {
        return Math.floor(this.total / this.SIZE) + 1;
    }

    /**
     * 前往某页
     * @param {number} n
     */
    @action
    public toPage(n: number): any {
        if (n !== this.minPage && (n < this.minPage || n > this.maxPage)) {
            return;
        }
        this.page = n;
        this.loadDataList();
    }

    @computed
    public get vPage(): number {
        return Number(this.page) || this.minPage;
    }

    /**
     * 下一页
     */
    public toNextPage(): any {
        this.toPage(this.page + 1);
    }

    /**
     * 上一页
     */
    public toPrevPage(): any {
        this.toPage(this.page - 1);
    }

    /**
     * 加载数据（程序的起点）
     */
    public loadData(): any {
        this.toPage(this.minPage);
    }
    @action
    public setApiChange(val): void {
        this.apiValue = val;
        this.loadDataLists();
    }

    @action
    public deleteTask(val): void {
        this.deleteTaskId = val;
        this.getDeleteTask();
    }
}
