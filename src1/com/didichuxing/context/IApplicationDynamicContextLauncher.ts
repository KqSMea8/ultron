/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The inferface of IApplicationDynamicContextLauncher
 */

import { IApplicationContext } from 'com/didichuxing/context/IApplicationContext';

export interface IApplicationDynamicContextLauncher<T extends IApplicationContext> {

    /**
     * 获取动态上下文信息。
     * @returns {Promise<T>}
     */
    getDynamicContext(): Promise<T>;
}
