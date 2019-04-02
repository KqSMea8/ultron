import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams {
    region: string; // 1 机房
    type: any; // 压测类型
}

export interface IReturn {
    region: string;
    type: number;
    idleAgentNumber: number;
}
