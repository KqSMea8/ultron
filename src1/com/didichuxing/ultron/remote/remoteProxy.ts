import { IPlainObject } from 'com/didichuxing/IPlainObject';
import {
    get as requestGet,
    post  as requestPost,
    put as requestPut,
    DELETE as requestDelete
} from 'com/didichuxing/utils/request';
import { showStatus } from 'com/didichuxing/ultron/remote/modalStatus';

// let _HTTP_COUNT = 0;

function handleRestUrl(restUrl: string, urlParams: IPlainObject = {}, params?: IPlainObject): string {
    // const vNames: string[] = [];
    const realUrl = restUrl.replace(/\{[^\{\}]+\}/g, ($1) => {
        const vName: string = $1.slice(1, -1);
        // vNames.push(vName);

        if (urlParams[vName] != null) {
            return urlParams[vName];
        }
        if (params && params[vName] != null) {
            return params[vName];
        }
        return $1;
    });

    // isDeleteRestVar && vNames.forEach((it) => params[it] != null && (delete params[it]));

    const url = ('/api' + realUrl).replace('/api/ultron', '/ultronProxy');

    // if (url.indexOf('?') === -1) {
    //     url += '?';
    // }
    // url += '&_ts=' + (++_HTTP_COUNT);
    return url;
}

const catchHttpCode: any = (reason) => {
    const  reasonCode: number = reason ? +reason.code : 403;
    if (reasonCode === 302 && /(0\.0|183\.37|ultron\.intra|ultron-test)/.test(location.hostname)) {
        const jumpto = encodeURIComponent(location.href);
        const ssoUrl: string = `${ reason.data.url }&jumpto=${ jumpto }`;
        location.assign(ssoUrl);
    } else if (reasonCode === 403) {
        showStatus();
    }
};

const headers = {
    Host: 'ultron.intra.xiaojukeji.com'
};

export function get<P, R>(url: string, params: P, urlParams?: IPlainObject, customHeader?: any): Promise<R> {
    const header = Object.assign({}, headers, customHeader);
    return requestGet<R>(handleRestUrl(url, urlParams, params), params, header).catch(catchHttpCode);
}

export function post<P, R>(url: string, params: P, urlParams?: IPlainObject, customHeader?: any): Promise<R> {
    const hp = params instanceof FormData ? {} : { 'Content-Type': 'application/json; charset=utf-8;' };
    const header = Object.assign(hp, headers, customHeader);
    return requestPost<R>(handleRestUrl(url, urlParams, params), params, header).catch(catchHttpCode);
}

export function put<P, R>(url: string, params: P, urlParams?: IPlainObject, customHeader?: any): Promise<R> {
    const header = Object.assign({}, headers, customHeader);
    return requestPut<R>(handleRestUrl(url, urlParams, params), params, header).catch(catchHttpCode);
}

export function DELETE<P, R>(url: string, params: P, urlParams?: IPlainObject, customHeader?: any): Promise<R> {
    const hp = params instanceof FormData ? {} : { 'Content-Type': 'application/json; charset=utf-8;' };
    const header = Object.assign(hp, headers, customHeader);
    return requestDelete<R>(handleRestUrl(url, urlParams, params), params, header).catch(catchHttpCode);
}
