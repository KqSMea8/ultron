/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of RouteBlock
 */

import React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import AbstractArea, { IAbstractAreaProps, IPathDetail } from 'com/didichuxing/area/AbstractArea';
import AsyncRoute from 'com/didichuxing/area/AsyncRoute';

interface IRouteAreaProps extends RouteComponentProps<{}>, IAbstractAreaProps {}

class RouteArea extends AbstractArea<IRouteAreaProps, {}> {

    /**
     * @override
     * @inheritDoc
     * @param {string} path
     * @param {IPathDetail} pathDetail
     * @returns {React.ReactNode}
     */
    protected renderArea(path: string, pathDetail: IPathDetail): React.ReactNode {
        return (
            <Route
                path={ path }
                exact={ pathDetail.isLeaf }
                strict={ pathDetail.isLeaf }
                render={ this.renderAsyncRoute(pathDetail.componentClassName) }
            />
        );
    }

    /**
     * 渲染异步路由组件。
     * @param {string} componentClassName
     * @returns {(props: RouteComponentProps<any>) => React.ReactNode}
     */
    private renderAsyncRoute(componentClassName: string): ((props: RouteComponentProps<any>) => React.ReactNode) {
        return (props: RouteComponentProps<any>): React.ReactNode => (
            <AsyncRoute
                { ...props }
                component={ import(`./${componentClassName}`) }
            />
        );
    }

}

export default withRouter<IRouteAreaProps>(RouteArea);
