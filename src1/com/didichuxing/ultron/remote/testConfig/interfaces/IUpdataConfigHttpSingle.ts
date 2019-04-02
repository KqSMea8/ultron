import {IPlainObject} from 'com/didichuxing/IPlainObject.ts';
export interface IParams {
    groupNumber: number; // 5,
    planName: string; // "create_single_test",
    url: string; // "http://100.69.185.15:8001/test/jmeter/createOrder",
    method: string; // "POST",
    body: string; // "{\"a\":3}",
    headers: IPlainObject;
    cookies: IPlainObject; // {},
    more: {
        keepAlive: boolean; //  false,
        timeout: number; //  3000,
        maxRedirects: number; //  10,
        // fileName: string; // "/home/xiaoju/test.csv"
    };
}

export interface IUrlParams {
    planId: string; //  ""
}

export interface IReturn {
    headers: IPlainObject;
    method: string; //  "POST",
    more: {
        fileName: string; //  "test1.csv",
        keepAlive: boolean; //  false,
        timeout: number; //  3000,
        maxRedirects: number; //  10
    };
    planName: string; //  "create_single_test",
    pressureMode: number; //  1,
    body: string; //  "{\"a\":3}",
    groupNumber: number; //  5,
    url: string; //  "http://100.69.185.15:8001/test/jmeter/createOrder",
    cookies: IPlainObject; //  {},
    groupName: string; //  "H5",
    pressureType: number; //  2,
    planId: number; //  477,
    createUser: string; //  ""
}
