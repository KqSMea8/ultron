import { IPlainObject } from 'com/didichuxing/IPlainObject.ts';
export interface IParams extends IPlainObject { }

export interface IReturn {
    depth: number;
    isParen: boolean;
    ns: string;
    iconSkin: string;
    children: IReturn[];
    name: string; // "ultron",
    id: number; // 151718,
    category: string; // "service",
    open: boolean; // false
}
