import { get, post } from 'com/didichuxing/ultron/remote/remoteProxy';
import * as StartPressure from 'com/didichuxing/ultron/remote/testMode/interfaces/IStartPressureMeasurement';
import * as AdjustmentPressure from 'com/didichuxing/ultron/remote/testMode/interfaces/IAdjustmentPressure';
import * as IGetAgentNum from 'com/didichuxing/ultron/remote/testMode/interfaces/IGetAgentNum';

/**
 * 开始压测
 */
export function startPressureMeasurement(params: StartPressure.IParams,
                                         urlParams: { planId: string }): Promise<StartPressure.IReturn> {
    return post<StartPressure.IParams, StartPressure.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks/create', params, urlParams
    );
}

export interface IUrlParams {
    planId: string;
    taskId: string;
}

/**
 * 调整压力
 */
export function adjustmentPressure(params: AdjustmentPressure.IParams,
                                   urlParams: IUrlParams): Promise<AdjustmentPressure.IReturn> {
    return post<AdjustmentPressure.IParams, AdjustmentPressure.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks/{taskId}/update', params, urlParams
    );
}
/**
 * 获取agent数量
 * @param params
 * @returns {Promise<IGetAgentNum.IReturn>}
 */
export function getAgentNum(params: IGetAgentNum.IParams): Promise<IGetAgentNum.IReturn> {
    return get<IGetAgentNum.IParams, IGetAgentNum.IReturn>(
        '/ultron/pressure/apps/idleAgents', params
    );
}
