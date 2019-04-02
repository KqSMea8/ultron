import { IPlainObject } from 'com/didichuxing/IPlainObject.ts';

export interface IParams {
    api: string; // "/test/jmeter/createOrder"
    timestamp: number;
}

export interface IReturnItem {
    status: number;
    code: number;
    agent_ip: string;
    trace_id: string;
    request: string;
    response: string;
    error: string;
}

export interface IReturn {
    planId: number;
    taskId: number;
    api: string;
    timestamp: number;
    samples: IReturnItem[];
}
