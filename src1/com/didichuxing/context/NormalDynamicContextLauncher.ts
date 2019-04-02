/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of NormalDynamicContextLauncher
 */

import { IApplicationContext } from 'com/didichuxing/context/IApplicationContext';
import { IApplicationDynamicContextLauncher } from 'com/didichuxing/context/IApplicationDynamicContextLauncher';

interface INormalDynamicContext extends IApplicationContext {}

export default class NormalDynamicContextLauncher implements IApplicationDynamicContextLauncher<INormalDynamicContext> {

    /**
     * @override
     * @inheritDoc
     * @returns {Promise<T>}
     */
    public getDynamicContext(): Promise<INormalDynamicContext> {
        return Promise.resolve({});
    }
}
