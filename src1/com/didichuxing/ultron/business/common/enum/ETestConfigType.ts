/**
 * 枚举测试的状态信息
 */
export enum ETestConfigType {
    // HTTP单接口
    HttpSingle = 1,
    // HTTP多接口
    HttpMulti = 2,
    // HTTP场景
    HttpScene = 3,
    // Thrift压测
    Thrift = 4
}

const MAP_TEXT = {
    1: 'HTTP接口',
    2: 'HTTP日志回放',
    3: 'HTTP场景',
    4: 'Thrift接口'
};

/**
 * 压测类型数值转文字
 * @param {number} type
 * @returns {any | number}
 */
export function textTestConfigType(type: ETestConfigType): string {
    const text: any = MAP_TEXT[type] || type;
    return text;
}
