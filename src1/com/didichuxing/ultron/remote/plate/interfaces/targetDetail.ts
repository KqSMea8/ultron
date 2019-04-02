import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams extends IPlainObject { }

export interface IUrlParams {
    id: string;
}
export interface IReturn {
    indicatorId: number;
    prod: {
        dataType: number;
        dataTypeDesc: string;
        capacityActual: number;
        capacityUnit: string;
        createTime: number;
        reportId: number;
    };
    test: {
        dataType: number; // 201,
        dataTypeDesc: string; // "全链路压测",
        capacityActual: number; // 800, //压测容量
        capacityUnit: string; // "w/min",
        createTime: number; // 1542763263,
        reportId: number; // 1
    };
    goal: {
        indicatorId: number; // 18,
        goal: number; // 24, //目标容量
        unit: string; // "w/min",
        createTime: number; // 1542337940
    };
    businessName: string;
    moduleName: string;
    indicatorName: string;
    businessId: number;
    moduleId: number;
    relation: any[];
}
