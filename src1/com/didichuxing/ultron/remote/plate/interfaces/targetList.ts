import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams extends IPlainObject { }

export interface IReturnItem {
    group: string;
    id: string;
    name: string;
    goal: string;
    test: string;
    unit: string;
    histories: IReturnItem1[];
    updateTime: string;
}
export interface IReturnItem1 {
    ratio: number;
    dataType: string;
    dataTypeDesc: string;
}
export interface IReturn {
    [key: string]: IReturnItem[];
}
