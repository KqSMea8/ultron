export interface IParams {
    planId: string; // 464 压测计划id
}

export interface IReturn {
    groupName: string; // "H5"
    contents: string; // [\"GET||http://100.69.185.15:8001/test/jmeter/createOrder||||||\"]
    more: {
        keepAlive: boolean; // true 保持长连接
        timeout: number; // 5000 超时时间
        maxRedirects: number; // 0 重定向次数
        fileName?: any; // "plan280.csv" 文件名称
        ifDefaultFileServer?: string;
        ip?: any;
        path?: any;
        interfaceFilePaths: any;
        businessCode: string;
    };
    pressureType: number; // 2
    planName: string; // "场景压测test21"
    planId: number; // 464
    createUser: string; // ""
    pressureMode: number; // 3
    groupNumber: string; // 5
}
