import { IPlainObject } from 'com/didichuxing/IPlainObject.ts';
export interface IParams extends IPlainObject { }

export interface IReturnItem {
    planId: string;
    business: string;
    startTime: string;
    planName: string;
    pressureType: string;
    pressureMode: string;
}

export interface IReturn {
    size: number; // 10
    tasks: IReturnItem[];
}
