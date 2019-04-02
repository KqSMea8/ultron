import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams {
    start: string;
}

export interface IReturnItem {
    cluster: string; // "HNB", //集群信息
    actual: number; // 305000, //压测或者线上实际流量
    dataTypeDesc: string; //  "全链路压测",
    unit: string; // "/min", //单位
    goal: number; // 300000,// 目标流量
    createTime: number; // 1542337870, //时间
    dataType: number; // 201,
    reportId: number; // 1 //压测详情报告id
}
export interface IUrlParams {
    id: string;
}
export interface IReturn extends Array<IReturnItem> {}
