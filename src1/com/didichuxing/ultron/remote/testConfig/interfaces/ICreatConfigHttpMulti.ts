import {IPlainObject} from 'com/didichuxing/IPlainObject.ts';
export interface IParams {
    groupNumber: number; // 4,
    planName: string; // "create_replay_test",
    urlPrefix: any; // []
    headers: IPlainObject;
    filePath: string; // "/home/xiaoju/webroot/pressure-platform/result/getalltraveltime.txt"
    serverAddress: string; // "thrift://100.69.111.43:8009?timeout=50000"
    contents: string[];
    planId: string; // 307
    createUser: string; // ""
    cookies: IPlainObject; // ,
    ifDefaultServerAddress: boolean; // true
    more: {
        keepAlive: boolean; //  true,
        timeout: number; //  5000,
        maxRedirects: number; //  0,
    };
}

export interface IReturn {
    headers: IPlainObject;
    urlPrefix: any; // []
    more: {
        keepAlive: boolean; //  true,
        timeout: number; //  5000,
        maxRedirects: number; //  0
    };
    filePath: string; // "/home/xiaoju/webroot/pressure-platform/result/getalltraveltime.txt"
    serverAddress: string; // "thrift://100.69.111.43:8009?timeout=50000"
    planName: string; // "create_replay_test"
    pressureMode: number; // 2
    ifDefaultServerAddress: boolean; // true
    groupNumber: number; // 4
    cookies: IPlainObject; // {}
    groupName: string; // "公交"
    pressureType: number; // 2
    planId: number; // 478
    createUser: string; // ""
}
export  interface  ICustomHeader {
    business: string;
}
