import { get, post, put } from 'com/didichuxing/ultron/remote/remoteProxy';
import * as targetList from 'com/didichuxing/ultron/remote/plate/interfaces/targetList';
import * as moduleList from 'com/didichuxing/ultron/remote/plate/interfaces/moduleList';
import * as businessOptionsList from 'com/didichuxing/ultron/remote/plate/interfaces/businessOptionsList';
import * as targetDetaile from 'com/didichuxing/ultron/remote/plate/interfaces/targetDetail';
import * as targetEcharts from 'com/didichuxing/ultron/remote/plate/interfaces/targetDetailEcharts';
import * as indicatorUpdate from 'com/didichuxing/ultron/remote/plate/interfaces/indicatorUpdate';
import * as history from 'com/didichuxing/ultron/remote/plate/interfaces/targetDetailHistory';
import * as moduleEcharts from 'com/didichuxing/ultron/remote/plate/interfaces/moduleDetailEcharts';
import * as moduleHistory from 'com/didichuxing/ultron/remote/plate/interfaces/moduleDetailHistory';
import * as reportOptions from 'com/didichuxing/ultron/remote/plate/interfaces/reportOptions';
import * as reportDataType from 'com/didichuxing/ultron/remote/plate/interfaces/reportDataType';
import * as reportDataGroup from 'com/didichuxing/ultron/remote/plate/interfaces/reportDataGroup';
import * as reportCreate from 'com/didichuxing/ultron/remote/plate/interfaces/reportCreate';
import * as moduleApis from 'com/didichuxing/ultron/remote/plate/interfaces/moduleApis';
import * as indicatorUpdateRecord from 'com/didichuxing/ultron/remote/plate/interfaces/indicatorUpdateRecord';
import * as indicatorDetail from 'com/didichuxing/ultron/remote/plate/interfaces/indicatorDetail';
import * as dataGroupModule from 'com/didichuxing/ultron/remote/plate/interfaces/dataGroupModule';
import * as dataGroupClusters from 'com/didichuxing/ultron/remote/plate/interfaces/dataGroupClusters';
import * as dataGroupCreate from 'com/didichuxing/ultron/remote/plate/interfaces/dataGroupCreate';
import * as dataGroupQueryServices from 'com/didichuxing/ultron/remote/plate/interfaces/dataGroupQueryServices';
import * as moduleQuery from 'com/didichuxing/ultron/remote/plate/interfaces/moduleQuery';
import * as moduleUpdate from 'com/didichuxing/ultron/remote/plate/interfaces/moduleUpdate';
import * as moduleQueryExist from 'com/didichuxing/ultron/remote/plate/interfaces/moduleQueryExist';
export interface IUrlParams {
}
/**
 * 核心指标
 * @param params
 * @param urlParams
 * @returns {Promise<targetList.IReturn>}
 */
export function targetLists(params: targetList.IParams,
                            urlParams: IUrlParams): Promise<targetList.IReturn> {
    return get<targetList.IParams, targetList.IReturn>(
        '/ultron/cqi/business/{businessId}/indicators', params, urlParams
    );
}
/**
 * 核心模块
 * @param params
 * @param urlParams
 * @returns {Promise<moduleList.IReturn>}
 */
export function moduleLists(params: moduleList.IParams,
                            urlParams: IUrlParams): Promise<moduleList.IReturn> {
    return get<moduleList.IParams, moduleList.IReturn>(
        '/ultron/cqi/business/{businessId}/modules', params, urlParams
    );
}
/**
 * 导航业务线
 * @param params
 * @param urlParams
 * @returns {Promise<businessOptionsList.IReturn>}
 */
export function businessOptionsLists(params: businessOptionsList.IParams,
                                     urlParams: IUrlParams): Promise<businessOptionsList.IReturn> {
    return get<businessOptionsList.IParams, businessOptionsList.IReturn>(
        '/ultron/cqi/business/options', params, urlParams
    );
}
/**
 * 容量指标详情接口
 * @param params
 * @param urlParams
 * @returns {Promise<targetDetaile.IReturn>}
 */
export function targetDetail(params: targetDetaile.IParams,
                             urlParams: targetDetaile.IUrlParams): Promise<targetDetaile.IReturn> {
    return get<targetDetaile.IParams, targetDetaile.IReturn>(
        '/ultron/cqi/capacity/indicator/{id}', params, urlParams
    );
}
/**
 * 获取echarts图表数据
 * @param params
 * @param urlParams
 * @returns {Promise<targetEcharts.IReturn>}
 */
