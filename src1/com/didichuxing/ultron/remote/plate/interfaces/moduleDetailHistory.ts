import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams {
    start: string;
}

export interface IReturnItem {
    reportId: number;
    dataTypeDesc: string;
    detaile: IReturnItem1[];
    beginTime: number;
}
export interface IReturnItem1 {
    cluster: string;
    cpuIdle: number;
    memUsedPercent: number;
    interfaceTraffic: number;
}
export interface IUrlParams {
    moduleId: string;
}
export interface IReturn extends Array<IReturnItem> {}
