/**
 * 枚举测试任务的状态
 */
export enum ETestTaskState {
    // 新建
    New = 0,
    // 待运行
    Waiting = 10,
    // 运行中
    Running = 20,
    // 暂停中
    Pausing = 25,
    // 停止中
    Stopping = 30,
    // 已结束
    Finished = 40,
    // 已取消
    Canceled = 77
}

const MAP_TEXT = {
    0: '新建',
    10: '待运行',
    20: '运行中',
    25: '暂停中',
    30: '停止中',
    40: '已结束',
    77: '已取消'
};

/**
 * 测试任务的状态数值转文字
 * @param {number} state
 * @returns {any | number}
 */
export function textTestTaskState(state: number) {
    return MAP_TEXT[state] || state;
}
