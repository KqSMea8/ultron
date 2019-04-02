/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The abstract class of AbstractArea
 */

import React from 'react';
import pathToRegexp from 'path-to-regexp';

export interface IDefaultComponentClass {
    /**
     * @readonly
     */
    readonly default: React.ComponentClass<any>;
}

export interface IPathDetail {
    componentClassName: string;
    isLeaf: boolean;
}

const pathAndComponentClassNameMapping: { [path: string]: IPathDetail } = {};

/**
 * @interface
 * The props of the AbstractArea component
 */
export interface IAbstractAreaProps {
    /**
     * @readonly
     * The path corresponding to the route path in the application-context.json.
     */
    readonly path: string;
}

export default abstract class AbstractArea<P extends IAbstractAreaProps, S = {}> extends React.Component<P, S> {

    /**
     * @override
     * @inheritDoc
     * @returns {React.ReactNode}
     */
    public render(): React.ReactNode {
        let path: string = this.props.path;
        for (const i in pathAndComponentClassNameMapping) {
            // 将URL转换成配置对象的key。
            // TODO: 这里的转化以后可能需要优化。
            if (pathAndComponentClassNameMapping.hasOwnProperty(i) && pathToRegexp(i).test(this.props.path)) {
                path = i;
                break;
            }
        }
        const pathDetail: IPathDetail = pathAndComponentClassNameMapping[path];
        return pathDetail ? this.renderArea(path, pathDetail) : null;
    }

    /**
     * @abstract
     * @param {string} path
     * @param {IPathDetail} pathDetail
     * @returns {React.ReactNode}
     */
    protected abstract renderArea(path: string, pathDetail: IPathDetail): React.ReactNode;
}
