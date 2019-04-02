import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams {
    planId: string; // 307 压测计划id
}

export interface IReturn {
    headers: IPlainObject; // "Content-Type": "application/json;charset=utf-8"
    cookies?: IPlainObject;
    urlPrefix: string; // ["http://10.94.96.212:8000"]
    more: {
        keepAlive: boolean; // true 保持长连接
        timeout: number; // 10000 超时时间
        maxRedirects: number; // 10 重定向次数
        businessCode: string;
    };
    filePath: string; // "/home/xiaoju/webroot//getalltraveltime.txt"  文件路径
    serverAddress: string; // "thrift://100.69.111.43:8009?timeout=50000"  服务地址
    planName: string; // "公交-1511838113499"
    pressureMode: number; // 2
    ifDefaultServerAddress: boolean; // true 是否为默认服务
    contents: string;
    groupNumber: number; // 4
    groupName: string; // "公交"
    pressureType: number; // 2
    planId: number; // 307
    createUser: string; // ""
    fileName?: any;
}