export function targetDetailEcharts(params: targetEcharts.IParams,
                                    urlParams: targetEcharts.IUrlParams): Promise<targetEcharts.IReturn> {
    return get<targetEcharts.IParams, targetEcharts.IReturn>(
        '/ultron/cqi/capacity/indicator/{id}/curve', params, urlParams
    );
}
/**
 * target容量历史
 * @param params
 * @param urlParams
 * @returns {Promise<history.IReturn>}
 */
export function targetDetailHistory(params: history.IParams,
                                    urlParams: history.IUrlParams): Promise<history.IReturn> {
    return get<history.IParams, history.IReturn>(
        '/ultron/cqi/capacity/indicator/{id}/histories', params, urlParams
    );
}
/**
 * 模块echarts图表
 * @param params
 * @param urlParams
 * @returns {Promise<moduleEcharts.IReturn>}
 */
export function moduleDetailEcharts(params: moduleEcharts.IParams,
                                    urlParams: moduleEcharts.IUrlParams): Promise<moduleEcharts.IReturn> {
    return get<moduleEcharts.IParams, moduleEcharts.IReturn>(
        '/ultron/cqi/module/{moduleId}/indicators', params, urlParams
    );
}
/**
 * 模块容量历史
 * @param params
 * @param urlParams
 * @returns {Promise<moduleHistory.IReturn>}
 */
export function moduleDetailHistory(params: moduleHistory.IParams,
                                    urlParams: moduleHistory.IUrlParams): Promise<moduleHistory.IReturn> {
    return get<moduleHistory.IParams, moduleHistory.IReturn>(
        '/ultron/cqi/module/{moduleId}/histories', params, urlParams
    );
}
/**
 * 所有业务模块
 * @param params
 * @returns {Promise<moduleHistory.IReturn>}
 */
export function modulesOptions(params: any, businessId: string): Promise<moduleHistory.IReturn> {
    return get<moduleHistory.IParams, moduleHistory.IReturn>(
        `/ultron/cqi/business/${businessId}/modules/options/all`, params
    );
}
/**
 * 所有业务线
 * @param params
 * @returns {Promise<moduleHistory.IReturn>}
 */
export function businessOptions(params: any): Promise<moduleHistory.IReturn> {
    return get<moduleHistory.IParams, moduleHistory.IReturn>(
        '/ultron/cqi/business/options/all', params
    );
}
/**
 * 修改容量指标全部信息
 * @param params
 * @returns {Promise<indicatorDetail.IReturn>}
 */
export function cqiIndicatorDetail(params: any, indicatorId): Promise<indicatorDetail.IReturn> {
    return get<indicatorDetail.IParams, indicatorDetail.IReturn>(
        `/ultron/cqi/capacity/indicator/${indicatorId}/detail`, params
    );
}
/**
 * 创建容量指标
 * @param params
 * @returns {Promise<moduleHistory.IReturn>}
 */
export function indicatorCreate(params: any): Promise<moduleHistory.IReturn> {
    return post<moduleHistory.IParams, moduleHistory.IReturn>(
        '/ultron/cqi/capacity/indicator/create', params
    );
}
/**
 * 修改容量指标
 * @param params
 * @returns {Promise<moduleHistory.IReturn>}
 */
export function cqiIndicatorUpdate(params: any, id
    ): Promise<indicatorUpdate.IReturn> {
    const header = { 'Content-Type': 'application/json' };
    return put<indicatorUpdate.IParams, indicatorUpdate.IReturn>(
        `/ultron/cqi/capacity/indicator/${id}/update`, params, undefined, header
    );
}
/**
 * 报告列表
 * @param params
 * @returns {Promise<reportOptions.IReturn>}
 */
export function cqiReportOptions(params: reportOptions.IParams): Promise<reportOptions.IReturn> {
    return get<reportOptions.IParams, reportOptions.IReturn>(
        '/ultron/cqi/report/options', params
    );
}
/**
 * 新建报告 数据类型
 * @param params
 * @returns {Promise<reportDataType.IReturn>}
 */
export function cqiReportDataType(params: reportDataType.IParams): Promise<reportDataType.IReturn> {
    return get<reportDataType.IParams, reportDataType.IReturn>(
        '/ultron/cqi/report/dataType', params
    );
}
/**
 * 新建报告 数据组列表
 * @param params
 * @returns {Promise<reportDataGroup.IReturn>}
 */
