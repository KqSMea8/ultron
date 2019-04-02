import { get } from '@ultron/remote/remoteProxy';
import * as BusinessCapacity from '@ultron/remote/testPressure/interfaces/businessCapacity';
import * as ServiceCapacity from '@ultron/remote/testPressure/interfaces/serviceCapacity';
import * as BusinessDetails from '@ultron/remote/testPressure/interfaces/businessDetails';
import * as BusinessDetailsExpandLine from '@ultron/remote/testPressure/interfaces/BusinessDetailsExpandLine';
import * as BusinessDetailsModal from '@ultron/remote/testPressure/interfaces/BusinessDetailsModal';

/**
 * 查看服务容量
 */
export function ServiceCapacityParams(params: ServiceCapacity.IParams): Promise<ServiceCapacity.IReturn> {
    return get<ServiceCapacity.IParams, ServiceCapacity.IReturn>(
        '/ultron/pressure/plate/service', params
    );
}
/**
 * 查看业务容量
 */
export function BusinessCapacityParams(params: BusinessCapacity.IParams): Promise<any> {
    return get<ServiceCapacity.IParams, ServiceCapacity.IReturn>(
        '/ultron/cqi/business/indices', params
    );
}
/**
 * 业务度量详情
 */
export function BusinessDetailsParams(
    params: BusinessDetails.IParams,
    reportId: number
): Promise<BusinessDetails.IReturn> {
    return get<BusinessDetails.IParams, BusinessDetails.IReturn>(
        `/ultron/cqi/report/${reportId}`, params
    );
}
/**
 * 业务度量详情-展开行
 */
export function BusinessDetailsExpandLineParams(
    params: BusinessDetailsExpandLine.IParams,
    reportId: number,
    moduleId: number
): Promise<BusinessDetailsExpandLine.IReturn> {
    return get<BusinessDetailsExpandLine.IParams, BusinessDetailsExpandLine.IReturn>(
        `/ultron/cqi/report/${reportId}/module/${moduleId}`, params
    );
}
/**
 * 获取对话框数据
 */
export function BusinessDetailsModalParams(
    params: BusinessDetailsModal.IParams
): Promise<BusinessDetailsModal.IReturn> {
    return get<BusinessDetailsModal.IParams, BusinessDetailsModal.IReturn>(
        '/ultron/cqi/curve', params
    );
}
