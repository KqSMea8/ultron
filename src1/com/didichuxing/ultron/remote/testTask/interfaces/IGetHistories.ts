export interface IParams {
    planId: string;
    taskId: string;
}

export interface IReturnContent {
    qps: number; // 10,
    unit: number; // 1,
    rampup: number; // 10,
    duration: number; // 120
}

export interface IReturn {
    1: {
        createAt: string; // 1531723335,
        configs: {
            EXPECT_PRESSURES: {
                content: IReturnContent[];
                version: number; // 1
            },
            AGENT_COUNT: {
                content: {
                    count: number; // 1
                },
                version: number; // 1
            }
        }
    };
}
