import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams {
    api: string;
}

export interface IUrlParams {
    planId: string;
}

export interface IReturnItem {
    duration: number; // 10,
    createTime: string; // "Nov 27, 2018 6:48:26 PM",
    qps: number; // 1002,
    code_counts: any; // "{\"2\":57743,\"3\":57742}",
    requests: number; // 115485,
    status_counts: any; // "{\"200\":115485}",
    taskId: number; // 3518
    rt_avg: number;
}

export interface IReturn extends Array<IReturnItem> {}
