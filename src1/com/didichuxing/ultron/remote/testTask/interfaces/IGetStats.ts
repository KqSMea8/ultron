import { IPlainObject } from 'com/didichuxing/IPlainObject.ts';

export interface IParams {
    api: string; // "/test/jmeter/createOrder"
    beginTime: number; // 1528966018
    endTime: number; // 1528967818
}

export interface IPrefStatsItem {
    timestamp: string; // 1531723340000,
    rt_max: number; // 0,
    rt_min: number; // 0,
    rt_avg: number; // 0,
    rt_99: number; // 0,
    rt_50: number; // 0,
    rt_95: number; // 0,
    rt_75: number; // 0,
    qps: number; // 5,
    tps: number; // 0,
    duration: number; // 0,
    requests: number; // 46,
    count: number; // 46,
    err_count: number; // 46,
    status_counts: IPlainObject;
    code_counts: IPlainObject;
    custom_metrics: IPlainObject;
    status_details: IPlainObject;
}

export interface IReturn {
    type: string; // "http",
    data: IPrefStatsItem[];
    total: IPrefStatsItem;
}
