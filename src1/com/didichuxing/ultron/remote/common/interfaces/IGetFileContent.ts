import { IPlainObject } from 'com/didichuxing/IPlainObject.ts';
export interface IParams {
    ifDefaultFileServer: boolean;
    host?: string;
    filePath: string;
    lineNumber: string;
}

export interface IReturn extends IPlainObject {}
