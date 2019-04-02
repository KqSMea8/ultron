/**
 * 枚举代理机状态
 */
export enum ETestAgentState {
    // 空闲
    Idle = 0,
    // 待启动
    Prepare = 1,
    // 已启动
    Started = 2,
    // 待停止
    Stopping = 3,
    // 已停止
    Stopped = 4
}

const MAP_TEXT = {
    0: '空闲',
    1: '待启动',
    2: '已启动',
    3: '待停止',
    4: '已停止'
};

/**
 * 代理机状态数值转文字
 * @param {number} state
 * @returns {any | number}
 */
export function textTestAgentState(state: number) {
    return MAP_TEXT[state] || state;
}
