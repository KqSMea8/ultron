/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of PathArea
 */

import React from 'react';
import AbstractArea, { IAbstractAreaProps, IPathDetail } from 'com/didichuxing/area/AbstractArea';
import AsyncPath from 'com/didichuxing/area/AsyncPath';

/**
 * @interface
 * The props of the PathArea component
 */
interface IPathAreaProps extends IAbstractAreaProps {}

/**
 * @interface
 * The state of the PathArea component
 */
interface IPathAreaState {}

export default class PathArea extends AbstractArea<IPathAreaProps, IPathAreaState> {

    /**
     * @override
     * @inheritDoc
     * @param {string} path
     * @param {IPathDetail} pathDetail
     * @returns {React.ReactNode}
     */
    protected renderArea(path: string, pathDetail: IPathDetail): React.ReactNode {
        return (
            <AsyncPath
                path={ path }
                component={ import(`./${pathDetail.componentClassName}`) }
            />
        );
    }
}
