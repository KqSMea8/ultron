import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams {
    planId: string; // 280 压测计划id
}

export interface IReturn {
    headers?: IPlainObject; // "AAAA": "test"
    cookies?: IPlainObject; // "AAAA": "test"
    method: string; // GET
    more: {
        fileName?: any; // "plan280.csv" 文件名称
        keepAlive: boolean; // true 保持长连接
        timeout: number; // 5000 超时时间
        maxRedirects: number; // 0 重定向次数
        ifDefaultFileServer?: string;
        ip?: any;
        path?: any;
        businessCode: string;
    };
    service?: {
        type: number;
        info: string;
    };
    planName: string; // "hd_test_url_0918"
    pressureMode: number; // 1
    groupNumber: number; // 5
    url: string; // "http://100.69.185.15:8001/testget?uid=${uid}"
    groupName: string; // "H5"
    pressureType: number; // 2
    planId: number; // 280
    createUser: string; // ""
    body: string;
}
