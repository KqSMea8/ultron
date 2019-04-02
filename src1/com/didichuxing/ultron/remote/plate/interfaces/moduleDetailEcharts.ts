import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams extends IPlainObject { }

export interface IUrlParams {
    moduleId: string;
}

export interface IReturnItem {
    group: string;
    id: string;
    name: string;
    goal: string;
    prod: string;
    test: string;
    unit: string;
    records: IReturnItem1[];
    updateTime: string;
}
export interface IReturnItem1 {
    ratio: number;
    dataType: string;
    dataTypeDesc: string;
    capacityActual: number;
    capacityGoal: number;
    capacityUnit: string;
    reportId: number;
    createTime: number;
}
export interface IReturn {
    [key: string]: IReturnItem[];
}
