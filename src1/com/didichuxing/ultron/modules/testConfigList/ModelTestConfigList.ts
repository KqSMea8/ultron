import { action, computed, observable, runInAction } from 'mobx';
import {
    queryPressurePlans,
    deletePlan
} from '@ultron/remote/testTask';
import * as IQueryPressurePlan from '@ultron/remote/testTask/interfaces/IQueryPressurePlan';
import moment from 'moment';
import { textTestTaskState } from '@ultron/business/common/enum/ETestTaskState';
import { ETestConfigType, textTestConfigType } from '@ultron/business/common/enum/ETestConfigType';
import { IPlainObject } from 'com/didichuxing/IPlainObject';
import { AModuleModel } from 'com/didichuxing/commonInterface/AModuleModel';
import { getCookie } from '@ultron/business/common/http/cookies';
import { Simulate } from 'react-dom/test-utils';
import message from '@antd/message';
import copy = Simulate.copy;

let count: number = 0;

const MAP_URL_CONFIG = {
    1: '/ultron/interfaceTest/httpSingleDetail',
    2: '/ultron/interfaceTest/httpMultiDetail',
    3: '/ultron/interfaceTest/httpSceneDetail',
    4: '/ultron/interfaceTest/thriftDetail'
};

/**
 * 列表项
 */
export class ModelListItem {
    public key: string = String(count++);
    public item: IQueryPressurePlan.IReturnItem;

    constructor(p: IQueryPressurePlan.IReturnItem) {
        this.item = p;
    }

    /**
     * 名称
     * @returns {string}
     */
    public get vName(): string {
        return this.item.planName;
    }

    public get vUrlConfig(): string {
        if (this.item.pressureType === 4) {
            return MAP_URL_CONFIG[this.item.pressureType] || MAP_URL_CONFIG[1];
        } else {
            return MAP_URL_CONFIG[this.item.pressureMode] || MAP_URL_CONFIG[1];
        }
    }

    public get vUrlTask(): string {
        return '/ultron/interfaceTest/taskDetail';
    }

    /**
     * 类型
     * @returns {string}
     */
    public get vTestType(): string {
        const type1: any = this.item.pressureType;
        const type: any = this.item.pressureMode;
        if (this.item.pressureType === 4) {
            return textTestConfigType(type1);
        } else {
            return textTestConfigType(type);
        }
    }

    /**
     * 所属分组
     * @returns {string}
     */
    public get vGroup(): string {
        return this.item.groupName;
    }

    /**
     * 状态
     * @returns {string}
     */
    public get vTestState(): string {
        return textTestTaskState(this.item.status);
    }

    /**
     * 创建人
     * @returns {string}
     */
    public get vCreator(): string {
        return this.item.createUser;
    }

    /**
     * 累计压测次数
     * @returns {string}
     */
    public get vTestCount(): string {
        return String(this.item.pressureCount);
    }

    /**
     * 压测时间
     * @returns {string}
     */
    public get vTestTime(): string {
        return this.item.pressureTime ? moment(this.item.pressureTime * 1000).format('YYYY-MM-DD HH:mm') : '无';
    }

    /**
     * 操作
     */
    public get vHandle(): string {
        return '删除';
    }
}

/**
 * Http单接口更多配置业务模型
 */
export default class ModelTestConfigList extends AModuleModel {
    public readonly SIZE: number = 10;
    @observable public page: number = 1;
    @observable public keywordAll: string = '';
    @observable public keywordMine: string = '';
    @observable public userName: string = getCookie().username || 'hanweiqi_v';

    @observable public total: number = 0;
    @observable public list: ModelListItem[] = [];

    @observable public loading: boolean = false;
    @observable public deletePlanId: number = 0;

    constructor(query?: IPlainObject) {
        super();

        this.initByQueryFields(query);
    }

    protected getQueryFields(): string[] {
        return ['keywordAll', 'keywordMine', 'userName', 'page'];
    }

    /**
     * 加载测试配置列表
     */
    private async loadDataList(): Promise<void> {
        runInAction(() => {
            this.loading = true;
        });
        try {
            const params: IQueryPressurePlan.IParams = {
                page: this.vPage,
                size: this.SIZE
            };

            const keyword = this.isCertainOne ? this.keywordMine : this.keywordAll;
            if (this.isCertainOne) {
                params.createUser = this.userName;
            }
            if (keyword) {
                params.content = keyword;
            }

            const result = await queryPressurePlans(params);
            runInAction(() => {
                this.total = result.total;
                this.list = result.results.map((it) => new ModelListItem(it));
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    /**
     * 删除压测计划
     * @returns {Promise<void>}
     */
    private async getDeletePlan(): Promise<void> {
        try {
            await deletePlan({}, { planId: this.deletePlanId });
            await this.loadDataList();
        } catch (e) {}
    }

    @computed
    private get isCertainOne(): boolean {
        return !!this.userName;
    }

    @computed
    public get vPage(): number {
        return Number(this.page) || this.minPage;
    }

    @computed
    public get vTabKey(): string {
        return this.isCertainOne ? '2' : '1';
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
    public toPage(n: number): void {
        this.page = n;
        this.loadDataList();
    }

    /**
     * 下一页
     */
    public toNextPage(): void {
        this.toPage(this.page + 1);
    }

    /**
     * 上一页
     */
    public toPrevPage(): void {
        this.toPage(this.page - 1);
    }

    /**
     * 设置搜索关键字（全部）
     * @param {string} val
     */
    @action
    public setKeywordAll(val: string) {
        this.keywordAll = val;
    }

    /**
     * 设置搜索关键字（我的）
     * @param {string} val
     */
    @action
    public setKeywordMine(val: string) {
        this.keywordMine = val;
    }

    /**
     * 设置搜索关键字
     * @param {string} val
     */
    @action
    public setUserName(val: string) {
        this.userName = val;
        this.loadData(this.minPage);
    }

    /**
     * 加载数据（程序的起点）
     */
    public loadData(num?: number): void {
        this.toPage(num || this.vPage);
    }

    /**
     * 删除压测计划
     */
    public deletePlan(val): void {
        this.deletePlanId = val;
        this.getDeletePlan();
    }
}
