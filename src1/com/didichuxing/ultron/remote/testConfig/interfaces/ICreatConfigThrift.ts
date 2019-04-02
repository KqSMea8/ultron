import {IPlainObject} from 'com/didichuxing/IPlainObject';

export interface IParamsConfigItem {
    name: string; // "a",
    type: number; // 1,
    value: string; // "2"
}

export interface IParams {
    groupNumber: number; // 5,
    planName: string; // "create_thrift_test_05",
    idl: string; // "/home/xiaoju/data/111.thrift",
    service: string; // "demo",
    method: string; // "demo",
    parameterConfigs: IParamsConfigItem[];
    server: {
        ipList: string[]; // ["127.0.0.1"],
        port: number; // 8090
    };
    protocol: {
        type: string; // 1
    };
}

export interface IReturn {
    server: {
        port: number; // 8090,
        ipList: string[]; // ["127.0.0.1"]
    };
    method: string; // "demo",
    planName: string; // "create_thrift_test_05",
    pressureMode: number; // 1,
    groupNumber: number; // 5,
    idl: string; // "/home/xiaoju/data/111.thrift",
    groupName: string; // "H5",
    protocol: {
        type: string; // 1
    };
    service: string; // "demo",
    pressureType: number; // 4,
    planId: number; // 703,
    createUser: string; // "",
    parameterConfigs: IParamsConfigItem[];
}
export  interface  ICustomHeader {
    business: string;
}
