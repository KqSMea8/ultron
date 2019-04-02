export interface IParams {
    groupNumber: number; // 4,
    planName: string; // "create_test_scene",
    contents: string; // "[\"GET||http://100.69.185.15:8001/test/jmeter/createOrder||||||\"]"
    more: {
        keepAlive: boolean; //  true,
        timeout: number; //  5000,
        maxRedirects: number; //  0,
        interfaceFilePaths: any;
    };
}

export interface IReturn {
    groupName: string; // "公交"
    contents: string; // ["GET||http://100.69.185.15:8001/test/jmeter/createOrder||||||"]
    more: {
        fileName: string; //  "test.csv",
        keepAlive: boolean; //  true,
        timeout: number; //  5000,
        maxRedirects: number; //  0
        interfaceFilePaths: any;
    };
    pressureType: number; //  2,
    planName: string; //  "create_test_scene",
    planId: number; //  481,
    createUser: string; //  ""
    pressureMode: number; //  3,
    groupNumber: number; //  4,
}
export  interface  ICustomHeader {
    business: string;
}
