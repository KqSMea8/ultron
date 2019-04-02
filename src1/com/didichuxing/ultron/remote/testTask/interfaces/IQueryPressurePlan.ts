export interface IParams {
    page: number; // 1 页码
    size: number; // 3 页大小
    createUser?: string; // "lisong" 创建用户（所有压测值为空，我的压测值为当前登录用户）
    content?: string; // "http" 模糊查询输入内容
}

export interface IReturnItem {
    planId: number; // 162 压测计划ID
    planName: string; // "http-1499332497866", //压测计划名称
    groupNumber: number; // 15 所属组
    groupName: string; // "OpenH5" 所属组名称
    pressureType: number; // 2 压测类型
    pressureMode: number; // 1 压测方式
    createUser: string; // "lisong" 创建人
    pressureCount: number; // 1 压测次数
    taskId: number; // 491 最近一次压测任务ID
    status: number; // 40 最近一次压测任务状态
    pressureTime: number; // 1499934701 //压测时间
}

export interface IReturn {
    num: number; // 1 等于 输入page字段
    size: number; // 3 等于 输入size字段
    total: number; // 1 总数
    results: IReturnItem[];
}
