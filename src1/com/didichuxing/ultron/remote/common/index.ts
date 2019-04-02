import { get, post } from 'com/didichuxing/ultron/remote/remoteProxy';
import * as GetGroups from 'com/didichuxing/ultron/remote/common/interfaces/IGetGroups';
import * as GetCircle from 'com/didichuxing/ultron/remote/common/interfaces/IGetCircle';
import * as GetCircles from 'com/didichuxing/ultron/remote/common/interfaces/IGetCircles';
import * as GetFileContent from 'com/didichuxing/ultron/remote/common/interfaces/IGetFileContent';
/**
 * 获取分组列表
 */
export function getGroups(params: GetGroups.IParams): Promise<GetGroups.IReturn> {
    return get<GetGroups.IParams, GetGroups.IReturn>(
        '/ultron/common/business/options', params
    );
}

/**
 * 获取小圆圈
 */
export function getCircle(params: GetCircle.IParams): Promise<GetCircle.IReturn> {
    return get<GetCircle.IParams, GetCircle.IReturn>(
        '/ultron/common/fetchCurrentTasks', params
    );
}

/**
 * 获取小圆圈
 */
export function getCircles(params: GetCircles.IParams): Promise<GetCircles.IReturn> {
    return get<GetCircles.IParams, GetCircles.IReturn>(
        '/ultron/common/fetchCurrentMessages', params
    );
}
/**
 * 文件服务查看
 */
export function getFileContent(params: GetFileContent.IParams): Promise<GetFileContent.IReturn> {
    return get<GetFileContent.IParams, GetFileContent.IReturn>(
        '/ultron/common/fetchFileContent', params
    );
}
