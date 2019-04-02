import { IPlainObject } from 'com/didichuxing/IPlainObject';
export interface IParams {
    checkValue: string;
}

export interface IReturnItem {
    uid: string; // "422223570392788"
    role: string; // "压测乘客"
    cityId: string; // "-1"
    region: string; // "港台"
    business: string; // 快车
    phone: string; // 11105326804
}

export interface IReturn extends Array<IReturnItem> {}
