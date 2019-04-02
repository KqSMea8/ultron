/**
 * Copyright (c) 2018-present, Didi, Inc.
 * All rights reserved.
 *
 * @author lincalwanglifei@didichuxing
 *
 * @file The page class of Ultron
 */
import React from 'react';
import Layout from '@antd/layout';
import Menu, { ClickParam } from '@antd/menu';
import { RouteComponentProps } from 'react-router-dom';
import ApplicationContext from 'com/didichuxing/context/ApplicationContext';
import RouteArea from 'com/didichuxing/area/RouteArea';
import style from './Ultron.less';

interface IUltronRouteProps extends RouteComponentProps<{}> {
}

interface IUltronState {
    widgetType: string;
}

export default class Ultron extends React.Component<IUltronRouteProps, IUltronState> {

    constructor(props: IUltronRouteProps, context?: IUltronState) {
        super(props, context);
        this.state = {
            widgetType: /ultron/.test(this.props.location.pathname) ?
                this.props.location.pathname : '/ultron/interfaceTest'
        };
        this.changePathName = this.changePathName.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.changePathName(this.state.widgetType, this.props.location.search);
    }

    private changePathName(pathName: any, search?: string): void {
        this.props.location.pathname = pathName;
        this.props.history.push({
            pathname: pathName,
            search: search ? search : ''
        });
    }

    private onMenuClick(config: ClickParam): void {
        this.changePathName(config.key);
        this.setState({
            widgetType: config.key
        });
    }

    public render(): React.ReactNode {
        return (
            <Layout>
                <Layout.Header className={ style.header }>
                    <div className={ style.logo }>
                        { /*{ ApplicationContext.context.logoDesc }*/ }
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={ [`${ this.state.widgetType }`] }
                        className={ style.headerMenu }
                        onClick={ this.onMenuClick }
                    >
                        <Menu.Item key="/ultron/interfaceTest">接口级压测</Menu.Item>
                    </Menu>
                </Layout.Header>
                <Layout.Content className={ style.content }>
                    <RouteArea path={ this.state.widgetType }/>
                </Layout.Content>
                <Layout.Footer className={ style.footer }>
                    &copy; { ApplicationContext.context.copyright }
                </Layout.Footer>
            </Layout>
        );
    }
}
