/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The Home page class of Index
 */

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import style from 'com/didichuxing/Index.less';

/**
 * @interface
 * The props of the Index component
 */
interface IIndexProps {}

/**
 * @interface
 * The route props of the Index component
 */
interface IIndexRouteProps extends RouteComponentProps<IIndexProps> {}

export default class Index extends React.Component<IIndexRouteProps, {}> {

    /**
     * @override
     * @inheritDoc
     * @returns {React.ReactNode}
     */
    public render(): React.ReactNode {
        return <div>Home</div>;
    }
}
