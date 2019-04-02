/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of ApplicationContext
 */

import { IApplicationContext } from 'com/didichuxing/context/IApplicationContext';

export default abstract class ApplicationContext {

    /**
     * @readonly
     * 应用的上下文对象。
     */
    public static readonly context: IApplicationContext;
}
