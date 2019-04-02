import { IPlainObject } from 'com/didichuxing/IPlainObject.ts';

export interface IParams extends IPlainObject { }

export interface IReturnItem {
    name: string; // "0",
    value: string; // "TBinaryProtocol"
}

export interface IReturn extends Array<IReturnItem> {}
