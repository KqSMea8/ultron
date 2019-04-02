import * as IGetPressureTaskError from '@ultron/remote/testTask/interfaces/IGetPressureTaskError';
import { observable, runInAction} from 'mobx';
let count: number = 0;
/**
 * 错误列表项
 */
export class ErrorListItem {
    public key: string = String(count++);
    public item: IGetPressureTaskError.IReturnErrorItem;

    constructor(p: IGetPressureTaskError.IReturnErrorItem) {
        this.item = p;
    }

    /**
     * 数量
     */
    public get vNumber(): number {
        return this.item.count;
    }

    /**
     * 错误码
     */
    public get vCode(): string {
        return this.item.code;
    }

    /**
     * 错误原因
     */
    public get vMessage(): string {
        return this.item.message;
    }

    /**
     * Trace
     */
    public get vTrace(): string {
        return this.item.traceId;
    }

    /**
     * 详情
     */
    public get vDetail(): string {
        return this.item.detail;
    }
}
/**
 * 错误列表
 */
export class ErrorList {
    public key: string = String(count++);
    @observable public errorUrl: string = '';
    @observable public errorList: ErrorListItem[] = [];

    constructor(item?: IGetPressureTaskError.IReturnErrorUrl) {
        item && this.fillByError(item);
    }

    public fillByError(item: IGetPressureTaskError.IReturnErrorUrl) {
        runInAction(() => {
            this.errorUrl = item.url;
            this.errorList = item.data.map((it) => new ErrorListItem(it));
        });
    }
}
