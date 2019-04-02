import { get, post } from '@ultron/remote/remoteProxy';
import * as ISearch from '@ultron/remote/tool/interfaces/ISearch';
import * as IDecode from '@ultron/remote/tool/interfaces/ILangDecodeoid';
import * as IEncode from '@ultron/remote/tool/interfaces/IShortEncodeoid';
import * as IDistance from '@ultron/remote/tool/interfaces/IDistance';
import * as IGenJar from '@ultron/remote/tool/interfaces/IGenJar';
import * as IDownLoad from '@ultron/remote/tool/interfaces/IDownLoad';

/**
 * 获取场景压测详情
 */
export function getSearch(params: ISearch.IParams): Promise<ISearch.IReturn> {
    return get<ISearch.IParams, ISearch.IReturn>(
        '/ultron/tools/user/{checkValue}', params
    );
}
/**
 * 获取长订单decodeoid
 */
export function getDecode(params: IDecode.IParams): Promise<IDecode.IReturn> {
    return get<IDecode.IParams, IDecode.IReturn>(
      '/ultron/tools/decodeoid', params
    );
}
/**
 * 获取端订单encodeoid
 */
export function getEncode(params: IEncode.IParams): Promise<IEncode.IReturn> {
    return get<IEncode.IParams, IEncode.IReturn>(
        '/ultron/tools/encodeoid', params
    );
}
/**
 * 距离转换
 */
export function getDistance(params: IDistance.IParams): Promise<IDistance.IReturn> {
    return get<IDistance.IParams, IDistance.IReturn>(
        '/ultron/tools/distance', params
    );
}
/**
 * Jar包生成器
 */
export function getGenJar(params: IGenJar.IParams): Promise<IGenJar.IReturn> {
    return post<IGenJar.IParams, IGenJar.IReturn>(
        '/ultron/tools/genJar', params
    );
}
/**
 * Jar包下载
 */
export function downLoad(params: IDownLoad.IParams): Promise<IDownLoad.IReturn> {
    return get<IDownLoad.IParams, IDownLoad.IReturn>(
        '/ultron/tools/downloadJar', params
    );
}
