/**
 * Created by didi on 2018/7/3.
 */
import { get, post } from 'com/didichuxing/ultron/remote/remoteProxy';
import * as ICreatConfigHS from 'com/didichuxing/ultron/remote/testConfig/interfaces/ICreatConfigHttpSingle';
import * as ICreatConfigHM from 'com/didichuxing/ultron/remote/testConfig/interfaces/ICreatConfigHttpMulti';
import * as ICreatConfigScene from 'com/didichuxing/ultron/remote/testConfig/interfaces/ICreatConfigScene';
import * as ICreatConfigThrift from '@ultron/remote/testConfig/interfaces/ICreatConfigThrift';
import * as GetPressureDetailsHS from 'com/didichuxing/ultron/remote/testConfig/interfaces/IGetHttpSinglePressurePlan';
import * as GetPressureDetailsHM from 'com/didichuxing/ultron/remote/testConfig/interfaces/IGetHttpMultiPressurePlan';
import * as GetPressureDetailsS from 'com/didichuxing/ultron/remote/testConfig/interfaces/IGetScenePressurePlan';
import * as GetPressureDetailsT from '@ultron/remote/testConfig/interfaces/IGetThriftPressurePlan';
import * as UpdataConfigHS from 'com/didichuxing/ultron/remote/testConfig/interfaces/IUpdataConfigHttpSingle';
import * as UpdataConfigHM from 'com/didichuxing/ultron/remote/testConfig/interfaces/IUpdataConfigHttpMulti';
import * as UpdataConfigScene from 'com/didichuxing/ultron/remote/testConfig/interfaces/IUpdataConfigScene';
import * as UpdataConfigThrift from '@ultron/remote/testConfig/interfaces/IUpdataConfigThrift';
import * as UploadCsv from 'com/didichuxing/ultron/remote/testConfig/interfaces/IUploadCsvFile';
import * as UploadLog from 'com/didichuxing/ultron/remote/testConfig/interfaces/IUploadLogFile';
import * as GetThriftProtocoList from '@ultron/remote/testConfig/interfaces/IGetThriftProtocolList';
import * as GetThriftTypeList from '@ultron/remote/testConfig/interfaces/IGetThriftTypeList';
import * as IGetEndpointsList from '@ultron/remote/testConfig/interfaces/IGetEndpointsList';
import * as IGetJarFile from '@ultron/remote/testConfig/interfaces/IGetJarFile';
import * as UploadInterface from '@ultron/remote/testConfig/interfaces/IUploadInterfaceFile';
import * as GetApi from '@ultron/remote/testConfig/interfaces/IGetApis';
import * as GetReports from '@ultron/remote/testConfig/interfaces/IGetReports';

/**
 * 创建单接口压测
 */
export function createConfigHttpSingle(params: ICreatConfigHS.IParams,
                                       customHeader: ICreatConfigHS.ICustomHeader): Promise<ICreatConfigHS.IReturn> {
    return post<ICreatConfigHS.IParams, ICreatConfigHS.IReturn>(
        '/ultron/pressure/plans/single/create', params, [], customHeader
    );
}

/**
 * 创建多接口压测
 */
export function createConfigHttpMulti(params: ICreatConfigHM.IParams,
                                      customHeader: ICreatConfigHS.ICustomHeader): Promise<ICreatConfigHM.IReturn> {
    return post<ICreatConfigHM.IParams, ICreatConfigHM.IReturn>(
        '/ultron/pressure/plans/replay/create', params, [], customHeader
    );
}

/**
 * 创建场景压测
 */
export function createConfigScene(params: ICreatConfigScene.IParams,
                                  customHeader: ICreatConfigHS.ICustomHeader): Promise<ICreatConfigScene.IReturn> {
    return post<ICreatConfigScene.IParams, ICreatConfigScene.IReturn>(
        '/ultron/pressure/plans/scene/create', params, [], customHeader
    );
}

/**
 * 创建Thrift压测
 */
export function createConfigThrift(params: ICreatConfigThrift.IParams,
                                   customHeader: ICreatConfigHS.ICustomHeader): Promise<ICreatConfigThrift.IReturn> {
    return post<ICreatConfigThrift.IParams, ICreatConfigThrift.IReturn>(
        '/ultron/pressure/plans/thrift/create', params, [], customHeader
    );
}

/**
 * 获取单接口压测详情
 */
export function getPressureDetailsHS(params: GetPressureDetailsHS.IParams): Promise<GetPressureDetailsHS.IReturn> {
    return get<GetPressureDetailsHS.IParams, GetPressureDetailsHS.IReturn>(
        '/ultron/pressure/plans/{planId}/single/detail', params
    );
}

/**
 * 获取多接口压测详情
 */
export function getPressureDetailsHM(params: GetPressureDetailsHM.IParams): Promise<GetPressureDetailsHM.IReturn> {
    return get<GetPressureDetailsHM.IParams, GetPressureDetailsHM.IReturn>(
        '/ultron/pressure/plans/{planId}/replay/detail', params
    );
}

/**
 * 获取场景压测详情
 */
