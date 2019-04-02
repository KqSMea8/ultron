import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams extends IPlainObject { }

export interface IReturnItems {
    unit: string; // "w/min"
    actualCapacity: number; // 40
    moduleName: string;
    estimateCapacity: number;
}

export interface IReturnItem {
    businessName: string; // "专快",
    modules: IReturnItems[];
}

export interface IReturn extends Array<IReturnItem> {}
