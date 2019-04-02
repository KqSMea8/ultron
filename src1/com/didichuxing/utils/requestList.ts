/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of requestList
 */

import { get, IRequestParams } from 'com/didichuxing/utils/request';

/**
 * 页面默认最多列表数。
 * @type {number}
 */
export const DEFAULT_PAGE_SIZE: number = 10;

/**
 * 当前页面页数，默认为第1页。
 * @type {number}
 */
export const DEFAULT_PAGE_NUMBER: number = 1;

export interface IPaginationRequestParams {
    readonly pageNum?: number;
    readonly pageSize?: number;
}

export interface IPaginationData<T> {
    readonly content: T[];
    readonly total: number;
}

/**
 * 用GET的形式获取列表数据。
 * @param {string} url
 * @param {IPaginationRequestParams} params
 * @returns {Promise<IPaginationData<T>>}
 */
export function getList<T>(url: string, params?: IRequestParams,
                           pageParam?: IPaginationRequestParams): Promise<IPaginationData<T>> {
    return get<IPaginationData<T>>(url, {
        ...params,
        pageNum: DEFAULT_PAGE_NUMBER,
        pageSize: DEFAULT_PAGE_SIZE,
        ...pageParam
    });
}
