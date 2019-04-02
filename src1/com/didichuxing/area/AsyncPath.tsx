/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of AsyncPath
 */

import React from 'react';
import AbstractAsync, { IAbstractAsyncProps } from 'com/didichuxing/area/AbstractAsync';

interface IAsyncRouteProps extends IAbstractAsyncProps {
    readonly path: string;
}

export default class AsyncPath extends AbstractAsync<IAsyncRouteProps> {

    /**
     * @override
     * @inheritDoc
     * @param {Readonly<IAsyncRouteProps>} nextProps
     * @returns {boolean}
     */
    protected needLoadComponent(nextProps: Readonly<IAsyncRouteProps>): boolean {
        return this.props.path !== nextProps.path;
    }
}
