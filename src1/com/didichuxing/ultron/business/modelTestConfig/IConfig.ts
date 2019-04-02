import { ETestConfigType } from '@ultron/business/common/enum/ETestConfigType';

/**
 * 测试配置的分组
 */
export interface IModelTestConfigGroup {
    // 本测试配置的id
    id?: string;
    // 本测试配置的name
    name?: string;
}

/**
 * 测试配置
 */
export interface IModelTestConfig {
    // 本测试配置的id
    id?: string;
    // 本测试配置的name
    name?: string;
    // 本测试配置的分组
    group: IModelTestConfigGroup;
    // 本测试配置的创建者
    creator?: string;
    // 本测试配置的类型
    readonly type?: ETestConfigType;

    [index: string]: any;
}

/**
 * 测试配置的状态
 */
export interface IModelTestConfigState extends IModelTestConfig {
    // 本测试配置的运行过的总数
    totalTestCount: number;
    // 本测试配置的上次运行的时间
    lastTestTime: Date;

    [index: string]: any;
}
