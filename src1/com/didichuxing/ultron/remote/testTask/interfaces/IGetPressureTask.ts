export interface IParams { }

export interface IReturnItem {
    id: number; // 2421
    status: number; // 4 状态
    agentId: number; // 2
    agentRegion: string; // 1 机房
    agentName: string; // "agent01.ultron.com" // 名称
    agentIp: string; // "10.94.121.110" // IP
    agentPid: number; // 3991 进程ID
    startAt: number; // 1530002552 开始时间
    stopAt: number; // 1530002924 结束时间
}

export interface IReturnTestMode { // 压力
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
}

export interface IReturn {
    taskId: number; // 2404
    status: number; // 40 状态
    region: number; // 1 机房
    startAt: any; // 1530002552
    stopAt: any; // 1530002924
    createUser: string; // ""
    pressure: IReturnTestMode;
    agents: IReturnItem[];
    unassignedAgentNum: string;
}
