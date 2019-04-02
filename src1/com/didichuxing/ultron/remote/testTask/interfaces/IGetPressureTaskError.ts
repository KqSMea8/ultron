export interface IParams { }

export interface IReturnErrorItem {
    code: string; // "5701",
    count: number; // 3,
    type: string; // "Http",
    message: string; //  "抱歉，当前车辆正在被邵师傅出车中，您暂时不能出车；如果您还有其它车辆，请到‘我-\u003e我的车辆’更换车辆",
    detail: string; // "",
    traceId: string; // "6445b7529f32854c177f005303144f99",
    uid: number; // 703687560856855
}
export interface IReturnErrorUrl {
    url: string; // "/gulfstream/api/v1/driver/dSetOnlineStatus",
    data: IReturnErrorItem[];
}

export interface IReturn {
    planId: number; // 71
    taskId: number; // 383
    errors: IReturnErrorUrl[];
}
