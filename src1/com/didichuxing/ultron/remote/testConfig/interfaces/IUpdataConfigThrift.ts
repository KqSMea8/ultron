import { IPlainObject } from 'com/didichuxing/IPlainObject';
interface IParamsConfigItem {
    name: string; // "a",
    type: number; // 1,
    value: string; // "2"
}
export interface IParams {
    groupNumber: number; // 5,
    planName: string; // "create_thrift_test_05",
    idl: string; // "/home/xiaoju/data/111.thrift",
    service: string; // "demo1",
    method: string; // "demo1",
    parameterConfigs: IParamsConfigItem[];
    server: {
        ipList: string[]; // ["127.0.0.2"],
        port: number; // 8091
    };
    protocol: {
        type: string; // 2
    };
}

export interface IUrlParams {
    planId: string; //  ""
}

export interface IReturn {
    server: {
        port: number; // 8091,
        ipList: string[]; // ["127.0.0.2"]
    };
    method: string; // "demo1",
    planName: string; // "create_thrift_test_05",
    pressureMode: number; // 1,
    groupNumber: number; // 5,
    idl: string; // "/home/xiaoju/data/111.thrift",
    groupName: string; // "H5",
    protocol: {
        type: string; // 2
    };
    service: string; // "demo1",
    pressureType: number; // 4,
    planId: number; // 703,
    createUser: string; // "",
    parameterConfigs: IParamsConfigItem[];
}
