import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams {
    planId: string;
}

export interface IParamsConfigItem {
    name: string; // "a",
    type: number; // 1,
    value: string; // "2"
}

export interface IReturn {
    server: {
        port: 8090,
        ipList: string[]; // ["127.0.0.1"]
    };
    method: string; // "demo",
    planName: string; // "create_thrift_test_03",
    pressureMode: number; // 1,
    groupNumber: number; // 5,
    idl: string; // "/home/xiaoju/data/111.thrift",
    idlName: string;
    groupName: string; // "H5",
    protocol: {
        type: number; // 1
    };
    service: string; // "demo",
    pressureType: number; // 4,
    planId: number; // 701,
    createUser: string; // "",
    timeout: number; // 10000
    ifMulti: boolean; // false,
    serviceName: string; // "",
    fileName?: any; // "",
    ifDefaultFileServer?: any;
    ip?: any;
    path?: any;
    parameterConfigs: IParamsConfigItem[];
}
