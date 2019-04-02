import {IPlainObject} from 'com/didichuxing/IPlainObject.ts';
export interface IParams {
    groupNumber: number; // 5,
    planName: string; // "create_single_test",
    service: {
        type: string;
        info: string;
    };
    url: string; // "http://100.69.185.15:8001/test/jmeter/createOrder",
    method: string; // "POST",
    body: string; // "{\"a\":1}",
    headers: IPlainObject; //  {'Content-Type': "application/json;charset=UTF-8"}
    cookies: IPlainObject; // {},
    more: {
        keepAlive: boolean; //  true,
        timeout: number; //  5000,
        maxRedirects: number; //  0,
        // fileName: string; // "/home/xiaoju/test.csv"
    };
}
export interface IReturn {
    headers: IPlainObject; //  {'Content-Type': "application/json;charset=UTF-8"}
    method: string; //  "POST",
    more: {
        fileName: string; //  "test.csv",
        keepAlive: boolean; //  true,
        timeout: number; //  5000,
        maxRedirects: number; //  0
    };
    planName: string; //  "create_single_test",
    pressureMode: number; //  1,
    body: string; //  "{\"a\":1}",
    groupNumber: number; //  5,
    url: string; //  "http://100.69.185.15:8001/test/jmeter/createOrder",
    cookies: IPlainObject; //  {},
    groupName: string; //  "H5",
    pressureType: number; //  2,
    planId: number; //  477,
    createUser: string; //  ""
}
export  interface  ICustomHeader {
    business: string;
}
