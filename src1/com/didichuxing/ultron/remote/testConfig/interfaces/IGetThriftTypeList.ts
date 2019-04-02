import { IPlainObject } from 'com/didichuxing/IPlainObject.ts';

export interface IParams extends IPlainObject { }

export interface IReturnItem {
    name: string; // "1",
    value: string; // "bool"
}

export interface IReturn extends Array<IReturnItem> {}