export function cqiReportDataGroup(params: reportDataGroup.IParams): Promise<reportDataGroup.IReturn> {
    return get<reportDataGroup.IParams, reportDataGroup.IReturn>(
        '/ultron/cqi/dataGroup/queryAllDataGroupIdsAndNames', params
    );
}
/**
 * 新建报告 新建报告
 * @param params
 * @returns {Promise<reportCreate.IReturn>}
 */
export function cqiReportCreate(params: reportCreate.IParams): Promise<reportCreate.IReturn> {
    return post<reportCreate.IParams, reportCreate.IReturn>(
        '/ultron/cqi/report/create', params
    );
}
/**
 * 新建报告 模块所有api
 * @param params
 * @returns {Promise<moduleApis.IReturn>}
 */
export function cqiModuleApis(params: moduleApis.IParams, moduleId: number | string): Promise<moduleApis.IReturn> {
    return get<moduleApis.IParams, moduleApis.IReturn>(
        `/ultron/cqi/module/${moduleId}/apis`, params
    );
}
/**
 * 新建压测历史
 * @param params
 * @returns {Promise<indicatorUpdateRecord.IReturn>}
 */
export function cqiIndicatorUpdateRecord(params: indicatorUpdateRecord.IParams, id: string)
: Promise<indicatorUpdateRecord.IReturn> {
    return post<indicatorUpdateRecord.IParams, indicatorUpdateRecord.IReturn>(
        `/ultron/cqi/capacity/indicator/${id}/updateRecord`, params
    );
}
/**
 * 按集群获取模块信息
 * @param params
 * @returns {Promise<dataGroupModule.IReturn>}
 */
export function cqiDataGroupModule(params: dataGroupModule.IParams)
: Promise<dataGroupModule.IReturn> {
    return get<dataGroupModule.IParams, dataGroupModule.IReturn>(
        '/ultron/cqi/dataGroup/module', params
    );
}
/**
 * 获取所有集群
 * @param params
 * @returns {Promise<dataGroupClusters.IReturn>}
 */
export function cqiDataGroupClusters(params: dataGroupClusters.IParams)
: Promise<dataGroupClusters.IReturn> {
    return get<dataGroupClusters.IParams, dataGroupClusters.IReturn>(
        '/ultron/cqi/dataGroup/clusters', params
    );
}
/**
 * 新建数据组
 * @param params
 * @returns {Promise<dataGroupCreate.IReturn>}
 */
export function cqiDataGroupCreate(params: dataGroupCreate.IParams)
: Promise<dataGroupCreate.IReturn> {
    return post<dataGroupCreate.IParams, dataGroupCreate.IReturn>(
        '/ultron/cqi/dataGroup/create', params
    );
}
/**
 * 数据组详情
 * @param params
 * @returns {Promise<dataGroupQueryServices.IReturn>}
 */
export function cpqDataGroupQueryServices(params: dataGroupQueryServices.IParams, id: number)
: Promise<dataGroupQueryServices.IReturn> {
    return get<dataGroupQueryServices.IParams, dataGroupQueryServices.IReturn>(
        `/ultron/cqi/dataGroup/${id}/queryServices`, params
    );
}
/**
 * 服务模块详情
 * @param params
 * @returns {Promise<moduleQuery.IReturn>}
 */
export function cqiModuleQuery(params: moduleQuery.IParams)
: Promise<moduleQuery.IReturn> {
    return get<moduleQuery.IParams, moduleQuery.IReturn>(
        '/ultron/cqi/service/module/query', params
    );
}
/**
 * 更新模块详情
 * @param params
 * @returns {Promise<moduleUpdate.IReturn>}
 */
export function cpiModuleUpdate(params: moduleUpdate.IParams)
: Promise<moduleUpdate.IReturn> {
    return post<moduleUpdate.IParams, moduleUpdate.IReturn>(
        '/ultron/cqi/service/module/create', params
    );
}
/**
 * 是否有配置
 * @param params
 * @returns {Promise<moduleQueryExist.IReturn>}
 */
export function cqiModuleQueryExist(params: moduleQueryExist.IParams)
: Promise<moduleQueryExist.IReturn> {
    return get<moduleQueryExist.IParams, moduleQueryExist.IReturn>(
        '/ultron/cqi/service/module/queryExist', params
    );
}
