import { get, post, put, DELETE } from '@ultron/remote/remoteProxy';
import * as IQueryPressurePlan from '@ultron/remote/testTask/interfaces/IQueryPressurePlan';
import * as GetPressureTaskList from '@ultron/remote/testTask/interfaces/IGetPressureTaskList';
import * as GetPressureTask from '@ultron/remote/testTask/interfaces/IGetPressureTask';
import * as GetPressureTaskError from '@ultron/remote/testTask/interfaces/IGetPressureTaskError';
import * as StopPressure from '@ultron/remote/testTask/interfaces/IStopPressure';
import * as GetHistories from '@ultron/remote/testTask/interfaces/IGetHistories';
import * as GetApis from '@ultron/remote/testTask/interfaces/IGetApis';
import * as GetStats from '@ultron/remote/testTask/interfaces/IGetStats';
import * as IGetRegions from '@ultron/remote/testTask/interfaces/IGetRegions';
import * as GetOdinTree from '@ultron/remote/testTask/interfaces/IGetOdinTree';
import * as IGetSamples from '@ultron/remote/testTask/interfaces/IGetSamples';
import * as IDeletePlan from '@ultron/remote/testTask/interfaces/IDeletePlan';
import * as IDeleteTask from '@ultron/remote/testTask/interfaces/IDeleteTask';

/**
 * 查询压测计划
 */
export function queryPressurePlans(params: IQueryPressurePlan.IParams): Promise<IQueryPressurePlan.IReturn> {
    return get<IQueryPressurePlan.IParams, IQueryPressurePlan.IReturn>(
        '/ultron/pressure/plans/list', params
    );
}

/**
 * 查看压测任务列表
 */
export function getPressureTaskList(params: GetPressureTaskList.IParams): Promise<GetPressureTaskList.IReturn> {
    return get<GetPressureTaskList.IParams, GetPressureTaskList.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks', params
    );
}

export interface IUrlParams {
    planId: string;
    taskId: string;
}

/**
 * 查看压测任务详情
 */
export function getPressureTask(params: GetPressureTask.IParams,
                                urlParams: IUrlParams): Promise<GetPressureTask.IReturn> {
    return get<GetPressureTask.IParams, GetPressureTask.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks/{taskId}/detail', params, urlParams
    );
}

/**
 * 错误列表
 */
export function getPressureTaskError(params: GetPressureTaskError.IParams,
                                     urlParams: IUrlParams): Promise<GetPressureTaskError.IReturn> {
    return get<GetPressureTaskError.IParams, GetPressureTaskError.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks/{taskId}/http/errors', params, urlParams
    );
}

/**
 * 停止压测
 */
export function stopPressure(params: StopPressure.IParams,
                             urlParams: IUrlParams): Promise<StopPressure.IReturn> {
    return put<StopPressure.IParams, StopPressure.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks/{taskId}/http/stop', params, urlParams
    );
}

/**
 * 历史
 */
export function getHistories(params: GetHistories.IParams,
                             urlParams: IUrlParams): Promise<GetHistories.IReturn> {
    return get<GetHistories.IParams, GetHistories.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks/{taskId}/http/configs/histories', params, urlParams
    );
}

/**
 * getApis
 */
export function getApis(params: GetApis.IParams,
                        urlParams: IUrlParams): Promise<GetApis.IReturn> {
    return get<GetApis.IParams, GetApis.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks/{taskId}/performance/apis', params, urlParams
    );
}

/**
 * getStats
 */
export function getStats(params: GetStats.IParams,
                         urlParams: IUrlParams): Promise<GetStats.IReturn> {
    return get<GetStats.IParams, GetStats.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks/{taskId}/performance/stats', params, urlParams
    );
}

/**
 * getRegions
 */
export function getRegions(params: IGetRegions.IParams): Promise<IGetRegions.IReturn> {
    return get<IGetRegions.IParams, IGetRegions.IReturn>(
        '/ultron/pressure/http/apps/regions', params
    );
}

/**
 * getOdinTree
 */
export function getOdinTree(params: GetOdinTree.IParams): Promise<GetOdinTree.IReturn> {
    return get<GetOdinTree.IParams, GetOdinTree.IReturn>(
        '/ultron/public/odin/tree', params
    );
}

/**
 * getSamples
 */
export function getSamples(params: IGetSamples.IParams,
                           urlParams: IUrlParams): Promise<IGetSamples.IReturn> {
    return get<IGetSamples.IParams, IGetSamples.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks/{taskId}/samples', params, urlParams
    );
}

/**
 * 删除压测计划
 */
export function deletePlan(params: IDeletePlan.IParams,
                           urlParams: IDeletePlan.IUrlParams): Promise<IDeletePlan.IReturn> {
    return DELETE<IDeletePlan.IParams, IDeletePlan.IReturn>(
        '/ultron/pressure/plans/{planId}', params, urlParams
    );
}
/**
 * 删除压测任务
 */
export function deleteTask(params: IDeleteTask.IParams,
                           urlParams: IDeleteTask.IUrlParams): Promise<IDeleteTask.IReturn> {
    return DELETE<IDeleteTask.IParams, IDeleteTask.IReturn>(
        '/ultron/pressure/plans/{planId}/tasks/{taskId}/delete', params, urlParams
    );
}