export function getPressureDetailsScene(params: GetPressureDetailsS.IParams): Promise<GetPressureDetailsS.IReturn> {
    return get<GetPressureDetailsS.IParams, GetPressureDetailsS.IReturn>(
        '/ultron/pressure/plans/{planId}/scene/detail', params
    );
}

/**
 * 获取Thrift压测详情
 */
export function getPressureDetailsThrift(params: GetPressureDetailsT.IParams): Promise<GetPressureDetailsT.IReturn> {
    return get<GetPressureDetailsT.IParams, GetPressureDetailsT.IReturn>(
        '/ultron/pressure/plans/{planId}/thrift/detail', params
    );
}

/**
 * 获取Endpoints列表详情
 */
export function getEndpointsList(params: IGetEndpointsList.IParams): Promise<IGetEndpointsList.IReturn> {
    return get<IGetEndpointsList.IParams, IGetEndpointsList.IReturn>(
        '/ultron/public/disf/endpoints', params
    );
}

/**
 * 更新单接口压测计划
 */
export function updataConfigHS(params: UpdataConfigHS.IParams,
                               urlParams: UpdataConfigHS.IUrlParams): Promise<UpdataConfigHS.IReturn> {
    return post<UpdataConfigHS.IParams, UpdataConfigHS.IReturn>(
        '/ultron/pressure/plans/{planId}/single/update', params, urlParams
    );
}

/**
 * 更新多接口压测计划
 */
export function updataConfigHM(params: UpdataConfigHM.IParams,
                               urlParams: UpdataConfigHS.IUrlParams): Promise<UpdataConfigHM.IReturn> {
    return post<UpdataConfigHM.IParams, UpdataConfigHM.IReturn>(
        '/ultron/pressure/plans/{planId}/replay/update', params, urlParams
    );
}

/**
 * 更新场景压测计划
 */
export function updataConfigScene(params: UpdataConfigScene.IParams,
                                  urlParams: UpdataConfigScene.IUrlParams): Promise<UpdataConfigScene.IReturn> {
    return post<UpdataConfigScene.IParams, UpdataConfigScene.IReturn>(
        '/ultron/pressure/plans/{planId}/scene/update', params, urlParams
    );
}

/**
 * 更新Thrift压测计划
 */
export function updataConfigThrift(params: UpdataConfigThrift.IParams,
                                   urlParams: UpdataConfigThrift.IUrlParams): Promise<UpdataConfigThrift.IReturn> {
    return post<UpdataConfigThrift.IParams, UpdataConfigThrift.IReturn>(
        '/ultron/pressure/plans/{planId}/thrift/update', params, urlParams
    );
}

/**
 * 获取Thrift压测协议列表
 */
export function getThriftProtocoList(params: GetThriftProtocoList.IParams): Promise<GetThriftProtocoList.IReturn> {
    return get<GetThriftProtocoList.IParams, GetThriftProtocoList.IReturn>(
        '/ultron/common/thrift/protocol', params
    );
}

/**
 * 获取Thrift数据类型列表
 */
export function getThriftTypeList(params: GetThriftTypeList.IParams): Promise<GetThriftTypeList.IReturn> {
    return get<GetThriftTypeList.IParams, GetThriftTypeList.IReturn>(
        '/ultron/common/thrift/dataType', params
    );
}

/**
 * 上传csv文件接口
 */
export function uploadCsv(params: UploadCsv.IParams): Promise<UploadCsv.IReturn> {
    return post<UploadCsv.IParams, UploadCsv.IReturn>(
        '/ultron/file/upload/paramFile', params
    );
}
/**
 * 日志上传接口
 */
export function uploadLog(params: UploadLog.IParams): Promise<UploadLog.IReturn> {
    return post<UploadLog.IParams, UploadLog.IReturn>(
        '/ultron/file/upload/logFile', params
    );
}
/**
 * Jar包上传接口
 */
export function jarFile(params: IGetJarFile.IParams): Promise<IGetJarFile.IReturn> {
    return post<IGetJarFile.IParams, IGetJarFile.IReturn>(
        '/ultron/file/upload/jarFile', params
    );
}
/**
 * 文件列表上传接口
 */
export function interfaceFile(params: UploadInterface.IParams): Promise<UploadInterface.IReturn> {
    return post<UploadInterface.IParams, UploadInterface.IReturn>(
        '/ultron/file/upload/interfaceFile', params
    );
}
/**
 * 获取Api
 */
export function getApi(params: GetApi.IParams,
                       urlParams: GetApi.IUrlParams): Promise<GetApi.IReturn> {
    return get<GetApi.IParams, GetApi.IReturn>(
        '/ultron/pressure/plans/{planId}/apis', params, urlParams
    );
}
/**
 * 获取Reports
 */
export function getReports(params: GetReports.IParams,
                           urlParams: GetReports.IUrlParams): Promise<GetReports.IReturn> {
    return get<GetReports.IParams, GetReports.IReturn>(
        '/ultron/pressure/plans/{planId}/reports', params, urlParams
    );
}
