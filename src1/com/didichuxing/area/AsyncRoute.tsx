/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of AsyncRoute
 */

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import AbstractAsync, { IAbstractAsyncProps } from 'com/didichuxing/area/AbstractAsync';

interface IAsyncRouteProps extends RouteComponentProps<any>, IAbstractAsyncProps {}

export default class AsyncRoute extends AbstractAsync<IAsyncRouteProps> {

    /**
     * @override
     * @inheritDoc
     * @param {Readonly<IAsyncRouteProps>} nextProps
     * @returns {boolean}
     */
    protected needLoadComponent(nextProps: Readonly<IAsyncRouteProps>): boolean {
        return this.props.match.path !== nextProps.match.path;
    }
}
