/**
 * Created by didi on 2018/7/3.
 */
export interface IParams {
    groupNumber: number; // 4,
    planName: string; // "create_test_scene",
    contents: string; // ["GET||http://100.69.185.15:8001/test/jmeter/createOrder||||||"]
    more: {
        keepAlive: boolean; //  false,
        timeout: number; //  3000,
        maxRedirects: number; //  10,
    };
}

export interface IUrlParams {
    planId: string; //  ""
}

export interface IReturn {
    groupName: string; // "公交"
    contents: string; // ["GET||http://100.69.185.15:8001/test/jmeter/createOrder||||||"]
    more: {
        keepAlive: boolean; //  false,
        timeout: number; //  3000,
        maxRedirects: number; //  10
    };
    pressureType: number; //  2,
    planName: string; //  "create_test_scene",
    planId: number; //  481,
    createUser: string; //  ""
    pressureMode: number; //  3,
    groupNumber: number; //  4,
}
