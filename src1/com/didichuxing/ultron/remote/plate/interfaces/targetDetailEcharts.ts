import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams extends IPlainObject { }

export interface IReturnItem {
    dataType: number;
    dataTypeDesc: string;
    curve: IReturnItem1[];
    beginTime: number;
    endTime: number;
}
export interface IReturnItem1 {
    name: string;
    value: string;
}
export interface IUrlParams {
    id: string;
}
export interface IReturn extends Array<IReturnItem> {}
