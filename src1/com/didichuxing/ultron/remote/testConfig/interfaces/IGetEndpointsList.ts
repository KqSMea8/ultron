import { IPlainObject } from 'com/didichuxing/IPlainObject.ts';

export interface IParams extends IPlainObject { }

export interface IReturnItem {
    protocol: string; // "http",
    cuuid: string; // "hna.biz-gs-dds",
    port: number; // 9050,
    createTime: string; // "2018-06-06T14:10:11+08:00",
    endpointId: number; // 1067076,
    ip: string; // "100.70.118.37",
    weight: string; // 50,
    updateTime: string; // "2018-06-06T14:10:11+08:00",
    status: number; // 0
}

export interface IReturn extends Array<IReturnItem> {}
