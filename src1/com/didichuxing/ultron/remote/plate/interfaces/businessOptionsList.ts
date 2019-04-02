import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams extends IPlainObject { }

export interface IReturnItem {
    id: number;
    name: string;
    group: string;
    ratio: number;
    unverified: number;
    unqualified: number;
    qualified: number;
    updateTime: number;
}
export interface IReturn extends Array<IReturnItem> {}
