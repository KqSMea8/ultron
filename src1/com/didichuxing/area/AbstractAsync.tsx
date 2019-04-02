/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The abstract class of AbstractAsync
 */

import React from 'react';
import Progress from 'com/didichuxing/utils/Progress';
import { IDefaultComponentClass } from 'com/didichuxing/area/AbstractArea';

export interface IAbstractAsyncProps {
    component: Promise<IDefaultComponentClass>;
}

interface IAsyncRouteState {
    loaded: boolean;
}

export default abstract class AbstractAsync<P extends IAbstractAsyncProps>
    extends React.Component<P, IAsyncRouteState> {

    private componentClass: React.ComponentClass<any> = undefined as any;

    /**
     * @constructor
     * @param {IAsyncRouteProps} props
     */
    constructor(props: P, context?: any) {
        super(props, context);
        this.state = {
            loaded: false
        };
        this.loadComponent = this.loadComponent.bind(this);
    }

    /**
     * @override
     * @inheritDoc
     */
    public componentWillMount(): void {
        this.loadComponent();
    }

    /**
     * @override
     * @inheritDoc
     */
    private loadComponent(): void {
        Progress.start();
        this.props.component.then((defaultComponentClass: IDefaultComponentClass): void => {
            this.componentClass = defaultComponentClass.default;
            this.setState({ loaded: true }, Progress.done);
        });
    }

    /**
     * @override
     * @inheritDoc
     * @param {Readonly<P extends IAbstractAsyncProps>} nextProps
     * @param nextContext
     */
    public componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (this.needLoadComponent(nextProps)) {
            this.setState({ loaded: false }, this.loadComponent);
        }
    }

    /**
     * @abstract
     * @param {Readonly<P extends IAbstractAsyncProps>} nextProps
     * @returns {boolean}
     */
    protected abstract needLoadComponent(nextProps: Readonly<P>): boolean;

    /**
     * @override
     * @inheritDoc
     * @returns {React.ReactNode}
     */
    public render(): React.ReactNode {
        if (this.state.loaded) {
            return React.createElement(this.componentClass, this.props);
        } else {
            return null;
        }
    }
}
