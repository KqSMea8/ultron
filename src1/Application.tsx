/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author Cory(kuanghongrui@didichuxing.com)
 *
 * @file The class of Application
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, RouteComponentProps, Redirect, withRouter } from 'react-router-dom';
import { IRouteConfig, IRouteConfigDetail } from 'com/didichuxing/context/IApplicationContext';
import { IApplicationDynamicContextLauncher } from 'com/didichuxing/context/IApplicationDynamicContextLauncher';
import NormalDynamicContextLauncher from 'com/didichuxing/context/NormalDynamicContextLauncher';
import ApplicationContext from 'com/didichuxing/context/ApplicationContext';
import AsyncRoute from 'com/didichuxing/area/AsyncRoute';
import { loadScript } from 'com/didichuxing/utils/loadScript';
import { getCookie } from '@ultron/business/common/http/cookies';
import style from 'Application.less';

import OmegaTracker from '@didi/omega-tracker';

// const Omega = OmegaTracker.getTracker({
//     appKey: 'XXXXX'
// });
//
// Omega.trackEvent('test-09988');

interface IApplicationProps extends RouteComponentProps<{}> {}

interface IApplicationState {
    isDynamicContextLaunched: boolean;
}

export default class Application extends React.Component<IApplicationProps, IApplicationState> {

    private routes: React.ReactNode[] = [];

    private dynamicContextLauncher: IApplicationDynamicContextLauncher<any>;

    constructor(props: IApplicationProps, context?: any) {
        super(props, context);
        this.state = {
            isDynamicContextLaunched: false
        };
        this.dynamicContextLauncher = new NormalDynamicContextLauncher();
        this.dynamicContextLauncher.getDynamicContext().then((data: any): void => {
            Object.assign(ApplicationContext.context, data);
            this.setState({
                isDynamicContextLaunched: true
            });
        });
    }

    /**
     * @override
     * @inheritDoc
     */
    public componentWillMount(): void {
        loadScript('http://bamai.xiaojukeji.com/common/static/feedbackSDK/feedback-sdk.js').then(() => {
            window['feedbackSDK'] && window['feedbackSDK'].create({ type: 'Ultron', username: getCookie().username });
        });
        const routeConfig: IRouteConfig = ApplicationContext.context.routes || {};
        for (const i in routeConfig) {
            if (routeConfig[i]) {
                let routeConfigValue: string | IRouteConfigDetail = routeConfig[i];
                let exact = false;
                let strict = false;
                let componentClassName = '';
                switch (Object.prototype.toString.call(routeConfigValue)) {
                    case '[object String]':
                        exact = true;
                        strict = true;
                        componentClassName = routeConfigValue as string;
                        break;
                    case '[object Object]':
                        routeConfigValue = routeConfigValue as IRouteConfigDetail;
                        componentClassName = routeConfigValue.component as string;
                        if (!routeConfigValue.routes || !Object.keys(routeConfigValue.routes).length) {
                            exact = true;
                            strict = true;
                        }
                        break;
                }
                if (componentClassName) {
                    this.routes.push(
                        <Route
                            path={ i }
                            key={ `__route_path_${ i }` }
                            exact={ exact }
                            strict={ strict }
                            render={ this.renderAsyncRoute(componentClassName) }
                        />
                    );
                }
            }
        }
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

    /**
     * @override
     * @returns {React.ReactNode}
     */
    public render(): React.ReactNode {
        if (this.state.isDynamicContextLaunched) {
            if (this.props.location.pathname === '/' && this.props.match.url !== ApplicationContext.context.homePath) {
                return (<Redirect to={ ApplicationContext.context.homePath || '' }/>);
            }
            return (<div className={ style.appContainer }>{ this.routes }</div>);
        }
        return null;
    }
}

const AppRouteWrapper: React.ComponentClass = withRouter<IApplicationProps>(Application);
const container: Element = document.createElement('div');
container.classList.add(style.app);
document.body.appendChild(container);
ReactDOM.render(
    <Router>
        <AppRouteWrapper />
    </Router>
    ,
    container
);
