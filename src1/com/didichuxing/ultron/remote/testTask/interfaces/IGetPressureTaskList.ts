export interface IParams {
    planId: string;
    page: number; // 1
    size: number; // 10
}

export interface IReturnItem {
    taskId: number; // 2404
    status: number; // 40 //状态
    region: string; // 1 //机房
    startAt: number; // 1530002552
    stopAt: number; // 1530002924
    createUser: string; // ""
    pressure: {
        type: number; // 3 压力类型：1-固定QPS，2-固定并发，1-固定QPS，2-固定并发，3-阶梯QPS，4-阶梯并发
        initThroughput?: number; // 500 初始QPS
        lastThroughput?: number; // 3000 峰值QPS
        increasePerStep?: number; // 500 每步增加
        durationPerStep?: number; // 60 每步持续时间
        throughput?: number; // 100  固定QPS
        duration?: number; // 1 预热时间
        rampup?: number; // 1 预热时间
        concurrency?: number; // 固定并发
        initConcurrency?: number; // 初始并发
        lastConcurrency?: number; // 峰值并发
    };
}

export interface IReturn {
    num: number; // 1
    size: number; // 10
    total: number; // 73
    results: IReturnItem[];
}
